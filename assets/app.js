/* assets/app.js — clean + stable + “apple tier” */

(() => {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // shared state (keeps things coordinated without chaos)
    const state = {
      prefersReducedMotion,
      heroIntroActive: true,
    };

    // optional global flag (only if you still want to reference it elsewhere)
    window.__HERO_INTRO_ACTIVE__ = true;

    // 1) cinematic “is-ready” gate (prevents instant snap-in)
    setIsReady(state);

    // 2) standards reveals (excluding #hero)
    setupReveal('.std-reveal:not(#hero)', 'is-visible', state);

    // 3) studio reveals
    setupReveal('.studio-reveal', 'is-visible', state);

    // 4) accordions
    setupAccordions();

    // 5) smooth anchors
    setupSmoothAnchors(state);

    // 6) hero dot (reliable timing)
    setupHeroDotReveal(state);

    // 7) atmospheric hero canvas (optimized)
    initStudioHeroCanvas(state);
  });

  // ---------- helpers ----------

  function setIsReady(state) {
    const root = document.documentElement;
    if (state.prefersReducedMotion) {
      root.classList.add('is-ready');
      return;
    }
    // short, intentional delay for “arrival”
    window.setTimeout(() => root.classList.add('is-ready'), 420);
  }

  function setupReveal(selector, visibleClass, state) {
    const els = document.querySelectorAll(selector);
    if (!els.length) return;

    if (state.prefersReducedMotion) {
      els.forEach(el => el.classList.add(visibleClass));
      return;
    }

    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add(visibleClass);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    els.forEach(el => obs.observe(el));
  }

  function setupAccordions() {
    const headers = document.querySelectorAll('.std-accordion-header');
    if (!headers.length) return;

    headers.forEach(header => {
      const toggle = () => {
        const item = header.closest('.std-accordion-item');
        if (!item) return;

        const isExpanded = item.getAttribute('aria-expanded') === 'true';
        const group = item.closest('.std-accordion-group');

        // single-open behavior within a group
        if (group) {
          group.querySelectorAll('.std-accordion-item').forEach(i => {
            i.setAttribute('aria-expanded', 'false');
          });
        }

        item.setAttribute('aria-expanded', String(!isExpanded));
      };

      header.addEventListener('click', toggle);

      // keyboard support (if header is not already a <button>)
      header.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      });
    });
  }

  function setupSmoothAnchors(state) {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const href = a.getAttribute('href');
        if (!href || href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
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
      // don’t block anything if markup changes
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

    // always start hidden + stable
    dot.classList.remove('revealed');

    // compute timing from the crisp layer animation (so you don’t chase ms forever)
    const crisp = document.querySelector('.hero-layer--crisp');
    const { delayMs, durationMs } = getFirstAnimationTiming(crisp);

    // reveal dot near the end of crisp resolving
    // (0.92 avoids “pause” feeling that happens at 100%)
    const revealAt = Math.max(650, Math.round(delayMs + durationMs * 0.92));

    // ensure browser applied the hidden styles before we reveal
    requestAnimationFrame(() => {
      // force a paint baseline (helps avoid flicker on fast machines)
      dot.getBoundingClientRect();

      window.setTimeout(() => {
        dot.classList.add('revealed');
        state.heroIntroActive = false;
        window.__HERO_INTRO_ACTIVE__ = false;
      }, revealAt);
    });
  }

  function getFirstAnimationTiming(el) {
    // default fallback if something is missing
    if (!el) return { delayMs: 380, durationMs: 1650 };

    const cs = window.getComputedStyle(el);

    // can be comma-separated lists; we take the first animation
    const dur = (cs.animationDuration || '').split(',')[0].trim();
    const del = (cs.animationDelay || '').split(',')[0].trim();

    return {
      durationMs: cssTimeToMs(dur, 1650),
      delayMs: cssTimeToMs(del, 380),
    };
  }

  function cssTimeToMs(value, fallback) {
    if (!value) return fallback;
    if (value.endsWith('ms')) {
      const n = parseFloat(value);
      return Number.isFinite(n) ? n : fallback;
    }
    if (value.endsWith('s')) {
      const n = parseFloat(value);
      return Number.isFinite(n) ? n * 1000 : fallback;
    }
    const n = parseFloat(value);
    return Number.isFinite(n) ? n : fallback;
  }

  // ---------- hero canvas ----------

  function initStudioHeroCanvas(state) {
    const canvas = document.getElementById('studioHeroCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    let raf = null;
    let isVisible = true;

    // particles
    let particles = [];

    // precomputed grain (so we don’t “random loop” every frame and stutter)
    const noise = document.createElement('canvas');
    const noiseCtx = noise.getContext('2d');

    const CONFIG = {
      particleCount: 28,
      grainOpacity: 0.05,
      maxDpr: 2,
    };

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, CONFIG.maxDpr);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;

      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));

      // reset transform so scale doesn’t stack
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      buildNoise();
      buildParticles();
      draw(); // one immediate frame on resize
    }

    function buildNoise() {
      if (!noiseCtx) return;

      // small texture scaled up (cheap + looks good)
      const nw = 140;
      const nh = 140;
      noise.width = nw;
      noise.height = nh;

      const img = noiseCtx.createImageData(nw, nh);
      const data = img.data;

      for (let i = 0; i < data.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        data[i] = 255;
        data[i + 1] = 255;
        data[i + 2] = 255;
        data[i + 3] = v < 18 ? 10 : 0; // sparse grain (less “snow”)
      }
      noiseCtx.putImageData(img, 0, 0);
    }

    function buildParticles() {
      particles = [];
      for (let i = 0; i < CONFIG.particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: 0.35 + Math.random() * 0.85,
          vy: 7 + Math.random() * 18, // px/sec
          a: 0.05 + Math.random() * 0.12,
        });
      }
    }

    let last = performance.now();

    function animate(now) {
      if (!isVisible) {
        raf = null;
        return;
      }

      // during intro, keep raf alive but do basically nothing
      if (state.heroIntroActive || window.__HERO_INTRO_ACTIVE__) {
        raf = requestAnimationFrame(animate);
        return;
      }

      const dt = Math.min(0.04, (now - last) / 1000); // cap dt for stability
      last = now;

      step(dt);
      draw();

      raf = requestAnimationFrame(animate);
    }

    function step(dt) {
      for (const p of particles) {
        p.y -= p.vy * dt;
        if (p.y < -12) {
          p.y = height + 12;
          p.x = Math.random() * width;
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // grain overlay (precomputed)
      if (noise.width && noise.height) {
        ctx.save();
        ctx.globalAlpha = CONFIG.grainOpacity;
        ctx.drawImage(noise, 0, 0, width, height);
        ctx.restore();
      }

      // atmospheric particles
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(123, 108, 255, ${p.a})`;
        ctx.fill();
      }
    }

    function start() {
      if (state.prefersReducedMotion) {
        draw();
        return;
      }
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(animate);
    }

    function stop() {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = null;
    }

    // pause when not visible
    const heroSection = canvas.closest('.studio-hero') || canvas.parentElement;
    if ('IntersectionObserver' in window && heroSection) {
      const vis = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            isVisible = entry.isIntersecting;
            if (isVisible) start();
            else stop();
          });
        },
        { threshold: 0.1 }
      );
      vis.observe(heroSection);
    }

    window.addEventListener('resize', resize, { passive: true });
    resize();
    start();
  }
})();