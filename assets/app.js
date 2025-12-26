document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Homepage fade-in animations
  const fadeElements = document.querySelectorAll('.fade-in');
  if (fadeElements.length) {
    if (prefersReducedMotion) {
      fadeElements.forEach(el => el.classList.add('visible'));
    } else {
      const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      fadeElements.forEach(el => fadeObserver.observe(el));
    }
  }

  // Standards page reveal animations
  const revealElements = document.querySelectorAll('.std-reveal');
  if (revealElements.length) {
    if (prefersReducedMotion) {
      revealElements.forEach(el => el.classList.add('is-visible'));
    } else {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

      revealElements.forEach(el => observer.observe(el));
    }
  }

  // Accessible Accordions
  document.querySelectorAll('.std-accordion-header').forEach(header => {
    // Click handler
    header.addEventListener('click', () => {
      const item = header.closest('.std-accordion-item');
      const isExpanded = item.getAttribute('aria-expanded') === 'true';
      
      // Close others in same group
      const group = item.closest('.std-accordion-group');
      if (group) {
        group.querySelectorAll('.std-accordion-item').forEach(i => {
          i.setAttribute('aria-expanded', 'false');
        });
      }

      item.setAttribute('aria-expanded', String(!isExpanded));
    });

    // Keyboard navigation (Enter/Space toggle, Arrow keys navigate)
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        header.click();
        return;
      }

      const group = header.closest('.std-accordion-group');
      if (!group) return;

      const headers = Array.from(group.querySelectorAll('.std-accordion-header'));
      const index = headers.indexOf(header);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        headers[(index + 1) % headers.length].focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        headers[(index - 1 + headers.length) % headers.length].focus();
      }
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const behavior = prefersReducedMotion ? 'auto' : 'smooth';
        target.scrollIntoView({ behavior, block: 'start' });
      }
    });
  });

  // Checkout URL handling
  const checkoutMeta = document.querySelector('meta[name="checkout-url"]');
  const checkoutUrl = checkoutMeta?.content;
  const buyButton = document.querySelector('[data-buy]');
  const helperText = document.querySelector('.std-checkout-helper');

  if (!checkoutUrl || checkoutUrl.includes('PASTE') || checkoutUrl.trim() === '') {
    // Disable checkout if URL is missing or placeholder
    if (buyButton) {
      buyButton.setAttribute('aria-disabled', 'true');
      buyButton.style.opacity = '0.5';
      buyButton.style.cursor = 'not-allowed';
      buyButton.style.pointerEvents = 'none';
    }
    if (helperText) {
      helperText.style.display = 'none';
    }
    console.warn('[undone] missing checkout-url meta');
  } else {
    // Wire up checkout
    const openCheckout = () => {
      window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
    };

    if (buyButton) {
      buyButton.addEventListener('click', openCheckout);
    }

    // "G" key shortcut (ignore when typing)
    document.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'g') {
        const active = document.activeElement;
        const isEditable = 
          active.tagName === 'INPUT' || 
          active.tagName === 'TEXTAREA' || 
          active.isContentEditable;
        
        if (!isEditable) {
          openCheckout();
        }
      }
    });
  }

  // Studio page reveal animations
  const studioRevealElements = document.querySelectorAll('.studio-reveal');
  if (studioRevealElements.length) {
    if (prefersReducedMotion) {
      studioRevealElements.forEach(el => el.classList.add('is-visible'));
    } else {
      const studioObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            studioObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

      studioRevealElements.forEach(el => studioObserver.observe(el));
    }
  }

  // Studio Hero Canvas (Gotham-like procedural globe + orbital dots)
  initStudioHeroCanvas();
});

