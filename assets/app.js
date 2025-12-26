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
});
