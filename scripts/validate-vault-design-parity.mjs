import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

const cssPath = 'chaos-vault/assets/cv.css';
assert.ok(fs.existsSync(path.join(root, cssPath)), `Missing ${cssPath}`);

const css = read(cssPath);

for (const contract of [
  '--cv-bg: #f2efe6',
  '--cv-surface: #fffdf7',
  '--cv-text: #14130f',
  '--cv-accent: #f04b2f',
  '--cv-tested: #3158ff',
  '--cv-font-serif:',
  'background-size: 28px 28px',
  '.cv-topbar',
  '.cv-sidebar',
  '.cv-page-title',
  '.cv-pattern-card',
  '.cv-pattern-spec',
  '.cv-demo-frame',
  '.cv-quarantine-zone',
  '.cv-body :focus-visible',
  '@media (max-width: 680px)',
  '@media (prefers-reduced-motion: reduce)',
]) {
  assert.ok(css.includes(contract), `Deep Vault theme is missing contract: ${contract}`);
}

assert.doesNotMatch(css, /--cv-bg:\s*#08080e/i, 'Deep Vault must not retain the former dark dashboard root');
assert.doesNotMatch(css, /fonts\.googleapis|unpkg|jsdelivr|cdnjs/i, 'Deep Vault theme must remain self-contained');
assert.doesNotMatch(css, /url\(['"]?https?:/i, 'Deep Vault CSS must not fetch external assets');

const pageDirectories = [
  'chaos-vault/patterns',
  'chaos-vault/departments',
];

const pages = pageDirectories.flatMap((directory) =>
  fs.readdirSync(path.join(root, directory))
    .filter((filename) => filename.endsWith('.html'))
    .map((filename) => path.join(directory, filename)),
);

assert.ok(pages.length >= 15, 'Expected the full pattern and department library to be covered');

for (const relativePath of pages) {
  const html = read(relativePath);
  assert.match(html, /href="\/chaos-vault\/assets\/cv\.css"/, `${relativePath} must use the shared editorial theme`);
  assert.match(html, /src="\/chaos-vault\/assets\/cv\.js"/, `${relativePath} must retain the shared interaction runtime`);
  assert.doesNotMatch(html, /data-buy|UndoneCommerce|etsy/i, `${relativePath} must remain isolated from commerce`);
}

const frontDoorCss = read('vault/vault.css');
for (const sharedToken of ['#f2efe6', '#fffdf7', '#14130f', '#f04b2f', '#3158ff']) {
  assert.ok(frontDoorCss.includes(sharedToken), `Front door is missing shared token ${sharedToken}`);
  assert.ok(css.includes(sharedToken), `Deep library is missing shared token ${sharedToken}`);
}

console.log(`Vault design parity validation passed across ${pages.length} deep pages.`);
