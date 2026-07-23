import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

const requiredFiles = [
  'chaos-vault/ARTIFACT_INFRASTRUCTURE_HARVEST.md',
  'chaos-vault/data/artifact-infrastructure-patterns.json',
  'chaos-vault/patterns/artifact-infrastructure.html',
];

for (const relativePath of requiredFiles) {
  assert.ok(fs.existsSync(path.join(root, relativePath)), `Missing ${relativePath}`);
}

const registry = JSON.parse(read('chaos-vault/data/artifact-infrastructure-patterns.json'));
assert.equal(registry.schemaVersion, '1.0.0');
assert.equal(registry.collection, 'Affective Artifact Infrastructure');
assert.match(registry.evidenceRelationship, /illustrate.*do not validate/i);
assert.equal(registry.sources.length, 3);
assert.deepEqual(
  registry.sources.map((source) => source.repository),
  ['amydojo/Catmode', 'amydojo/get-fridge', 'amydojo/STICKER-OS'],
);
registry.sources.forEach((source) => assert.match(source.verifiedCommit, /^[a-f0-9]{40}$/));

assert.equal(registry.patterns.length, 14);
const ids = registry.patterns.map((pattern) => pattern.id);
assert.equal(new Set(ids).size, ids.length, 'Artifact infrastructure IDs must be unique');

registry.patterns.forEach((pattern) => {
  assert.match(pattern.id, /^CV-AFI-\d{3}$/);
  assert.ok(pattern.name && pattern.donor && pattern.category && pattern.status && pattern.evidence && pattern.kind && pattern.thesis, `${pattern.id} is incomplete`);
  assert.ok(Array.isArray(pattern.observedImplementation) && pattern.observedImplementation.length > 0, `${pattern.id} needs implementation evidence`);
  assert.ok(Array.isArray(pattern.requiredControls) && pattern.requiredControls.length > 0, `${pattern.id} needs controls`);
  assert.ok(Array.isArray(pattern.risks) && pattern.risks.length > 0, `${pattern.id} needs risks`);
});

const expectedNames = [
  'Behavioral Loop Prescription',
  'Route Before Object',
  'Subject-Decides-Outcome',
  'Medium-Translated Intervention',
  'Use-What-You-Have Trial',
  'Appliance Mode',
  'Available-Materials Compiler',
  'Choice Surrender Control',
  'Quiet Satisficing Completion',
  'Evidence-by-Use Archive',
  'Ambient State Object',
  'Context Without Confession',
  'Cross-Surface Expressive Continuity',
  'Local Context Suggestion',
];
assert.deepEqual(registry.patterns.map((pattern) => pattern.name), expectedNames);

assert.equal(registry.strengthenedExistingPatterns.length, 3);
for (const existing of ['Something Feels Off? Recovery Reveal', 'Bounded Machine Metaphor', 'Format Carries Meaning']) {
  assert.ok(registry.strengthenedExistingPatterns.some((item) => item.name === existing), `Missing strengthened record ${existing}`);
}

for (const requiredBan of [
  'automatic sending of status, availability, energy, battery, location, or activity data',
  'inferring mood, personality, diagnosis, or relationship intent from a selected sticker',
  'presenting a prototype as evidence that a pattern is generally effective',
]) {
  assert.ok(registry.quarantine.includes(requiredBan), `Missing quarantine rule: ${requiredBan}`);
}

const page = read('chaos-vault/patterns/artifact-infrastructure.html');
assert.match(page, /Affective Artifact Infrastructure/);
assert.match(page, /Situation → artifact → operating mode → repair → record/);
assert.match(page, /Illustrates, Does Not Validate/);
assert.equal((page.match(/data-pattern-id="CV-AFI-/g) || []).length, 14);
assert.doesNotMatch(page, /data-buy|UndoneCommerce|etsy/i, 'Harvest page must remain isolated from commerce');
assert.doesNotMatch(page, /fonts\.googleapis|unpkg|jsdelivr|cdnjs/i, 'Harvest page must stay self-contained');

const harvest = read('chaos-vault/ARTIFACT_INFRASTRUCTURE_HARVEST.md');
assert.match(harvest, /No donor code is imported/);
assert.match(harvest, /illustrates, does not validate/i);
assert.match(harvest, /Get Fridge deepens the existing Fridge Web donor/);
assert.match(harvest, /49 documented patterns across 16 donor systems/);

const patternIndex = read('chaos-vault/patterns/index.html');
assert.match(patternIndex, /Affective Artifact Infrastructure/);
assert.match(patternIndex, /14 Artifact Infrastructure Patterns/);
assert.match(patternIndex, /16 Donor Systems/);
assert.match(patternIndex, /Get Fridge \/ Fridge Web/);

const vault = read('vault/index.html');
assert.match(vault, /49<\/strong><span>documented patterns/);
assert.match(vault, /16<\/strong><span>donor systems/);
assert.match(vault, /CV·AFI/);
assert.match(vault, /artifact-infrastructure-patterns\.json/);

const legacy = read('chaos-vault/index.html');
assert.match(legacy, /49 Documented Patterns/);
assert.match(legacy, /Affective Artifact Infrastructure/);

console.log('Artifact infrastructure harvest validation passed.');
