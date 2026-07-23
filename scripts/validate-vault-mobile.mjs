import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

for (const relativePath of [
  'vault/index.html',
  'vault/mobile.css',
  'vault/vault.js',
  'chaos-vault/assets/mobile.css',
  'chaos-vault/assets/cv.js',
]) {
  assert.ok(fs.existsSync(path.join(root, relativePath)), `Missing ${relativePath}`);
}

const front = read('vault/index.html');
assert.match(front, /href="\/vault\/mobile\.css"/);
assert.match(front, /class="vault-menu-toggle"/);
assert.match(front, /id="vault-nav"/);
assert.match(front, /id="start" class="vault-problem-nav"/);
assert.match(front, /What are you trying to make easier\?/);
assert.match(front, /Simplify a task/);
assert.match(front, /Recover mid-task/);
assert.match(front, /Make an artifact/);
assert.match(front, /Carry context forward/);
assert.match(front, /id="vault-records-toggle"/);
assert.match(front, /class="vault-mobile-bar"/);
assert.match(front, /data-vault-focus-search/);

const frontCss = read('vault/mobile.css');
assert.match(frontCss, /@media \(max-width: 700px\)/);
assert.match(frontCss, /\.vault-nav\.is-open/);
assert.match(frontCss, /\.vault-problem-grid/);
assert.match(frontCss, /\.vault-record-grid\.is-open/);
assert.match(frontCss, /env\(safe-area-inset-bottom\)/);
assert.match(frontCss, /scroll-snap-type/);
assert.doesNotMatch(frontCss, /url\(['"]?https?:/i, 'Mobile front door CSS must stay self-contained');

const frontJs = read('vault/vault.js');
assert.match(frontJs, /setMenu\(open\)/);
assert.match(frontJs, /vault-menu-open/);
assert.match(frontJs, /Hide source records/);
assert.match(frontJs, /scrollIntoView/);
assert.doesNotMatch(frontJs, /fetch\(|localStorage|sessionStorage/);

const deepCss = read('chaos-vault/assets/mobile.css');
assert.match(deepCss, /@media \(max-width: 980px\)/);
assert.match(deepCss, /\.cv-nav-open \.cv-sidebar/);
assert.match(deepCss, /\.cv-mobile-nav-search/);
assert.match(deepCss, /\.cv-mobile-bar/);
assert.match(deepCss, /\.cv-mobile-section-body\[hidden\]/);
assert.match(deepCss, /\.cv-mobile-pattern-details\[hidden\]/);
assert.match(deepCss, /100dvh/);
assert.match(deepCss, /env\(safe-area-inset-bottom\)/);
assert.doesNotMatch(deepCss, /url\(['"]?https?:/i, 'Deep mobile CSS must stay self-contained');

const deepJs = read('chaos-vault/assets/cv.js');
assert.match(deepJs, /\/chaos-vault\/assets\/mobile\.css/);
assert.match(deepJs, /CV\.mobileNav/);
assert.match(deepJs, /Filter this archive/);
assert.match(deepJs, /CV\.mobileSummary/);
assert.match(deepJs, /CV\.mobileDisclosure/);
assert.match(deepJs, /CV\.mobilePatternDetails/);
assert.match(deepJs, /Implementation details/);
assert.match(deepJs, /CV\.demos\.camera/);
assert.match(deepJs, /CV\.demos\.aiStates/);
assert.match(deepJs, /CV\.demos\.motion/);
assert.match(deepJs, /CV\.demos\.graph/);
assert.match(deepJs, /CV\.demos\.events/);
assert.match(deepJs, /CV\.demos\.notifications/);
assert.doesNotMatch(deepJs, /fetch\(|localStorage|sessionStorage/);

const deepPages = [
  'chaos-vault/patterns/index.html',
  'chaos-vault/patterns/affective-contracts.html',
  'chaos-vault/patterns/interaction-budgets.html',
  'chaos-vault/patterns/artifact-compilers.html',
  'chaos-vault/patterns/continuity-systems.html',
  'chaos-vault/patterns/capytopia.html',
  'chaos-vault/patterns/design-intent-infrastructure.html',
  'chaos-vault/patterns/artifact-infrastructure.html',
  'chaos-vault/departments/camera.html',
  'chaos-vault/departments/vision-analysis.html',
  'chaos-vault/departments/recovery-patterns.html',
  'chaos-vault/departments/ai-validation.html',
  'chaos-vault/departments/motion-primitives.html',
  'chaos-vault/departments/graph-visualization.html',
  'chaos-vault/departments/real-time-events.html',
  'chaos-vault/departments/notification-engine.html',
];

deepPages.forEach((relativePath) => {
  const html = read(relativePath);
  assert.match(html, /\/chaos-vault\/assets\/cv\.css/);
  assert.match(html, /\/chaos-vault\/assets\/cv\.js/);
  assert.match(html, /class="cv-sidebar"/);
  assert.match(html, /class="cv-main"/);
});

console.log('Vault mobile usability validation passed.');
