/* RE:ENTRY funnel behavior. Emits only allowlisted, non-sensitive analytics metadata. */
(function initReentryFunnel(root) {
  'use strict';

  const ALLOWED_ANALYTICS_KEYS = Object.freeze([
    'placement',
    'sourcePage',
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'completed',
  ]);
  const CAMPAIGN_KEYS = Object.freeze(['utm_source', 'utm_medium', 'utm_campaign', 'utm_content']);
  const FORM_ENDPOINT = '/api/reentry-pilot';

  function sanitizeAnalyticsPayload(payload) {
    const clean = {};
    ALLOWED_ANALYTICS_KEYS.forEach((key) => {
      const value = payload && payload[key];
      if (typeof value === 'string') clean[key] = value.slice(0, 200);
      if (typeof value === 'boolean') clean[key] = value;
    });
    return clean;
  }

  function track(eventName, payload) {
    if (!root.UndoneAnalytics || typeof root.UndoneAnalytics.track !== 'function') return;
    root.UndoneAnalytics.track(eventName, sanitizeAnalyticsPayload(payload));
  }

  function campaignFromLocation() {
    const params = new URL(root.location.href).searchParams;
    const campaign = {};
    CAMPAIGN_KEYS.forEach((key) => {
      const value = params.get(key);
      if (value) campaign[key] = value;
    });
    return campaign;
  }

  function eventPayload(element, extra) {
    return {
      placement: (element && element.dataset && element.dataset.placement) || 'unknown',
      sourcePage: root.location.pathname,
      ...campaignFromLocation(),
      ...(extra || {}),
    };
  }

  function setFallbackEmail() {
    const email = (root.REENTRY_CONFIG && root.REENTRY_CONFIG.contactEmail) || 'hello@undone.design';
    document.querySelectorAll('[data-reentry-fallback-email]').forEach((link) => {
      link.textContent = email;
      link.href = `mailto:${email}`;
    });
  }

  function bindTrackedLinks() {
    document.querySelectorAll('[data-reentry-demo]').forEach((link) => {
      link.addEventListener('click', () => track('reentry_demo_clicked', eventPayload(link)));
    });

    document.querySelectorAll('[data-reentry-pilot-cta]').forEach((link) => {
      link.addEventListener('click', () => track('reentry_pilot_cta_clicked', eventPayload(link)));
    });

    document.querySelectorAll('[data-reentry-etsy-bridge]').forEach((link) => {
      link.addEventListener('click', () => track('reentry_etsy_bridge_clicked', eventPayload(link, {
        placement: 'microneedling-cross-sell',
      })));
    });
  }

  function bindPilotForm() {
    const form = document.getElementById('reentryPilotForm');
    if (!form) return;

    let started = false;
    const status = document.getElementById('reentryPilotStatus');
    const fallback = form.querySelector('.std-reentry-fallback');
    const submit = form.querySelector('button[type="submit"]');

    form.addEventListener('input', () => {
      if (started) return;
      started = true;
      track('reentry_pilot_form_started', eventPayload(form, { placement: 'founding-pilot-form' }));
    }, { once: true });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const formData = new FormData(form);
      const payload = {
        name: String(formData.get('name') || ''),
        businessName: String(formData.get('businessName') || ''),
        email: String(formData.get('email') || ''),
        socialUrl: String(formData.get('socialUrl') || ''),
        primaryTreatment: String(formData.get('primaryTreatment') || ''),
        appointmentsPerMonth: String(formData.get('appointmentsPerMonth') || ''),
        aftercareMethod: String(formData.get('aftercareMethod') || ''),
        repeatedQuestion: String(formData.get('repeatedQuestion') || ''),
        faxNumber: String(formData.get('faxNumber') || ''),
        consent: String(formData.get('consent') || ''),
      };

      submit.disabled = true;
      status.dataset.state = '';
      status.textContent = 'Sending your pilot request…';
      if (fallback) fallback.hidden = true;

      try {
        const response = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
          const error = new Error(result.code || 'submission_failed');
          error.code = result.code;
          error.fallbackEmail = result.fallbackEmail;
          throw error;
        }

        status.dataset.state = 'success';
        status.textContent = 'Request received. You will hear back at the email you provided.';
        form.reset();
        track('reentry_pilot_form_submitted', eventPayload(form, { placement: 'founding-pilot-form' }));
      } catch (error) {
        status.dataset.state = 'error';
        status.textContent = error && error.code === 'rate_limited'
          ? 'Too many attempts were received. Wait a few minutes and try again.'
          : 'The form could not send your request right now.';
        if (fallback) fallback.hidden = false;
        track('reentry_pilot_form_failed', eventPayload(form, { placement: 'founding-pilot-form' }));
      } finally {
        submit.disabled = false;
      }
    });
  }

  function init() {
    setFallbackEmail();
    bindTrackedLinks();
    bindPilotForm();

    if (document.body.hasAttribute('data-reentry-page')) {
      track('reentry_page_viewed', eventPayload(document.body, { placement: 'page' }));
    }
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }

  if (typeof module === 'object' && module.exports) {
    module.exports = { sanitizeAnalyticsPayload };
  }
})(typeof window !== 'undefined' ? window : globalThis);