function initStudioHeroCanvas() {
  const canvas = document.getElementById('studioHeroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  let width, height;
  let mouseX = 0.5, mouseY = 0.5;
  let animationId = null;
  let isVisible = true;
  let dots = [];
  let time = 0;

  // Configuration
  const config = {
    globeRadius: 0.35,
    globeY: 0.7,
    dotCount: 120,
    gridLines: 8,
    fps: prefersReducedMotion ? 0 : 35
  };

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    generateDots();
  }

  function generateDots() {
    dots = [];
    const centerX = width / 2;
    const centerY = height * config.globeY;
    const radius = Math.min(width, height) * config.globeRadius;

    for (let i = 0; i < config.dotCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = radius * (0.6 + Math.random() * 0.8);
      const verticalOffset = (Math.random() - 0.5) * radius * 0.6;
      
      const colorRoll = Math.random();
      let color;
      if (colorRoll < 0.6) {
        color = `rgba(200, 180, 120, ${0.15 + Math.random() * 0.25})`;
      } else if (colorRoll < 0.85) {
        color = `rgba(180, 100, 80, ${0.12 + Math.random() * 0.2})`;
      } else {
        color = `rgba(80, 160, 160, ${0.1 + Math.random() * 0.18})`;
      }

      dots.push({
        baseX: centerX + Math.cos(angle) * distance,
        baseY: centerY + verticalOffset - radius * 0.3,
        size: 1 + Math.random() * 2,
        color,
        speed: 0.0005 + Math.random() * 0.001,
        offset: Math.random() * Math.PI * 2
      });
    }
  }

  function drawGlobe() {
    const centerX = width / 2;
    const centerY = height * config.globeY;
    const radius = Math.min(width, height) * config.globeRadius;

    // Globe arc (lower hemisphere)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI, false);
    ctx.strokeStyle = 'rgba(80, 70, 120, 0.12)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Atmosphere rim glow
    const rimGradient = ctx.createRadialGradient(
      centerX, centerY, radius * 0.9,
      centerX, centerY, radius * 1.15
    );
    rimGradient.addColorStop(0, 'rgba(123, 108, 255, 0.03)');
    rimGradient.addColorStop(0.5, 'rgba(123, 108, 255, 0.06)');
    rimGradient.addColorStop(1, 'transparent');
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 1.15, 0, Math.PI, false);
    ctx.fillStyle = rimGradient;
    ctx.fill();

    // Latitude lines
    for (let i = 1; i <= config.gridLines; i++) {
      const lat = (i / (config.gridLines + 1)) * Math.PI;
      const y = centerY - Math.cos(lat) * radius * 0.5;
      const xRadius = Math.sin(lat) * radius;
      
      if (y < centerY) {
        ctx.beginPath();
        ctx.ellipse(centerX, y, xRadius, xRadius * 0.15, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(60, 55, 90, 0.06)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }

    // Longitude lines
    for (let i = 0; i < config.gridLines; i++) {
      const lon = (i / config.gridLines) * Math.PI;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radius * Math.sin(lon), radius, 0, Math.PI, 0);
      ctx.strokeStyle = 'rgba(60, 55, 90, 0.05)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
  }

  function drawDots() {
    const parallaxX = (mouseX - 0.5) * 20;
    const parallaxY = (mouseY - 0.5) * 10;

    dots.forEach(dot => {
      const drift = prefersReducedMotion ? 0 : Math.sin(time * dot.speed + dot.offset) * 3;
      const x = dot.baseX + parallaxX + drift;
      const y = dot.baseY + parallaxY;

      ctx.beginPath();
      ctx.arc(x, y, dot.size, 0, Math.PI * 2);
      ctx.fillStyle = dot.color;
      ctx.fill();
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    drawGlobe();
    drawDots();
    time++;
  }

  function animate() {
    if (!isVisible || prefersReducedMotion) return;
    draw();
    animationId = requestAnimationFrame(animate);
  }

  function start() {
    if (animationId) return;
    if (prefersReducedMotion) {
      draw();
      return;
    }
    animate();
  }

  function stop() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }

  // Visibility observer
  const visibilityObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting;
      if (isVisible) {
        start();
      } else {
        stop();
      }
    });
  }, { threshold: 0.1 });

  visibilityObserver.observe(canvas.parentElement);

  // Mouse tracking (desktop only)
  if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX / window.innerWidth;
      mouseY = e.clientY / window.innerHeight;
    });
  }

  // Resize handler
  window.addEventListener('resize', () => {
    resize();
    if (!animationId && isVisible) draw();
  });

  // Initialize
  resize();
  start();
}
