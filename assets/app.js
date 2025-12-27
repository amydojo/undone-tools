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

  // Hero Reveal Animation (Arrival, not rotation)
  const heroReveal = () => {
    const word1 = document.querySelector('.hero-word-1');
    const word2 = document.querySelector('.hero-word-2');
    const dot = document.querySelector('.hero-dot');
    
    if (!word1 || !word2 || !dot) return;

    // Reset to start hidden
    word1.classList.remove('revealed');
    word2.classList.remove('revealed');
    dot.classList.remove('revealed');

    // Start reveal sequence
    setTimeout(() => {
      word1.classList.add('revealed');
    }, 200);

    setTimeout(() => {
      word2.classList.add('revealed');
    }, 800);

    setTimeout(() => {
      dot.classList.add('revealed');
    }, 1400);
  };

  heroReveal();

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
