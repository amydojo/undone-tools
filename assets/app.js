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

  // Studio Hero Canvas (Quiet ambient noise/particles)
  initStudioHeroCanvas();

  // Rotating Headlines
  const cyclerItems = document.querySelectorAll('.cycler-item');
  if (cyclerItems.length) {
    let currentIndex = 0;
    setInterval(() => {
      const current = cyclerItems[currentIndex];
      current.classList.remove('active');
      current.classList.add('exit');
      
      currentIndex = (currentIndex + 1) % cyclerItems.length;
      
      const next = cyclerItems[currentIndex];
      next.classList.remove('exit');
      next.classList.add('active');
      
      // Cleanup exit class after transition
      setTimeout(() => {
        current.classList.remove('exit');
      }, 600);
    }, 3000);
  }

  // Hero Parallax
  const hero = document.getElementById('hero');
  const canvas = document.getElementById('studioHeroCanvas');
  if (hero && canvas && !prefersReducedMotion) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      if (scrolled < window.innerHeight) {
        canvas.style.transform = `translateY(${scrolled * 0.5}px)`;
      }
    });
  }
});

function initStudioHeroCanvas() {
  const canvas = document.getElementById('studioHeroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  let width, height;
  let animationId = null;
  let isVisible = true;
  let particles = [];

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    generateParticles();
  }

  function generateParticles() {
    particles = [];
    const count = 40;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 0.5 + Math.random() * 1,
        speed: 0.1 + Math.random() * 0.2,
        opacity: 0.1 + Math.random() * 0.3
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    
    // Subtle background grain/noise
    ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
    for (let i = 0; i < 1000; i++) {
      ctx.fillRect(Math.random() * width, Math.random() * height, 1, 1);
    }

    // Quiet floating particles
    particles.forEach(p => {
      p.y -= p.speed;
      if (p.y < -10) p.y = height + 10;
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(123, 108, 255, ${p.opacity})`;
      ctx.fill();
    });
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

  const visibilityObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting;
      if (isVisible) start();
      else stop();
    });
  }, { threshold: 0.1 });

  visibilityObserver.observe(canvas.parentElement);

  window.addEventListener('resize', resize);
  resize();
  start();
}
