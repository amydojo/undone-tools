document.addEventListener('DOMContentLoaded', () => {
  // Reveal animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.std-reveal').forEach(el => observer.observe(el));

  // Accordions
  document.querySelectorAll('.std-accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.std-accordion-item');
      const isExpanded = item.getAttribute('aria-expanded') === 'true';
      
      // Close others in same group
      const group = item.closest('.std-accordion-group');
      if (group) {
        group.querySelectorAll('.std-accordion-item').forEach(i => i.setAttribute('aria-expanded', 'false'));
      }

      item.setAttribute('aria-expanded', !isExpanded);
    });

    header.addEventListener('keydown', (e) => {
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

  // Checkout handling
  const checkoutUrl = document.querySelector('meta[name="checkout-url"]')?.content;
  const cta = document.querySelector('[data-buy]');
  const helper = document.querySelector('.std-checkout-helper');

  if (!checkoutUrl || checkoutUrl.includes('PASTE')) {
    if (cta) {
      cta.setAttribute('aria-disabled', 'true');
      cta.style.opacity = '0.5';
      cta.style.cursor = 'not-allowed';
    }
    if (helper) helper.style.display = 'none';
    console.warn("[undone] missing checkout-url meta");
  } else {
    const openCheckout = () => window.open(checkoutUrl, '_blank', 'noopener,noreferrer');
    if (cta) cta.addEventListener('click', openCheckout);

    document.addEventListener('keydown', (e) => {
      if (e.key.toLowerCase() === 'g') {
        const active = document.activeElement;
        const isEditable = active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable;
        if (!isEditable) openCheckout();
      }
    });
  }

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
        target.scrollIntoView({ behavior });
      }
    });
  });
});
