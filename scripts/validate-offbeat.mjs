import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

const requiredFiles = [
  'chaos-vault/OFFBEAT_HARVEST.md',
  'chaos-vault/data/offbeat-patterns.json',
  'chaos-vault/patterns/offbeat.html',
];

requiredFiles.forEach((relativePath) => {
  assert.ok(fs.existsSync(path.join(root, relativePath)), `Missing ${relativePath}`);
});

const registry = JSON.parse(read('chaos-vault/data/offbeat-patterns.json'));
assert.equal(registry.schemaVersion, '1.0.0');
assert.equal(registry.source.repository, 'amydojo/offbeat');
assert.equal(registry.source.verifiedRef, 'main');
assert.equal(registry.patterns.length, 4);

const ids = registry.patterns.map((pattern) => pattern.id);
assert.equal(new Set(ids).size, ids.length, 'Offbeat pattern IDs must be unique');
registry.patterns.forEach((pattern) => {
  assert.match(pattern.id, /^CV-OFF-\d{3}$/);
  assert.ok(pattern.name && pattern.category && pattern.status && pattern.kind && pattern.thesis, `${pattern.id} is incomplete`);
  assert.ok(Array.isArray(pattern.observedImplementation) && pattern.observedImplementation.length > 0, `${pattern.id} needs implementation evidence`);
  assert.ok(Array.isArray(pattern.requiredControls) && pattern.requiredControls.length > 0, `${pattern.id} needs controls`);
  assert.ok(Array.isArray(pattern.risks) && pattern.risks.length > 0, `${pattern.id} needs risk notes`);
});

for (const requiredBan of [
  'creativity scores or talent inference',
  'automatic recording',
  'the current layered loop field described as a true sequenced timeline',
]) {
  assert.ok(registry.quarantine.includes(requiredBan), `Missing Offbeat quarantine rule: ${requiredBan}`);
}

const page = read('chaos-vault/patterns/offbeat.html');
assert.match(page, /Sound-as-Object Tile/);
assert.match(page, /No-Wrong-Notes Constraint Field/);
assert.match(page, /Immediate Auditory Consequence/);
assert.match(page, /Play-to-Artifact Capture/);
assert.match(page, /repository is not empty/i);
assert.match(page, /layered loop field, not a true sequenced timeline/i);
assert.doesNotMatch(page, /data-buy|UndoneCommerce|etsy/i, 'Offbeat page must remain isolated from commerce');

const audit = read('chaos-vault/OFFBEAT_HARVEST.md');
assert.match(audit, /That conclusion was incomplete/);
assert.match(audit, /damaged alpha export/);
assert.match(audit, /Build a safe field where understanding emerges from playful consequence/);
assert.match(audit, /src\/main\.jsx/);

const patternIndex = read('chaos-vault/patterns/index.html');
assert.match(patternIndex, /Offbeat Play Systems/);
assert.match(patternIndex, /4 Offbeat Patterns/);
assert.match(patternIndex, /14 Donor Systems/);

console.log('Offbeat harvest validation passed.');
