/* assets/app.js — shared Studio, Standards, and commerce behavior */
(() => {
  'use strict';

  const CAMPAIGN_STORAGE_KEY = 'undone_campaign_v1';

  document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const state = { prefersReducedMotion, heroIntroActive: true };

    window.__HERO_INTRO_ACTIVE__ = true;

    setIsReady(state);
    setupReveal('.std-reveal:not(#hero)', 'is-visible', state);
    setupReveal('.studio-reveal', 'is-visible', state);
    setupAccordions();
    setupSmoothAnchors(state);
    setupHeroDotReveal(state);
    initStudioHeroCanvas(state);
    initCommerce();
  });

  function setIsReady(state) {
    const root = document.documentElement;
    if (state.prefersReducedMotion) {
      root.classList.add('is-ready');
      return;
    }
    window.setTimeout(() => root.classList.add('is-ready'), 420);
  }

  function setupReveal(selector, visibleClass, state) {
    const elements = document.querySelectorAll(selector);
    if (!elements.length) return;

    if (state.prefersReducedMotion || !('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add(visibleClass));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add(visibleClass);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    elements.forEach((element) => observer.observe(element));
  }

  function setupAccordions() {
    const headers = document.querySelectorAll('.std-accordion-header');
    if (!headers.length) return;

    headers.forEach((header) => {
      const item = header.closest('.std-accordion-item');
      if (!item) return;

      const expanded = item.getAttribute('aria-expanded') === 'true';
      header.setAttribute('aria-expanded', String(expanded));

      header.addEventListener('click', () => {
        const isExpanded = item.getAttribute('aria-expanded') === 'true';
        const group = item.closest('.std-accordion-group');

        if (group) {
          group.querySelectorAll('.std-accordion-item').forEach((groupItem) => {
            groupItem.setAttribute('aria-expanded', 'false');
            const groupHeader = groupItem.querySelector('.std-accordion-header');
            if (groupHeader) groupHeader.setAttribute('aria-expanded', 'false');
          });
        }

        item.setAttribute('aria-expanded', String(!isExpanded));
        header.setAttribute('aria-expanded', String(!isExpanded));
      });
    });
  }

  function setupSmoothAnchors(state) {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (event) => {
        const href = anchor.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({
          behavior: state.prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start',
        });
      });
    });
  }

  function setupHeroDotReveal(state) {
    const dot = document.querySelector('.hero-dot-pop');
    if (!dot) {
      state.heroIntroActive = false;
      window.__HERO_INTRO_ACTIVE__ = false;
      return;
    }

    if (state.prefersReducedMotion) {
      dot.classList.add('revealed');
      state.heroIntroActive = false;
      window.__HERO_INTRO_ACTIVE__ = false;
      return;
    }

    dot.classList.remove('revealed');
    const crisp = document.querySelector('.hero-layer--crisp');
    const { delayMs, durationMs } = getFirstAnimationTiming(crisp);
    const revealAt = Math.max(650, Math.round(delayMs + durationMs * 0.92));

    requestAnimationFrame(() => {
      dot.getBoundingClientRect();
      window.setTimeout(() => {
        dot.classList.add('revealed');
        state.heroIntroActive = false;
        window.__HERO_INTRO_ACTIVE__ = false;
      }, revealAt);
    });
  }

  function getFirstAnimationTiming(element) {
    if (!element) return { delayMs: 380, durationMs: 1650 };
    const styles = window.getComputedStyle(element);
    const duration = (styles.animationDuration || '').split(',')[0].trim();
    const delay = (styles.animationDelay || '').split(',')[0].trim();
    return {
      durationMs: cssTimeToMs(duration, 1650),
      delayMs: cssTimeToMs(delay, 380),
    };
  }

  function cssTimeToMs(value, fallback) {
    if (!value) return fallback;
    if (value.endsWith('ms')) {
      const number = Number.parseFloat(value);
      return Number.isFinite(number) ? number : fallback;
    }
    if (value.endsWith('s')) {
      const number = Number.parseFloat(value);
      return Number.isFinite(number) ? number * 1000 : fallback;
    }
    const number = Number.parseFloat(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function initCommerce() {
    const commerce = window.UndoneCommerce;
    if (!commerce) return;

    const campaign = captureCampaign(commerce.campaignKeys);
    const pageProductId = document.body.dataset.product || null;
    const pagePath = window.location.pathname;

    if (document.body.hasAttribute('data-product-page') && pageProductId) {
      track('product_page_viewed', {
        productId: pageProductId,
        pagePath,
        campaign,
      });
    }

    document.querySelectorAll('[data-buy][data-product]').forEach((anchor) => {
      const productId = anchor.dataset.product;
      const placement = anchor.dataset.ctaLocation || 'unknown';
      const outboundUrl = commerce.buildOutboundUrl({
        productId,
        placement,
        currentUrl: window.location.href,
        campaign,
      });

      if (!outboundUrl) {
        anchor.setAttribute('aria-disabled', 'true');
        anchor.removeAttribute('target');
        return;
      }

      anchor.href = outboundUrl;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer external';
      anchor.addEventListener('click', () => {
        track(placement === 'sticky' ? 'sticky_etsy_cta_clicked' : 'primary_etsy_cta_clicked', {
          productId,
          ctaLocation: placement,
          pagePath,
          campaign,
        });
      });
    });

    document.querySelectorAll('[data-preview]').forEach((control) => {
      control.addEventListener('click', () => {
        track('preview_activated', {
          productId: control.dataset.product || pageProductId,
          ctaLocation: control.dataset.ctaLocation || 'preview',
          pagePath,
          campaign,
        });
      });
    });

    document.querySelectorAll('[data-related-product]').forEach((anchor) => {
      anchor.addEventListener('click', () => {
        track('related_product_clicked', {
          productId: pageProductId,
          relatedProductId: anchor.dataset.relatedProduct,
          ctaLocation: 'related-product',
          pagePath,
          campaign,
        });
      });
    });

    setupCheckoutShortcut(pageProductId);
    setupStickyCheckout();
  }

  function captureCampaign(keys) {
    const allowedKeys = Array.isArray(keys) ? keys : [];
    const incoming = new URL(window.location.href).searchParams;
    let stored = {};

    try {
      stored = JSON.parse(window.sessionStorage.getItem(CAMPAIGN_STORAGE_KEY) || '{}');
    } catch (_) {
      stored = {};
    }

    allowedKeys.forEach((key) => {
      const value = incoming.get(key);
      if (value) stored[key] = value.slice(0, 200);
    });

    try {
      window.sessionStorage.setItem(CAMPAIGN_STORAGE_KEY, JSON.stringify(stored));
    } catch (_) {
      // Session storage can be unavailable in hardened browser modes. Checkout still works.
    }

    return stored;
  }

  function setupCheckoutShortcut(pageProductId) {
    if (!pageProductId) return;

    document.addEventListener('keydown', (event) => {
      if (event.defaultPrevented || event.repeat || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key.toLowerCase() !== 'g' || isEditableTarget(event.target)) return;

      const primary = document.querySelector('[data-buy][data-cta-location="primary"]:not([aria-disabled="true"])');
      if (!primary) return;

      event.preventDefault();
      primary.click();
    });
  }

  function isEditableTarget(target) {
    if (!(target instanceof Element)) return false;
    return Boolean(target.closest('input, textarea, select, [contenteditable=""], [contenteditable="true"]'));
  }

  function setupStickyCheckout() {
    const primary = document.querySelector('[data-primary-cta]');
    const sticky = document.querySelector('.std-sticky-cta');
    if (!primary || !sticky || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(([entry]) => {
      sticky.classList.toggle('is-visible', !entry.isIntersecting);
    }, { threshold: 0.15 });

    observer.observe(primary);
  }

  function track(eventName, payload) {
    if (!window.UndoneAnalytics || typeof window.UndoneAnalytics.track !== 'function') return;
    window.UndoneAnalytics.track(eventName, payload);
  }

  function initStudioHeroCanvas(state) {
    const canvas = document.getElementById('studioHeroCanvas');
    if (!canvas) return;
    const context = canvas.getContext('2d', { alpha: true });
    if (!context) return;

    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let animationFrame = null;
    let isVisible = true;
    let particles = [];
    let lastFrame = performance.now();

    const noise = document.createElement('canvas');
    const noiseContext = noise.getContext('2d');
    const config = { particleCount: 28, grainOpacity: 0.05, maxDpr: 2 };

    function resize() {
      pixelRatio = Math.min(window.devicePixelRatio || 1, config.maxDpr);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = Math.max(1, Math.floor(width * pixelRatio));
      canvas.height = Math.max(1, Math.floor(height * pixelRatio));
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.scale(pixelRatio, pixelRatio);
      buildNoise();
      buildParticles();
      draw();
    }

    function buildNoise() {
      if (!noiseContext) return;
      noise.width = 140;
      noise.height = 140;
      const image = noiseContext.createImageData(noise.width, noise.height);
      for (let index = 0; index < image.data.length; index += 4) {
        const value = (Math.random() * 255) | 0;
        image.data[index] = 255;
        image.data[index + 1] = 255;
        image.data[index + 2] = 255;
        image.data[index + 3] = value < 18 ? 10 : 0;
      }
      noiseContext.putImageData(image, 0, 0);
    }

    function buildParticles() {
      particles = Array.from({ length: config.particleCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 0.35 + Math.random() * 0.85,
        velocity: 7 + Math.random() * 18,
        alpha: 0.05 + Math.random() * 0.12,
      }));
    }

    function animate(now) {
      if (!isVisible) {
        animationFrame = null;
        return;
      }
      if (state.heroIntroActive || window.__HERO_INTRO_ACTIVE__) {
        animationFrame = requestAnimationFrame(animate);
        return;
      }

      const delta = Math.min(0.04, (now - lastFrame) / 1000);
      lastFrame = now;
      particles.forEach((particle) => {
        particle.y -= particle.velocity * delta;
        if (particle.y < -12) {
          particle.y = height + 12;
          particle.x = Math.random() * width;
        }
      });
      draw();
      animationFrame = requestAnimationFrame(animate);
    }

    function draw() {
      context.clearRect(0, 0, width, height);
      if (noise.width && noise.height) {
        context.save();
        context.globalAlpha = config.grainOpacity;
        context.drawImage(noise, 0, 0, width, height);
        context.restore();
      }
      particles.forEach((particle) => {
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(123, 108, 255, ${particle.alpha})`;
        context.fill();
      });
    }

    function start() {
      if (state.prefersReducedMotion) {
        draw();
        return;
      }
      if (animationFrame) return;
      lastFrame = performance.now();
      animationFrame = requestAnimationFrame(animate);
    }

    function stop() {
      if (!animationFrame) return;
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }

    const hero = canvas.closest('.studio-hero') || canvas.parentElement;
    if ('IntersectionObserver' in window && hero) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible) start(); else stop();
        });
      }, { threshold: 0.1 });
      observer.observe(hero);
    }

    window.addEventListener('resize', resize, { passive: true });
    resize();
    start();
  }
})();
