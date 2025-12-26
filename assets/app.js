document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    header.addEventListener('click', () => {
      const item = header.closest('.std-accordion-item');
      const isExpanded = item.getAttribute('aria-expanded') === 'true';
      const group = item.closest('.std-accordion-group');
      if (group) {
        group.querySelectorAll('.std-accordion-item').forEach(i => {
          i.setAttribute('aria-expanded', 'false');
        });
      }
      item.setAttribute('aria-expanded', String(!isExpanded));
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

  // Hero Diagnostic Reveal
  const heroDiagnosticReveal = () => {
    const line1 = document.querySelector('.hero-line-1');
    const line2 = document.querySelector('.hero-line-2');
    const line3 = document.querySelector('.hero-line-3');
    
    if (!line1 || !line2 || !line3) return;

    // Line 1: Fade in + subtle upward drift
    setTimeout(() => {
      line1.classList.add('revealed');
    }, 200);

    // Line 2: Opacity only after 500ms pause
    setTimeout(() => {
      // Pause background motion when diagnostic appears
      if (window.pauseStudioParticles) window.pauseStudioParticles();
      line2.classList.add('revealed');
    }, 1200); // 200 (start) + 500 (duration) + 500 (pause)

    // Line 3: Opacity + micro letter-spacing tighten after 300ms pause
    setTimeout(() => {
      // Resume background motion
      if (window.resumeStudioParticles) window.resumeStudioParticles();
      line3.classList.add('revealed');
    }, 2000); // 1200 + 500 (approx dur) + 300 (pause)
  };

  heroDiagnosticReveal();

  // Studio Hero Canvas (Atmospheric, not content)
  initStudioHeroCanvas();
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
  let isFrozen = false;

  window.pauseStudioParticles = () => { isFrozen = true; };
  window.resumeStudioParticles = () => { isFrozen = false; };

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
    const count = 30;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: 0.3 + Math.random() * 0.7,
        speed: 0.02 + Math.random() * 0.05,
        opacity: 0.05 + Math.random() * 0.15
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    
    // Fine grain
    ctx.fillStyle = 'rgba(255, 255, 255, 0.01)';
    for (let i = 0; i < 500; i++) {
      ctx.fillRect(Math.random() * width, Math.random() * height, 1, 1);
    }

    // Atmospheric drift
    particles.forEach(p => {
      if (!isFrozen) {
        p.y -= p.speed;
        if (p.y < -10) p.y = height + 10;
      }
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
