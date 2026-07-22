import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

for (const relativePath of [
  'vault/index.html',
  'vault/vault.css',
  'vault/vault.js',
  'chaos-vault/index.html',
  'vercel.json',
]) {
  assert.ok(fs.existsSync(path.join(root, relativePath)), `Missing ${relativePath}`);
}

const home = read('index.html');
assert.match(home, /href="\/vault\/">Vault<\/a>/, 'Homepage navigation must expose Vault');
assert.match(home, /id="vault"/);
assert.match(home, /Enter Chaos Vault/);

const vault = read('vault/index.html');
assert.match(vault, /<link rel="canonical" href="\/vault\/"/);
assert.match(vault, /class="vault-skip" href="#main"/);
assert.match(vault, /<main id="main">/);
assert.match(vault, /aria-live="polite"/);
assert.match(vault, /id="vault-search"[^>]*type="search"/);
assert.match(vault, /id="patterns"/);
assert.match(vault, /id="parts"/);
assert.match(vault, /id="records"/);
assert.match(vault, /35<\/strong><span>documented patterns/);
assert.match(vault, /23<\/strong><span>technical parts/);
assert.match(vault, /14<\/strong><span>donor systems/);
assert.match(vault, /0<\/strong><span>emotional diagnoses/);
assert.match(vault, /Provenance stays attached/);
assert.match(vault, /The apps died\. The invention did not\./);
assert.doesNotMatch(vault, /data-buy|UndoneCommerce|etsy/i, 'Vault must remain isolated from commerce');
assert.doesNotMatch(vault, /fonts\.googleapis|unpkg|jsdelivr|cdnjs/i, 'Vault front door must not require external assets');

const searchableCount = (vault.match(/data-searchable=/g) || []).length;
assert.equal(searchableCount, 14, 'Vault search should cover six pattern families and eight technical departments');

const entryCardCount = (vault.match(/class="vault-entry-card(?: vault-entry-card-main)?"/g) || []).length;
assert.equal(entryCardCount, 3, 'Front door must keep exactly three primary routes');

const localHrefs = Array.from(vault.matchAll(/href="(\/chaos-vault\/[^"]+)"/g), (match) => match[1]);
for (const href of localHrefs) {
  const withoutFragment = href.split('#')[0];
  const relativePath = withoutFragment.replace(/^\//, '');
  assert.ok(fs.existsSync(path.join(root, relativePath)), `Vault links to missing file ${relativePath}`);
}

const legacy = read('chaos-vault/index.html');
assert.match(legacy, /http-equiv="refresh" content="0; url=\/vault\/"/);
assert.match(legacy, /window\.location\.replace\(destination\)/);
assert.match(legacy, /window\.location\.search/);
assert.match(legacy, /window\.location\.hash/);
assert.match(legacy, /<noscript>/);

const css = read('vault/vault.css');
assert.match(css, /\.vault-body :focus-visible/);
assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
assert.match(css, /@media \(max-width: 640px\)/);
assert.match(css, /--vault-paper:/);
assert.match(css, /--vault-signal:/);
assert.doesNotMatch(css, /url\(['"]?https?:/i, 'Vault CSS must remain self-contained');

const script = read('vault/vault.js');
assert.match(script, /querySelectorAll\('\[data-searchable\]'\)/);
assert.match(script, /item\.hidden = !matches/);
assert.match(script, /status\.textContent/);
assert.doesNotMatch(script, /innerHTML|eval\(|fetch\(/, 'Vault search must stay local and text-only');

const vercel = JSON.parse(read('vercel.json'));
assert.ok(Array.isArray(vercel.redirects));
assert.deepEqual(
  vercel.redirects.map(({ source, destination, permanent }) => ({ source, destination, permanent })),
  [
    { source: '/chaos-vault', destination: '/vault/', permanent: true },
    { source: '/chaos-vault/', destination: '/vault/', permanent: true },
  ],
);

console.log('Vault front door validation passed.');
