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
  'chaos-vault/index.html',
  'chaos-vault/HARVEST_LOG.md',
  'chaos-vault/CAPYTOPIA_HARVEST.md',
  'chaos-vault/assets/cv.css',
  'chaos-vault/assets/cv.js',
  'chaos-vault/data/affective-patterns.json',
  'chaos-vault/data/capytopia-patterns.json',
  'chaos-vault/library/affective-contracts.js',
  'chaos-vault/patterns/index.html',
  'chaos-vault/patterns/affective-contracts.html',
  'chaos-vault/patterns/interaction-budgets.html',
  'chaos-vault/patterns/artifact-compilers.html',
  'chaos-vault/patterns/continuity-systems.html',
  'chaos-vault/patterns/capytopia.html',
  'chaos-vault/departments/camera.html',
  'chaos-vault/departments/vision-analysis.html',
  'chaos-vault/departments/recovery-patterns.html',
  'chaos-vault/departments/ai-validation.html',
  'chaos-vault/departments/motion-primitives.html',
  'chaos-vault/departments/graph-visualization.html',
  'chaos-vault/departments/real-time-events.html',
  'chaos-vault/departments/notification-engine.html',
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

// Chaos Vault route and provenance checks.
const vaultIndex = read('chaos-vault/index.html');
assert.match(vaultIndex, /Affective Pattern Library/);
assert.match(vaultIndex, /\/chaos-vault\/patterns\//);
assert.match(vaultIndex, /23 Technical Parts/);
assert.match(vaultIndex, /27 Affective Patterns/);
assert.match(vaultIndex, /QUARANTINE ZONE/);

const recoveryPage = read('chaos-vault/departments/recovery-patterns.html');
assert.match(recoveryPage, /mobile-first cooking companion/);
assert.match(recoveryPage, /humane mid-task repair/);
assert.doesNotMatch(recoveryPage, /smart-home \/ fridge inventory prototype/);
assert.doesNotMatch(recoveryPage, /Fridge item identified/);

const patternPages = [
  'chaos-vault/patterns/index.html',
  'chaos-vault/patterns/affective-contracts.html',
  'chaos-vault/patterns/interaction-budgets.html',
  'chaos-vault/patterns/artifact-compilers.html',
  'chaos-vault/patterns/continuity-systems.html',
  'chaos-vault/patterns/capytopia.html',
];
patternPages.forEach((relativePath) => {
  const html = read(relativePath);
  assert.match(html, /\/chaos-vault\/assets\/cv\.css/);
  assert.match(html, /\/chaos-vault\/assets\/cv\.js/);
  assert.doesNotMatch(html, /data-buy|UndoneCommerce|etsy/i, `${relativePath} must remain isolated from commerce`);
});

const patternIndex = read('chaos-vault/patterns/index.html');
assert.match(patternIndex, /Capytopia Play Systems/);
assert.match(patternIndex, /3 Capytopia Patterns/);
assert.match(patternIndex, /Search commit history/);

// Machine-readable core affective pattern registry checks.
const registry = JSON.parse(read('chaos-vault/data/affective-patterns.json'));
assert.equal(registry.schemaVersion, '1.0.0');
assert.ok(Array.isArray(registry.patterns));
assert.equal(registry.patterns.length, 27);

const ids = registry.patterns.map((pattern) => pattern.id);
assert.equal(new Set(ids).size, ids.length, 'Affective pattern IDs must be unique');

registry.patterns.forEach((pattern) => {
  assert.match(pattern.id, /^CV-(AFX|IBG|ART|CON|CTL)-\d{3}$/);
  assert.ok(pattern.name && pattern.category && pattern.status && pattern.kind && pattern.thesis, `${pattern.id} is incomplete`);
  assert.ok(Array.isArray(pattern.origins) && pattern.origins.length > 0, `${pattern.id} needs provenance`);
  assert.ok(Array.isArray(pattern.requiredControls), `${pattern.id} needs required controls`);
  assert.ok(Array.isArray(pattern.risks) && pattern.risks.length > 0, `${pattern.id} needs risk notes`);
});

for (const banned of ['fake skin or emotion scores', 'generated quotes presented as authentic quotations', 'permanent psychological profiles']) {
  assert.ok(registry.quarantine.includes(banned), `Missing quarantine rule: ${banned}`);
}

// Capytopia supplemental pattern registry checks.
const capytopiaRegistry = JSON.parse(read('chaos-vault/data/capytopia-patterns.json'));
assert.equal(capytopiaRegistry.schemaVersion, '1.0.0');
assert.equal(capytopiaRegistry.source.repository, 'amydojo/capytopia');
assert.equal(capytopiaRegistry.source.verifiedCommit, '627f68411f8e0110b53c5a72160ef3f4c83a54fc');
assert.ok(Array.isArray(capytopiaRegistry.patterns));
assert.equal(capytopiaRegistry.patterns.length, 3);

const capytopiaIds = capytopiaRegistry.patterns.map((pattern) => pattern.id);
assert.equal(new Set(capytopiaIds).size, capytopiaIds.length, 'Capytopia pattern IDs must be unique');
capytopiaRegistry.patterns.forEach((pattern) => {
  assert.match(pattern.id, /^CV-CAP-\d{3}$/);
  assert.ok(pattern.name && pattern.category && pattern.status && pattern.kind && pattern.thesis, `${pattern.id} is incomplete`);
  assert.ok(Array.isArray(pattern.observedImplementation) && pattern.observedImplementation.length > 0, `${pattern.id} needs observed implementation`);
  assert.ok(Array.isArray(pattern.requiredControls) && pattern.requiredControls.length > 0, `${pattern.id} needs controls`);
  assert.ok(Array.isArray(pattern.risks) && pattern.risks.length > 0, `${pattern.id} needs risk notes`);
});
assert.ok(capytopiaRegistry.quarantine.includes('avatar expression interpreted as detected emotion'));

const capytopiaPage = read('chaos-vault/patterns/capytopia.html');
assert.match(capytopiaPage, /Sensory Assembly Ritual/);
assert.match(capytopiaPage, /Avatar-Mediated Self-Expression/);
assert.match(capytopiaPage, /Soft-World Task Scaffolding/);
assert.match(capytopiaPage, /connector incorrectly reported the repository as empty/);
assert.match(capytopiaPage, /Zone hit detection and actions remain unfinished/);

const capytopiaAudit = read('chaos-vault/CAPYTOPIA_HARVEST.md');
assert.match(capytopiaAudit, /That conclusion was wrong/);
assert.match(capytopiaAudit, /Do not trust repository `size` metadata alone/);
assert.match(capytopiaAudit, /627f68411f8e0110b53c5a72160ef3f4c83a54fc/);

// Dependency-free reference helper checks.
const affectiveSandbox = {
  module: { exports: {} },
  exports: {},
  globalThis: {},
  Date,
  Set,
  Object,
  Number,
  String,
  TypeError,
};
vm.createContext(affectiveSandbox);
vm.runInContext(read('chaos-vault/library/affective-contracts.js'), affectiveSandbox);
const affective = affectiveSandbox.module.exports;

for (const fn of [
  'createStateHypothesis',
  'selectAdaptationTier',
  'buildInteractionBudget',
  'resolveToneContract',
  'compileMinimumNecessaryInterface',
  'createRecoveryContract',
  'buildContinuityEnvelope',
  'calibrateLanguage',
  'selectArtifactPresentation',
  'createReversibleAction',
  'resolveValidEnding',
]) {
  assert.equal(typeof affective[fn], 'function', `Missing affective helper ${fn}`);
}

const budget = affective.buildInteractionBudget({
  taskId: 'test-task',
  policies: ['one-step-at-a-time', 'protect-progress'],
  approved: true,
});
assert.equal(budget.selectedBy, 'user');
assert.equal(budget.externalActionsAllowed, false);
assert.equal(budget.stableForTask, true);

const ending = affective.resolveValidEnding('release');
assert.equal(ending.equallyValid, true);
assert.equal(ending.requiresBoundedUndo, true);
assert.equal(ending.performsExternalAction, false);

const language = affective.calibrateLanguage({
  confidence: 0.55,
  observation: 'this pattern is still taking shape.',
  competingExplanations: ['limited history'],
});
assert.equal(language.label, 'possible');
assert.equal(language.diagnostic, false);

console.log('Undone static funnel and Chaos Vault validation passed.');
