import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

const requiredFiles = [
  'index.html',
  'standards/index.html',
  'standards/microneedling-pre-care.html',
  'standards/summer-skin-safety.html',
  'standards/injectables-aftercare.html',
  'standards/laser-aftercare.html',
  'assets/styles.css',
  'assets/commerce.css',
  'assets/products.js',
  'assets/analytics.js',
  'assets/app.js',
  'PRODUCT_CONTENT_NEEDED.md',
];

requiredFiles.forEach((relativePath) => {
  assert.ok(fs.existsSync(path.join(root, relativePath)), `Missing ${relativePath}`);
});

const activePages = [
  ['standards/microneedling-pre-care.html', 'microneedling-pre-care'],
  ['standards/summer-skin-safety.html', 'summer-skin-safety'],
];

activePages.forEach(([relativePath, productId]) => {
  const html = read(relativePath);
  assert.match(html, new RegExp(`data-product-page[^>]*data-product="${productId}"|data-product="${productId}"[^>]*data-product-page`));
  assert.match(html, /href="https:\/\/undonebydesign\.etsy\.com"[^>]*data-buy/);
  assert.match(html, /data-cta-location="primary"/);
  assert.match(html, /data-cta-location="sticky"/);
  assert.match(html, /data-preview/);
  assert.match(html, /data-related-product/);
  assert.match(html, /Structural preview|STRUCTURAL PREVIEW/);
  assert.match(html, /not medical advice/);

  const productsIndex = html.indexOf('/assets/products.js');
  const analyticsIndex = html.indexOf('/assets/analytics.js');
  const appIndex = html.indexOf('/assets/app.js');
  assert.ok(productsIndex >= 0 && analyticsIndex > productsIndex && appIndex > analyticsIndex, `${relativePath} script order is invalid`);
});

for (const archived of ['standards/injectables-aftercare.html', 'standards/laser-aftercare.html']) {
  const html = read(archived);
  assert.doesNotMatch(html, /data-buy/);
  assert.match(html, /not an active product/);
  assert.match(html, /does not contain a verified treatment protocol/);
}

const catalog = read('standards/index.html');
assert.match(catalog, /microneedling-pre-care\.html/);
assert.match(catalog, /summer-skin-safety\.html/);
assert.match(catalog, /Available/);
assert.match(catalog, /Concept archive/i);

const commerceCss = read('assets/commerce.css');
assert.doesNotMatch(commerceCss, /\.cv-/);
assert.match(commerceCss, /\.std-sticky-cta/);

const appJs = read('assets/app.js');
assert.doesNotMatch(appJs, /\.cv-/);
assert.match(appJs, /isEditableTarget/);
assert.match(appJs, /sessionStorage/);
assert.match(appJs, /sticky_etsy_cta_clicked/);

const sandbox = {
  window: { location: { href: 'https://example.test/standards/microneedling-pre-care.html' } },
  URL,
  Object,
};
vm.createContext(sandbox);
vm.runInContext(read('assets/products.js'), sandbox);

const commerce = sandbox.window.UndoneCommerce;
assert.ok(commerce, 'Commerce configuration did not initialize');
assert.equal(commerce.getProduct('injectables-aftercare').checkoutUrl, null);

const attributed = commerce.buildOutboundUrl({
  productId: 'microneedling-pre-care',
  placement: 'primary',
  currentUrl: 'https://example.test/standards/microneedling-pre-care.html',
  campaign: {
    utm_source: 'pinterest',
    utm_campaign: 'summer-launch',
  },
});
const attributedUrl = new URL(attributed);
assert.equal(attributedUrl.searchParams.get('utm_source'), 'pinterest');
assert.equal(attributedUrl.searchParams.get('utm_campaign'), 'summer-launch');
assert.equal(attributedUrl.searchParams.get('utm_medium'), 'referral');
assert.equal(attributedUrl.searchParams.get('utm_content'), 'microneedling-pre-care-primary');

const preservedSandbox = {
  window: { location: { href: 'https://example.test/' } },
  URL,
  Object,
};
vm.createContext(preservedSandbox);
const modifiedProducts = read('assets/products.js').replace(
  "checkoutUrl: SHOP_FALLBACK,",
  "checkoutUrl: 'https://www.etsy.com/listing/123/example?share=saved&utm_source=existing',",
);
vm.runInContext(modifiedProducts, preservedSandbox);
const preserved = preservedSandbox.window.UndoneCommerce.buildOutboundUrl({
  productId: 'microneedling-pre-care',
  placement: 'sticky',
  currentUrl: 'https://example.test/',
  campaign: { utm_source: 'instagram', utm_medium: 'social' },
});
const preservedUrl = new URL(preserved);
assert.equal(preservedUrl.searchParams.get('share'), 'saved');
assert.equal(preservedUrl.searchParams.get('utm_source'), 'existing');
assert.equal(preservedUrl.searchParams.get('utm_medium'), 'social');

console.log('Undone static funnel validation passed.');
