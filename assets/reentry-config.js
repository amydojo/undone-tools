/* Shared public configuration for RE:ENTRY funnel surfaces and API fallbacks. */
(function initReentryConfig(root, factory) {
  'use strict';
  const config = factory();
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
