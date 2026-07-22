/* ═══════════════════════════════════════════════════════════════════════════
   CHAOS VAULT PARTS DEPARTMENT — cv.js
   Namespace: ChaosVault | Isolated from app.js
   ═══════════════════════════════════════════════════════════════════════════ */

(function ChaosVault() {
  'use strict';

  /* ── Init ───────────────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    CV.scrollReveal.init();
    CV.accordion.init();
    CV.activeNav.init();

    if (document.querySelector('.cv-demo-camera'))       CV.demos.camera();
    if (document.querySelector('.cv-demo-recovery'))     CV.demos.recovery();
    if (document.querySelector('.cv-demo-ai-states'))    CV.demos.aiStates();
    if (document.querySelector('.cv-demo-motion'))       CV.demos.motion();
    if (document.querySelector('.cv-demo-graph'))        CV.demos.graph();
    if (document.querySelector('.cv-demo-events'))       CV.demos.events();
    if (document.querySelector('.cv-demo-notifications'))CV.demos.notifications();
  });

  /* ── Namespace ──────────────────────────────────────────────────────────── */
  const CV = {};

  /* ── Scroll Reveal ──────────────────────────────────────────────────────── */
  CV.scrollReveal = {
    init() {
      const els = document.querySelectorAll('.cv-reveal');
      if (!els.length) return;
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('cv-revealed');
            obs.unobserve(e.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
      els.forEach(el => obs.observe(el));
    }
  };

  /* ── Accordion (recovery reveal toggles) ───────────────────────────────── */
  CV.accordion = {
    init() {
      document.querySelectorAll('.cv-recovery-trigger').forEach(btn => {
        btn.addEventListener('click', () => {
          const target = document.getElementById(btn.dataset.target);
          if (!target) return;
          const isOpen = target.classList.contains('open');
          target.classList.toggle('open', !isOpen);
          btn.setAttribute('aria-expanded', String(!isOpen));
          const arrow = btn.querySelector('.cv-trigger-arrow');
          if (arrow) arrow.textContent = isOpen ? '▸' : '▾';
        });
      });
    }
  };

  /* ── Active nav highlighting ────────────────────────────────────────────── */
  CV.activeNav = {
    init() {
      const path = location.pathname;
      document.querySelectorAll('.cv-sidebar-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href && path.endsWith(href.replace(/^.*\//, '').replace(/^\//, ''))) {
          link.classList.add('active');
        }
      });
    }
  };

  /* ── Demos ──────────────────────────────────────────────────────────────── */
  CV.demos = {};

  /* Camera Demo — simulates getUserMedia state machine */
  CV.demos.camera = function() {
    const el = document.querySelector('.cv-demo-camera');
    if (!el) return;

    const btn = el.querySelector('[data-camera-btn]');
    const status = el.querySelector('[data-camera-status]');
    const viewfinder = el.querySelector('[data-camera-viewfinder]');
    const video = el.querySelector('video');

    let state = 'idle';

    const states = {
      idle:        { label: 'AWAITING PERMISSION', color: 'var(--cv-text-dim)' },
      requesting:  { label: 'REQUESTING PERMISSION…', color: 'var(--cv-experimental)' },
      streaming:   { label: 'STREAM ACTIVE', color: 'var(--cv-reconstructed)' },
      denied:      { label: 'PERMISSION DENIED — FALLBACK MODE', color: 'var(--cv-quarantined)' },
      nosupport:   { label: 'NO SUPPORT — FILE UPLOAD FALLBACK', color: 'var(--cv-awaiting)' },
      captured:    { label: 'FRAME CAPTURED TO CANVAS', color: 'var(--cv-tested)' },
    };

    function setState(s) {
      state = s;
      const info = states[s] || states.idle;
      if (status) { status.textContent = info.label; status.style.color = info.color; }
    }

    if (btn) {
      btn.addEventListener('click', async () => {
        if (state === 'streaming') {
          setState('captured');
          btn.textContent = 'Reset';
          if (video && video.srcObject) {
            video.srcObject.getTracks().forEach(t => t.stop());
            video.srcObject = null;
          }
          return;
        }
        if (state === 'captured' || state === 'denied' || state === 'nosupport') {
          setState('idle');
          btn.textContent = 'Request Camera';
          if (video) video.style.display = 'none';
          return;
        }

        setState('requesting');
        btn.textContent = '…';

        if (!navigator.mediaDevices?.getUserMedia) {
          setTimeout(() => { setState('nosupport'); btn.textContent = 'Reset'; }, 800);
          return;
        }

        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: { ideal: 'environment' }, width: { ideal: 640 } },
            audio: false
          });
          if (video) {
            video.srcObject = stream;
            video.style.display = 'block';
            video.play().catch(() => {});
          }
          setState('streaming');
          btn.textContent = 'Capture Frame';
        } catch (err) {
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            setState('denied');
          } else {
            setState('nosupport');
          }
          btn.textContent = 'Reset';
        }
      });
    }
  };

  /* Recovery Demo — "Something feels off?" reveal */
  CV.demos.recovery = function() {
    const el = document.querySelector('.cv-demo-recovery');
    if (!el) return;
    // handled by CV.accordion.init via .cv-recovery-trigger
  };

  /* AI States Demo — step-through state machine */
  CV.demos.aiStates = function() {
    const el = document.querySelector('.cv-demo-ai-states');
    if (!el) return;

    const steps = el.querySelectorAll('.cv-sm-state');
    const nextBtn = el.querySelector('[data-ai-next]');
    const resetBtn = el.querySelector('[data-ai-reset]');
    const logEl = el.querySelector('[data-ai-log]');
    let current = -1;

    const labels = ['validate', 'repair', 'regenerate', 'fallback'];
    const logs = [
      '→ Checking response schema…',
      '→ Schema invalid. Attempting field repair…',
      '→ Repair incomplete. Triggering regeneration…',
      '→ Max retries reached. Loading guaranteed fallback.'
    ];

    function advance() {
      if (current >= steps.length - 1) return;
      if (current >= 0) steps[current].classList.remove('active');
      current++;
      steps[current].classList.add('active');
      if (logEl) {
        const line = document.createElement('div');
        line.style.cssText = 'font-family:var(--cv-font-mono);font-size:12px;color:var(--cv-text-muted);padding:4px 0;border-bottom:1px solid var(--cv-border);animation:cv-fade-up 0.3s ease';
        line.textContent = logs[current] || '→ Step complete.';
        logEl.appendChild(line);
        logEl.scrollTop = logEl.scrollHeight;
      }
      if (nextBtn && current >= steps.length - 1) nextBtn.disabled = true;
    }

    function reset() {
      steps.forEach(s => { s.classList.remove('active', 'done', 'failed'); });
      current = -1;
      if (nextBtn) nextBtn.disabled = false;
      if (logEl) logEl.innerHTML = '';
    }

    if (nextBtn) nextBtn.addEventListener('click', advance);
    if (resetBtn) resetBtn.addEventListener('click', reset);
  };

  /* Motion Demo — showcases loader/microinteraction primitives */
  CV.demos.motion = function() {
    const el = document.querySelector('.cv-demo-motion');
    if (!el) return;
    // Loaders are CSS-driven; JS only handles the toggle
    const tabs = el.querySelectorAll('[data-motion-tab]');
    const panels = el.querySelectorAll('[data-motion-panel]');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.style.display = 'none');
        tab.classList.add('active');
        const target = el.querySelector(`[data-motion-panel="${tab.dataset.motionTab}"]`);
        if (target) target.style.display = 'flex';
      });
    });
  };

  /* Graph Demo — three-layer Living Tapestry visualization */
  CV.demos.graph = function() {
    const canvas = document.querySelector('.cv-graph-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight || 340;
    canvas.width = W * (window.devicePixelRatio || 1);
    canvas.height = H * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

    const nodes = [
      // Layer 1: Chronology (timeline spine)
      { id: 'e1', x: 80,  y: 60,  layer: 1, label: 'Idea', color: '#f0c040', r: 7 },
      { id: 'e2', x: 200, y: 60,  layer: 1, label: 'Action', color: '#f0c040', r: 7 },
      { id: 'e3', x: 320, y: 60,  layer: 1, label: 'Insight', color: '#f0c040', r: 7 },
      { id: 'e4', x: 440, y: 60,  layer: 1, label: 'Action', color: '#f0c040', r: 7 },

      // Layer 2: Same-type clusters
      { id: 'c1', x: 80,  y: 180, layer: 2, label: 'Idea ×3', color: '#60c8ff', r: 12 },
      { id: 'c2', x: 280, y: 180, layer: 2, label: 'Action ×4', color: '#60c8ff', r: 14 },
      { id: 'c3', x: 460, y: 180, layer: 2, label: 'Insight ×2', color: '#60c8ff', r: 10 },

      // Layer 3: Semantic (idea→action→insight chain)
      { id: 's1', x: 120, y: 290, layer: 3, label: 'Idea→Action', color: '#4fffb0', r: 8 },
      { id: 's2', x: 280, y: 290, layer: 3, label: 'Action→Insight', color: '#4fffb0', r: 8 },
      { id: 's3', x: 420, y: 290, layer: 3, label: 'Insight→Idea', color: '#4fffb0', r: 8 },
    ];

    const edges = [
      ['e1','e2'], ['e2','e3'], ['e3','e4'],         // chronology spine
      ['e1','c1'], ['e2','c2'], ['e4','c2'], ['e3','c3'], // cluster links
      ['c1','s1'], ['c2','s1'], ['c2','s2'], ['c3','s2'], ['c3','s3'], // semantic
      ['s3','c1'],                                   // feedback loop
    ];

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // Layer labels
      const layerLabels = ['LAYER 1 — CHRONOLOGY', 'LAYER 2 — CLUSTERS', 'LAYER 3 — SEMANTIC'];
      const layerY = [40, 160, 270];
      layerLabels.forEach((lbl, i) => {
        ctx.font = '9px "SF Mono", monospace';
        ctx.fillStyle = 'rgba(255,255,255,0.12)';
        ctx.fillText(lbl, 8, layerY[i]);
      });

      // Layer lines
      [75, 195, 305].forEach(y => {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.strokeStyle = 'rgba(255,255,255,0.04)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Edges
      edges.forEach(([aId, bId]) => {
        const a = nodes.find(n => n.id === aId);
        const b = nodes.find(n => n.id === bId);
        if (!a || !b) return;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Nodes
      nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.globalAlpha = 0.85;
        ctx.fill();
        ctx.globalAlpha = 1;

        ctx.font = '10px system-ui, sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.fillText(n.label, n.x + n.r + 4, n.y + 4);
      });
    }

    draw();
  };

  /* Real-time Events Demo — simulated SSE event stream */
  CV.demos.events = function() {
    const el = document.querySelector('.cv-demo-events');
    if (!el) return;

    const stream = el.querySelector('[data-event-stream]');
    const statusDot = el.querySelector('[data-event-status]');
    const startBtn = el.querySelector('[data-event-start]');
    const stopBtn = el.querySelector('[data-event-stop]');
    let interval = null;

    const eventTypes = [
      'collection:item_added',
      'collection:item_removed',
      'user:session_started',
      'system:heartbeat',
      'collection:price_updated',
      'user:search_performed',
      'system:cache_revalidated',
      'collection:availability_changed',
    ];

    function randomPayload(type) {
      if (type.startsWith('collection:item')) return `{ "id": "jc_${Math.random().toString(36).slice(2,6)}", "sku": "JELLYCAT-${~~(Math.random()*9000+1000)}" }`;
      if (type === 'system:heartbeat') return `{ "uptime": ${~~(Math.random()*86400)}s }`;
      return `{ "ts": ${Date.now()} }`;
    }

    function emit() {
      if (!stream) return;
      const type = eventTypes[~~(Math.random() * eventTypes.length)];
      const row = document.createElement('div');
      row.className = 'cv-event-row';
      const ts = new Date().toLocaleTimeString('en', { hour12: false });
      row.innerHTML = `<span class="cv-event-ts">${ts}</span><span class="cv-event-type">${type}</span><span class="cv-event-payload">${randomPayload(type)}</span>`;
      stream.prepend(row);
      // trim to 12
      while (stream.children.length > 12) stream.removeChild(stream.lastChild);
    }

    if (startBtn) {
      startBtn.addEventListener('click', () => {
        if (interval) return;
        interval = setInterval(emit, 800);
        if (statusDot) { statusDot.style.background = 'var(--cv-reconstructed)'; statusDot.title = 'Connected'; }
        startBtn.disabled = true;
        if (stopBtn) stopBtn.disabled = false;
        emit(); // immediate first
      });
    }

    if (stopBtn) {
      stopBtn.disabled = true;
      stopBtn.addEventListener('click', () => {
        clearInterval(interval);
        interval = null;
        if (statusDot) { statusDot.style.background = 'var(--cv-quarantined)'; statusDot.title = 'Disconnected'; }
        startBtn.disabled = false;
        stopBtn.disabled = true;
      });
    }
  };

  /* Notifications Demo — lifecycle states */
  CV.demos.notifications = function() {
    const el = document.querySelector('.cv-demo-notifications');
    if (!el) return;

    const container = el.querySelector('[data-notif-container]');
    const btn = el.querySelector('[data-notif-fire]');
    const clearBtn = el.querySelector('[data-notif-clear]');

    const templates = [
      { icon: '📦', title: 'Item restocked', message: 'Jellycat Bashful Bunny Med is back in stock.', color: '#4fffb0' },
      { icon: '🔔', title: 'Price dropped', message: 'CORDY ROY ELEPHANT TINY dropped 12%.', color: '#60c8ff' },
      { icon: '⚡', title: 'Session event', message: 'New device session detected. 2 active.', color: '#f0c040' },
      { icon: '✓',  title: 'Wishlist update', message: 'Your tracked item list was synced.', color: '#c792ea' },
    ];

    let count = 0;

    if (btn) {
      btn.addEventListener('click', () => {
        if (!container) return;
        const t = templates[count % templates.length];
        count++;
        const notif = document.createElement('div');
        notif.className = 'cv-notif';
        notif.style.animationDelay = '0ms';
        notif.innerHTML = `
          <div class="cv-notif-icon" style="background:${t.color}20">${t.icon}</div>
          <div class="cv-notif-body">
            <div class="cv-notif-title">${t.title}</div>
            <div class="cv-notif-message">${t.message}</div>
            <div class="cv-notif-time">just now · pending</div>
          </div>`;
        container.prepend(notif);

        // lifecycle: pending → delivered → read
        setTimeout(() => {
          const ts = notif.querySelector('.cv-notif-time');
          if (ts) ts.textContent = '1s · delivered';
        }, 1000);
        setTimeout(() => {
          const ts = notif.querySelector('.cv-notif-time');
          if (ts) ts.textContent = '3s · read';
          notif.style.opacity = '0.6';
        }, 3000);

        // trim to 4
        while (container.children.length > 4) container.removeChild(container.lastChild);
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (container) container.innerHTML = '';
      });
    }
  };

})();
