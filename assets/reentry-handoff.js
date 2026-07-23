/* Client-only Aftercare Handoff Simulator. Answers never leave the page. */
(function initReentryHandoff(root) {
  'use strict';

  const ROWS = Object.freeze([
    ['issued', 'ISSUED'],
    ['availableToday', 'AVAILABLE TODAY'],
    ['nextChange', 'NEXT CHANGE'],
    ['unknownQuestion', 'UNKNOWN QUESTION'],
    ['providerUpdate', 'PROVIDER UPDATE'],
    ['accessControl', 'ACCESS CONTROL'],
  ]);

  function evaluateHandoff(answers) {
    const input = answers || {};
    const issued = input.delivery === 'verbal' ? 'manual' : 'present';
    const availableToday = input.today === 'yes' ? 'present' : input.today === 'sometimes' ? 'manual' : 'missing';
    const nextChange = input.change === 'yes' ? 'manual' : input.change === 'replacement' ? 'manual' : 'missing';
    const unknownQuestion = input.unknown === 'asks-us' ? 'manual'
      : input.unknown === 'general-guidance' ? 'missing'
        : input.unknown === 'not-addressed' ? 'missing' : 'manual';
    const providerUpdate = input.change === 'yes' ? 'present'
      : input.change === 'replacement' ? 'manual' : 'missing';
    const accessControl = input.access === 'yes' ? 'present'
      : input.access === 'unsure' ? 'manual' : 'missing';

    return Object.freeze({
      issued,
      availableToday,
      nextChange,
      unknownQuestion,
      providerUpdate,
      accessControl,
    });
  }

  function stateLabel(state) {
    if (state === 'present') return 'Present';
    if (state === 'manual') return 'Manual';
    return 'Missing';
  }

  function readAnswers(form) {
    const data = new FormData(form);
    return {
      delivery: String(data.get('delivery') || ''),
      change: String(data.get('change') || ''),
      today: String(data.get('today') || ''),
      unknown: String(data.get('unknown') || ''),
      access: String(data.get('access') || ''),
    };
  }

  function track(eventName, payload) {
    if (!root.UndoneAnalytics || typeof root.UndoneAnalytics.track !== 'function') return;
    root.UndoneAnalytics.track(eventName, {
      sourcePage: root.location.pathname,
      completed: Boolean(payload && payload.completed),
    });
  }

  function initDom() {
    const form = document.getElementById('reentryHandoffForm');
    const results = document.getElementById('reentryHandoffResults');
    const rows = document.getElementById('reentryGapRows');
    if (!form || !results || !rows) return;

    let started = false;
    form.addEventListener('change', () => {
      if (started) return;
      started = true;
      track('reentry_simulator_started', { completed: false });
    }, { once: true });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const outcome = evaluateHandoff(readAnswers(form));
      rows.replaceChildren();

      ROWS.forEach(([key, label]) => {
        const row = document.createElement('div');
        row.className = 'std-reentry-gap-row';
        row.dataset.state = outcome[key];

        const name = document.createElement('strong');
        name.textContent = label;
        const value = document.createElement('span');
        value.textContent = stateLabel(outcome[key]);

        row.append(name, value);
        rows.append(row);
      });

      results.hidden = false;
      results.focus({ preventScroll: true });
      results.scrollIntoView({
        behavior: root.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start',
      });
      track('reentry_simulator_completed', { completed: true });
    });

    form.addEventListener('reset', () => {
      results.hidden = true;
      rows.replaceChildren();
      started = false;
    });
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initDom);
    } else {
      initDom();
    }
  }

  if (typeof module === 'object' && module.exports) {
    module.exports = { evaluateHandoff, stateLabel };
  }
})(typeof window !== 'undefined' ? window : globalThis);
