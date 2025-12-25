document.addEventListener('DOMContentLoaded', () => {
  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('section, .product-row, .info-block').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
  });

  // Hotkeys
  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'g') {
      const buyBtn = document.querySelector('[data-buy]');
      if (buyBtn) buyBtn.click();
    }
  });

  // Buy buttons
  const CONFIG = {
    injectables: "https://undonebydesign.etsy.com",
    laser: "https://undonebydesign.etsy.com"
  };

  document.querySelectorAll('[data-buy]').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-buy');
      const url = CONFIG[type] || CONFIG.injectables;
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  });

  // Smooth scroll for preview
  document.querySelectorAll('[data-preview]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.querySelector('#preview');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
