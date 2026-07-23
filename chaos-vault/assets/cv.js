/* Chaos Vault shared runtime.
   Keeps technical specimens functional and adds mobile-first archive navigation. */

(function ChaosVault() {
  'use strict';

  const mobileStylesheet = '/chaos-vault/assets/mobile.css';
  if (!document.querySelector(`link[href="${mobileStylesheet}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = mobileStylesheet;
    document.head.appendChild(link);
  }

  const CV = { demos: {} };
  const mobileQuery = window.matchMedia('(max-width: 980px)');

  document.addEventListener('DOMContentLoaded', () => {
    CV.scrollReveal.init();
    CV.accordion.init();
    CV.activeNav.init();
    CV.mobileNav.init();
    CV.mobileSummary.init();
    CV.mobileDisclosure.init();
    CV.mobilePatternDetails.init();

    if (document.querySelector('.cv-demo-camera')) CV.demos.camera();
    if (document.querySelector('.cv-demo-ai-states')) CV.demos.aiStates();
    if (document.querySelector('.cv-demo-motion')) CV.demos.motion();
    if (document.querySelector('.cv-demo-graph')) CV.demos.graph();
    if (document.querySelector('.cv-demo-events')) CV.demos.events();
    if (document.querySelector('.cv-demo-notifications')) CV.demos.notifications();
  });

  CV.scrollReveal = {
    init() {
      const elements = document.querySelectorAll('.cv-reveal');
      if (!elements.length) return;
      if (!('IntersectionObserver' in window)) {
        elements.forEach((element) => element.classList.add('cv-revealed'));
        return;
      }
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('cv-revealed');
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
      elements.forEach((element) => observer.observe(element));
    },
  };

  CV.accordion = {
    init() {
      document.querySelectorAll('.cv-recovery-trigger').forEach((button) => {
        button.addEventListener('click', () => {
          const target = document.getElementById(button.dataset.target);
          if (!target) return;
          const open = !target.classList.contains('open');
          target.classList.toggle('open', open);
          button.setAttribute('aria-expanded', String(open));
          const arrow = button.querySelector('.cv-trigger-arrow');
          if (arrow) arrow.textContent = open ? '▾' : '▸';
        });
      });
    },
  };

  CV.activeNav = {
    init() {
      const currentPath = location.pathname.replace(/\/$/, '');
      document.querySelectorAll('.cv-sidebar-link').forEach((link) => {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#')) return;
        try {
          const linkPath = new URL(href, location.origin).pathname.replace(/\/$/, '');
          if (linkPath === currentPath) link.classList.add('active');
        } catch (_) {
          // Ignore non-navigation references.
        }
      });
    },
  };

  CV.mobileNav = {
    init() {
      const body = document.body;
      const topbar = document.querySelector('.cv-topbar');
      const sidebar = document.querySelector('.cv-sidebar');
      if (!topbar || !sidebar) return;

      sidebar.id = sidebar.id || 'cv-mobile-drawer';

      const menuButton = document.createElement('button');
      menuButton.type = 'button';
      menuButton.className = 'cv-mobile-menu-toggle';
      menuButton.textContent = 'Browse';
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-controls', sidebar.id);
      topbar.appendChild(menuButton);

      const closeButton = document.createElement('button');
      closeButton.type = 'button';
      closeButton.className = 'cv-mobile-close';
      closeButton.textContent = 'Close';
      closeButton.setAttribute('aria-label', 'Close archive navigation');
      sidebar.prepend(closeButton);

      const searchWrap = document.createElement('div');
      searchWrap.className = 'cv-mobile-nav-search';
      const searchLabel = document.createElement('label');
      searchLabel.htmlFor = 'cv-mobile-nav-search';
      searchLabel.textContent = 'Filter this archive';
      const searchInput = document.createElement('input');
      searchInput.id = 'cv-mobile-nav-search';
      searchInput.type = 'search';
      searchInput.placeholder = 'Pattern, part, or donor';
      searchInput.autocomplete = 'off';
      searchWrap.append(searchLabel, searchInput);
      closeButton.insertAdjacentElement('afterend', searchWrap);

      const backdrop = document.createElement('button');
      backdrop.type = 'button';
      backdrop.className = 'cv-mobile-backdrop';
      backdrop.setAttribute('aria-label', 'Close archive navigation');
      sidebar.insertAdjacentElement('afterend', backdrop);

      const mobileBar = document.createElement('nav');
      mobileBar.className = 'cv-mobile-bar';
      mobileBar.setAttribute('aria-label', 'Mobile archive shortcuts');

      const vaultLink = document.createElement('a');
      vaultLink.href = '/vault/';
      vaultLink.textContent = 'Vault';

      const browseButton = document.createElement('button');
      browseButton.type = 'button';
      browseButton.textContent = 'Browse';

      const topButton = document.createElement('button');
      topButton.type = 'button';
      topButton.textContent = 'Top';

      mobileBar.append(vaultLink, browseButton, topButton);
      body.appendChild(mobileBar);

      const links = Array.from(sidebar.querySelectorAll('.cv-sidebar-link'));
      const sections = Array.from(sidebar.querySelectorAll('.cv-sidebar-section'));
      let lastFocused = null;

      function setOpen(open) {
        body.classList.toggle('cv-nav-open', open);
        menuButton.setAttribute('aria-expanded', String(open));
        menuButton.textContent = open ? 'Close' : 'Browse';
        if (open) {
          lastFocused = document.activeElement;
          window.setTimeout(() => searchInput.focus(), 40);
        } else if (lastFocused instanceof HTMLElement) {
          lastFocused.focus();
        }
      }

      function filterNavigation() {
        const query = searchInput.value.trim().toLowerCase();
        links.forEach((link) => {
          const matches = !query || link.textContent.toLowerCase().includes(query);
          link.hidden = !matches;
        });
        sections.forEach((section) => {
          const visibleLinks = Array.from(section.querySelectorAll('.cv-sidebar-link')).some((link) => !link.hidden);
          section.hidden = !visibleLinks;
        });
      }

      menuButton.addEventListener('click', () => setOpen(menuButton.getAttribute('aria-expanded') !== 'true'));
      browseButton.addEventListener('click', () => setOpen(true));
      closeButton.addEventListener('click', () => setOpen(false));
      backdrop.addEventListener('click', () => setOpen(false));
      searchInput.addEventListener('input', filterNavigation);
      sidebar.addEventListener('click', (event) => {
        if (event.target.closest('a')) setOpen(false);
      });
      topButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && body.classList.contains('cv-nav-open')) setOpen(false);
      });
      mobileQuery.addEventListener('change', (event) => {
        if (!event.matches) setOpen(false);
      });
    },
  };

  CV.mobileSummary = {
    init() {
      if (!mobileQuery.matches) return;
      const summary = document.querySelector('.cv-page-desc, .cv-thesis');
      if (!summary || summary.textContent.trim().length < 150) return;

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'cv-mobile-summary-toggle';
      button.textContent = 'Read full summary';
      button.setAttribute('aria-expanded', 'false');
      summary.insertAdjacentElement('afterend', button);

      button.addEventListener('click', () => {
        const expanded = button.getAttribute('aria-expanded') !== 'true';
        summary.classList.toggle('is-expanded', expanded);
        button.setAttribute('aria-expanded', String(expanded));
        button.textContent = expanded ? 'Collapse summary' : 'Read full summary';
      });
    },
  };

  CV.mobileDisclosure = {
    init() {
      if (!mobileQuery.matches) return;
      const sections = Array.from(document.querySelectorAll('.cv-main > .cv-section'));
      if (!sections.length) return;

      let preferredIndex = sections.findIndex((section) => section.querySelector('.cv-pattern-grid, .cv-family-grid, .cv-parts-grid, .cv-demo-frame'));
      if (preferredIndex < 0) preferredIndex = 0;

      sections.forEach((section, index) => {
        const label = section.querySelector(':scope > .cv-section-label, :scope > .cv-section-title');
        if (!label) return;

        const movable = Array.from(section.childNodes).filter((node) => node !== label && !(node.nodeType === Node.TEXT_NODE && !node.textContent.trim()));
        if (!movable.length) return;

        const body = document.createElement('div');
        body.className = 'cv-mobile-section-body';
        movable.forEach((node) => body.appendChild(node));
        section.appendChild(body);

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'cv-mobile-section-toggle';
        button.setAttribute('aria-expanded', String(index === preferredIndex));
        button.textContent = index === preferredIndex ? 'Hide' : 'Show';
        label.insertAdjacentElement('afterend', button);
        body.hidden = index !== preferredIndex;

        button.addEventListener('click', () => {
          const open = button.getAttribute('aria-expanded') !== 'true';
          button.setAttribute('aria-expanded', String(open));
          button.textContent = open ? 'Hide' : 'Show';
          body.hidden = !open;
        });
      });
    },
  };

  CV.mobilePatternDetails = {
    init() {
      if (!mobileQuery.matches) return;

      document.querySelectorAll('.cv-pattern-spec').forEach((card, index) => {
        const children = Array.from(card.children);
        const firstParagraph = children.find((child) => child.tagName === 'P');
        if (!firstParagraph) return;
        const firstParagraphIndex = children.indexOf(firstParagraph);
        const detailNodes = children.slice(firstParagraphIndex + 1);
        if (!detailNodes.length) return;

        const details = document.createElement('div');
        details.className = 'cv-mobile-pattern-details';
        details.id = `cv-pattern-details-${index + 1}`;
        detailNodes.forEach((node) => details.appendChild(node));
        details.hidden = true;

        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'cv-mobile-pattern-toggle';
        button.textContent = 'Implementation details';
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-controls', details.id);

        firstParagraph.insertAdjacentElement('afterend', button);
        button.insertAdjacentElement('afterend', details);

        button.addEventListener('click', () => {
          const open = button.getAttribute('aria-expanded') !== 'true';
          button.setAttribute('aria-expanded', String(open));
          button.textContent = open ? 'Hide implementation details' : 'Implementation details';
          details.hidden = !open;
        });

        if (location.hash && card.id === location.hash.slice(1)) {
          button.setAttribute('aria-expanded', 'true');
          button.textContent = 'Hide implementation details';
          details.hidden = false;
        }
      });
    },
  };

  CV.demos.camera = function cameraDemo() {
    const element = document.querySelector('.cv-demo-camera');
    if (!element) return;
    const button = element.querySelector('[data-camera-btn]');
    const status = element.querySelector('[data-camera-status]');
    const video = element.querySelector('video');
    let state = 'idle';

    const states = {
      idle: { label: 'AWAITING PERMISSION', color: 'var(--cv-text-dim)' },
      requesting: { label: 'REQUESTING PERMISSION…', color: 'var(--cv-experimental)' },
      streaming: { label: 'STREAM ACTIVE', color: 'var(--cv-reconstructed)' },
      denied: { label: 'PERMISSION DENIED — FALLBACK MODE', color: 'var(--cv-quarantined)' },
      nosupport: { label: 'NO SUPPORT — FILE UPLOAD FALLBACK', color: 'var(--cv-awaiting)' },
      captured: { label: 'FRAME CAPTURED TO CANVAS', color: 'var(--cv-tested)' },
    };

    function setState(nextState) {
      state = nextState;
      const info = states[nextState] || states.idle;
      if (status) {
        status.textContent = info.label;
        status.style.color = info.color;
      }
    }

    button?.addEventListener('click', async () => {
      if (state === 'streaming') {
        setState('captured');
        button.textContent = 'Reset';
        video?.srcObject?.getTracks().forEach((track) => track.stop());
        if (video) video.srcObject = null;
        return;
      }
      if (['captured', 'denied', 'nosupport'].includes(state)) {
        setState('idle');
        button.textContent = 'Request Camera';
        if (video) video.style.display = 'none';
        return;
      }

      setState('requesting');
      button.textContent = '…';
      if (!navigator.mediaDevices?.getUserMedia) {
        window.setTimeout(() => {
          setState('nosupport');
          button.textContent = 'Reset';
        }, 800);
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' }, width: { ideal: 640 } },
          audio: false,
        });
        if (video) {
          video.srcObject = stream;
          video.style.display = 'block';
          video.play().catch(() => {});
        }
        setState('streaming');
        button.textContent = 'Capture Frame';
      } catch (error) {
        setState(['NotAllowedError', 'PermissionDeniedError'].includes(error.name) ? 'denied' : 'nosupport');
        button.textContent = 'Reset';
      }
    });
  };

  CV.demos.aiStates = function aiStatesDemo() {
    const element = document.querySelector('.cv-demo-ai-states');
    if (!element) return;
    const steps = Array.from(element.querySelectorAll('.cv-sm-state'));
    const nextButton = element.querySelector('[data-ai-next]');
    const resetButton = element.querySelector('[data-ai-reset]');
    const log = element.querySelector('[data-ai-log]');
    const messages = [
      '→ Checking response schema…',
      '→ Schema invalid. Attempting field repair…',
      '→ Repair incomplete. Triggering regeneration…',
      '→ Max retries reached. Loading guaranteed fallback.',
    ];
    let current = -1;

    function advance() {
      if (current >= steps.length - 1) return;
      if (current >= 0) steps[current].classList.remove('active');
      current += 1;
      steps[current].classList.add('active');
      if (log) {
        const line = document.createElement('div');
        line.style.cssText = 'font-family:var(--cv-font-mono);font-size:12px;color:var(--cv-text-muted);padding:4px 0;border-bottom:1px solid var(--cv-border);animation:cv-fade-up 0.3s ease';
        line.textContent = messages[current] || '→ Step complete.';
        log.appendChild(line);
        log.scrollTop = log.scrollHeight;
      }
      if (nextButton && current >= steps.length - 1) nextButton.disabled = true;
    }

    function reset() {
      steps.forEach((step) => step.classList.remove('active', 'done', 'failed'));
      current = -1;
      if (nextButton) nextButton.disabled = false;
      if (log) log.textContent = '';
    }

    nextButton?.addEventListener('click', advance);
    resetButton?.addEventListener('click', reset);
  };

  CV.demos.motion = function motionDemo() {
    const element = document.querySelector('.cv-demo-motion');
    if (!element) return;
    const tabs = element.querySelectorAll('[data-motion-tab]');
    const panels = element.querySelectorAll('[data-motion-panel]');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((item) => item.classList.remove('active'));
        panels.forEach((panel) => { panel.style.display = 'none'; });
        tab.classList.add('active');
        const target = element.querySelector(`[data-motion-panel="${tab.dataset.motionTab}"]`);
        if (target) target.style.display = 'flex';
      });
    });
  };

  CV.demos.graph = function graphDemo() {
    const canvas = document.querySelector('.cv-graph-canvas');
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const nodes = [
      { x: 80, y: 60, label: 'Idea', color: '#f04b2f', radius: 7 },
      { x: 200, y: 60, label: 'Action', color: '#f04b2f', radius: 7 },
      { x: 320, y: 60, label: 'Insight', color: '#f04b2f', radius: 7 },
      { x: 440, y: 60, label: 'Action', color: '#f04b2f', radius: 7 },
      { x: 80, y: 180, label: 'Idea ×3', color: '#3158ff', radius: 12 },
      { x: 280, y: 180, label: 'Action ×4', color: '#3158ff', radius: 14 },
      { x: 460, y: 180, label: 'Insight ×2', color: '#3158ff', radius: 10 },
      { x: 120, y: 290, label: 'Idea→Action', color: '#147d5a', radius: 8 },
      { x: 280, y: 290, label: 'Action→Insight', color: '#147d5a', radius: 8 },
      { x: 420, y: 290, label: 'Insight→Idea', color: '#147d5a', radius: 8 },
    ];
    const edges = [[0, 1], [1, 2], [2, 3], [0, 4], [1, 5], [3, 5], [2, 6], [4, 7], [5, 7], [5, 8], [6, 8], [6, 9], [9, 4]];

    function draw() {
      const width = canvas.clientWidth || 520;
      const height = 340;
      const ratio = window.devicePixelRatio || 1;
      const scale = width / 520;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);

      ['LAYER 1 — CHRONOLOGY', 'LAYER 2 — CLUSTERS', 'LAYER 3 — SEMANTIC'].forEach((label, index) => {
        context.font = '9px "SF Mono", monospace';
        context.fillStyle = 'rgba(255,255,255,0.35)';
        context.fillText(label, 8, [40, 160, 270][index]);
      });

      [75, 195, 305].forEach((y) => {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.strokeStyle = 'rgba(255,255,255,0.10)';
        context.stroke();
      });

      edges.forEach(([from, to]) => {
        const a = nodes[from];
        const b = nodes[to];
        context.beginPath();
        context.moveTo(a.x * scale, a.y);
        context.lineTo(b.x * scale, b.y);
        context.strokeStyle = 'rgba(255,255,255,0.16)';
        context.stroke();
      });

      nodes.forEach((node) => {
        const x = node.x * scale;
        context.beginPath();
        context.arc(x, node.y, node.radius, 0, Math.PI * 2);
        context.fillStyle = node.color;
        context.fill();
        context.font = '10px system-ui, sans-serif';
        context.fillStyle = 'rgba(255,255,255,0.72)';
        context.fillText(node.label, x + node.radius + 4, node.y + 4);
      });
    }

    draw();
    window.addEventListener('resize', draw, { passive: true });
  };

  CV.demos.events = function eventsDemo() {
    const element = document.querySelector('.cv-demo-events');
    if (!element) return;
    const stream = element.querySelector('[data-event-stream]');
    const statusDot = element.querySelector('[data-event-status]');
    const startButton = element.querySelector('[data-event-start]');
    const stopButton = element.querySelector('[data-event-stop]');
    const types = [
      'collection:item_added',
      'collection:item_removed',
      'user:session_started',
      'system:heartbeat',
      'collection:price_updated',
      'user:search_performed',
      'system:cache_revalidated',
      'collection:availability_changed',
    ];
    let interval = null;

    function payload(type) {
      if (type.startsWith('collection:item')) return `{ "id": "jc_${Math.random().toString(36).slice(2, 6)}", "sku": "JELLYCAT-${Math.floor(Math.random() * 9000 + 1000)}" }`;
      if (type === 'system:heartbeat') return `{ "uptime": ${Math.floor(Math.random() * 86400)} }`;
      return `{ "ts": ${Date.now()} }`;
    }

    function emit() {
      if (!stream) return;
      const type = types[Math.floor(Math.random() * types.length)];
      const row = document.createElement('div');
      row.className = 'cv-event-row';
      const timestamp = document.createElement('span');
      timestamp.className = 'cv-event-ts';
      timestamp.textContent = new Date().toLocaleTimeString('en', { hour12: false });
      const typeLabel = document.createElement('span');
      typeLabel.className = 'cv-event-type';
      typeLabel.textContent = type;
      const data = document.createElement('span');
      data.className = 'cv-event-payload';
      data.textContent = payload(type);
      row.append(timestamp, typeLabel, data);
      stream.prepend(row);
      while (stream.children.length > 12) stream.lastElementChild.remove();
    }

    if (stopButton) stopButton.disabled = true;
    startButton?.addEventListener('click', () => {
      if (interval) return;
      interval = window.setInterval(emit, 800);
      if (statusDot) {
        statusDot.style.background = 'var(--cv-reconstructed)';
        statusDot.title = 'Connected';
      }
      startButton.disabled = true;
      if (stopButton) stopButton.disabled = false;
      emit();
    });
    stopButton?.addEventListener('click', () => {
      window.clearInterval(interval);
      interval = null;
      if (statusDot) {
        statusDot.style.background = 'var(--cv-quarantined)';
        statusDot.title = 'Disconnected';
      }
      if (startButton) startButton.disabled = false;
      stopButton.disabled = true;
    });
  };

  CV.demos.notifications = function notificationsDemo() {
    const element = document.querySelector('.cv-demo-notifications');
    if (!element) return;
    const container = element.querySelector('[data-notif-container]');
    const fireButton = element.querySelector('[data-notif-fire]');
    const clearButton = element.querySelector('[data-notif-clear]');
    const templates = [
      { icon: '📦', title: 'Item restocked', message: 'Jellycat Bashful Bunny Med is back in stock.', color: '#147d5a' },
      { icon: '🔔', title: 'Price dropped', message: 'CORDY ROY ELEPHANT TINY dropped 12%.', color: '#3158ff' },
      { icon: '⚡', title: 'Session event', message: 'New device session detected. 2 active.', color: '#b85c00' },
      { icon: '✓', title: 'Wishlist update', message: 'Your tracked item list was synced.', color: '#6c4db8' },
    ];
    let count = 0;

    fireButton?.addEventListener('click', () => {
      if (!container) return;
      const template = templates[count % templates.length];
      count += 1;
      const notification = document.createElement('div');
      notification.className = 'cv-notif';
      const icon = document.createElement('div');
      icon.className = 'cv-notif-icon';
      icon.style.background = `${template.color}20`;
      icon.textContent = template.icon;
      const content = document.createElement('div');
      content.className = 'cv-notif-body';
      const title = document.createElement('div');
      title.className = 'cv-notif-title';
      title.textContent = template.title;
      const message = document.createElement('div');
      message.className = 'cv-notif-message';
      message.textContent = template.message;
      const time = document.createElement('div');
      time.className = 'cv-notif-time';
      time.textContent = 'just now · pending';
      content.append(title, message, time);
      notification.append(icon, content);
      container.prepend(notification);

      window.setTimeout(() => { time.textContent = '1s · delivered'; }, 1000);
      window.setTimeout(() => {
        time.textContent = '3s · read';
        notification.style.opacity = '0.6';
      }, 3000);
      while (container.children.length > 4) container.lastElementChild.remove();
    });

    clearButton?.addEventListener('click', () => {
      if (container) container.textContent = '';
    });
  };
})();
