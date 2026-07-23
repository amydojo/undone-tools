/* Shared public configuration for RE:ENTRY funnel surfaces and API fallbacks. */
(function initReentryConfig(root, factory) {
  'use strict';

  const config = factory();

  // Keep issued-artifact meaning, timing, and status in separate physical zones.
  // This runs only in browsers; the API can require this file without DOM side effects.
  if (root && root.document) {
    const geometry = root.document.createElement('style');
    geometry.dataset.reentryArtifactGeometry = 'true';
    geometry.textContent = [
      '.std-reentry-pass{min-height:390px}',
      '.std-reentry-pass > strong{position:static;display:block;margin-top:26px}',
      '@media(max-width:700px){.std-reentry-pass{min-height:360px}}',
    ].join('');
    root.document.head.append(geometry);
  }

  if (typeof module === 'object' && module.exports) module.exports = config;
  if (root) root.REENTRY_CONFIG = config;
})(typeof window !== 'undefined' ? window : globalThis, function createReentryConfig() {
  'use strict';
  return Object.freeze({
    contactEmail: 'hello@undone.design',
    salesPath: '/standards/re-entry.html',
    simulatorPath: '/standards/re-entry-handoff.html',
    pilotAnchor: '/standards/re-entry.html#founding-pilot',
    demoUrl: 'https://re-entry-eight.vercel.app/client/SP-0042/demo-secure-token',
  });
});
