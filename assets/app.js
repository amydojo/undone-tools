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

  // Rotating Headlines (Restrained)
  const cyclerItems = document.querySelectorAll('.cycler-item');
  if (cyclerItems.length) {
    let currentIndex = 0;
    
    const showItem = (index) => {
      cyclerItems.forEach((item, i) => {
        item.classList.toggle('active', i === index);
        item.classList.remove('exit');
      });
    };
    
    showItem(0);
    
    setInterval(() => {
      const current = cyclerItems[currentIndex];
      current.classList.remove('active');
      current.classList.add('exit');
      
      currentIndex = (currentIndex + 1) % cyclerItems.length;
      
      const next = cyclerItems[currentIndex];
      next.classList.remove('exit');
      next.classList.add('active');
      
      setTimeout(() => {
        current.classList.remove('exit');
      }, 1000); // Wait for exit animation
    }, 5000); // 5s interval for calm pacing
  }

  // Studio Hero Canvas
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
    ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
    for (let i = 0; i < 1000; i++) {
      ctx.fillRect(Math.random() * width, Math.random() * height, 1, 1);
    }
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
