/* Undone Standards commerce configuration.
   Replace fallback checkoutUrl values with exact Etsy Share & Save listing URLs. */
(function initUndoneCommerce(root) {
  'use strict';

  const SHOP_FALLBACK = 'https://undonebydesign.etsy.com';
  const CAMPAIGN_KEYS = Object.freeze([
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
  ]);

  const PRODUCTS = Object.freeze({
    're-entry': Object.freeze({
      id: 're-entry',
      name: 'RE:ENTRY',
      path: '/standards/re-entry.html',
      demoUrl: 'https://re-entry-eight.vercel.app/client/SP-0042/demo-secure-token',
      pilotUrl: '/standards/re-entry.html#founding-pilot',
      pricingLabel: '$59 / 90-day founding pilot',
      productType: 'live-system',
      checkoutUrl: null,
      exactListingConfigured: false,
      status: 'founding-pilot',
    }),
    'microneedling-pre-care': Object.freeze({
      id: 'microneedling-pre-care',
      name: 'Microneedling Pre-Care Checklist',
      path: '/standards/microneedling-pre-care.html',
      checkoutUrl: SHOP_FALLBACK,
      exactListingConfigured: false,
      status: 'available',
    }),
    'summer-skin-safety': Object.freeze({
      id: 'summer-skin-safety',
      name: 'Summer Skin Safety Handout',
      path: '/standards/summer-skin-safety.html',
      checkoutUrl: SHOP_FALLBACK,
      exactListingConfigured: false,
      status: 'available',
    }),
    'injectables-aftercare': Object.freeze({
      id: 'injectables-aftercare',
      name: 'Injectables Aftercare Guide',
      path: '/standards/injectables-aftercare.html',
      checkoutUrl: null,
      exactListingConfigured: false,
      status: 'concept',
    }),
    'laser-aftercare': Object.freeze({
      id: 'laser-aftercare',
      name: 'Laser Aftercare Guide',
      path: '/standards/laser-aftercare.html',
      checkoutUrl: null,
      exactListingConfigured: false,
      status: 'concept',
    }),
  });

  function getProduct(productId) {
    return PRODUCTS[productId] || null;
  }

  function buildOutboundUrl(options) {
    const settings = options || {};
    const product = getProduct(settings.productId);
    if (!product || !product.checkoutUrl) return null;

    const currentUrl = settings.currentUrl || root.location.href;
    const placement = settings.placement || 'unknown';
    const campaign = settings.campaign || {};
    const url = new URL(product.checkoutUrl, currentUrl);

    const defaults = {
      utm_source: 'undone_tools',
      utm_medium: 'referral',
      utm_campaign: 'standards_chamber',
      utm_content: `${product.id}-${placement}`,
    };

    CAMPAIGN_KEYS.forEach((key) => {
      if (url.searchParams.has(key)) return;
      const value = campaign[key] || defaults[key];
      if (value) url.searchParams.set(key, value);
    });

    return url.toString();
  }

  root.UndoneCommerce = Object.freeze({
    shopFallback: SHOP_FALLBACK,
    campaignKeys: CAMPAIGN_KEYS,
    products: PRODUCTS,
    getProduct,
    buildOutboundUrl,
  });
})(window);
