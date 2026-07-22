import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

const requiredFiles = [
  'chaos-vault/LEFT_BRAIN_MCP_HARVEST.md',
  'chaos-vault/data/design-intent-patterns.json',
  'chaos-vault/contracts/design-intent.schema.json',
  'chaos-vault/library/design-intent-contract.js',
  'chaos-vault/patterns/design-intent-infrastructure.html',
  'api/compile-design-intent.js',
];

requiredFiles.forEach((relativePath) => {
  assert.ok(fs.existsSync(path.join(root, relativePath)), `Missing ${relativePath}`);
});

const registry = JSON.parse(read('chaos-vault/data/design-intent-patterns.json'));
assert.equal(registry.schemaVersion, '1.0.0');
assert.equal(registry.source.repository, 'amydojo/left-brain-mcp');
assert.equal(registry.patterns.length, 5);

const ids = registry.patterns.map((pattern) => pattern.id);
assert.equal(new Set(ids).size, ids.length, 'Design intent pattern IDs must be unique');
registry.patterns.forEach((pattern) => {
  assert.match(pattern.id, /^CV-DIN-\d{3}$/);
  assert.ok(pattern.name && pattern.category && pattern.status && pattern.kind && pattern.thesis, `${pattern.id} is incomplete`);
  assert.ok(Array.isArray(pattern.observedImplementation) && pattern.observedImplementation.length > 0, `${pattern.id} needs implementation evidence`);
  assert.ok(Array.isArray(pattern.requiredControls) && pattern.requiredControls.length > 0, `${pattern.id} needs controls`);
  assert.ok(Array.isArray(pattern.risks) && pattern.risks.length > 0, `${pattern.id} needs risk notes`);
});

for (const requiredBan of [
  'arbitrary server-side URL fetching',
  'full design or customer payload logging',
  'shallow merging of design intent and generation instructions',
  'arbitrary generated HTML execution',
]) {
  assert.ok(registry.quarantine.includes(requiredBan), `Missing design intent quarantine rule: ${requiredBan}`);
}

const schema = JSON.parse(read('chaos-vault/contracts/design-intent.schema.json'));
assert.equal(schema.type, 'object');
assert.deepEqual(schema.required, ['tokens', 'generation']);
assert.equal(schema.additionalProperties, false);

const contractLibrary = require(path.join(root, 'chaos-vault/library/design-intent-contract.js'));
const compiled = contractLibrary.compileDesignIntent({
  tokens: { color: { surface: '#fff' }, shared: 'token' },
  generation: { templateId: 'evidence-card-v1', shared: 'request' },
  metadata: { sourceVersion: 'test' },
});

assert.equal(compiled.schemaVersion, '1.0.0');
assert.equal(compiled.intent.tokens.color.surface, '#fff');
assert.equal(compiled.request.generation.templateId, 'evidence-card-v1');
assert.deepEqual(compiled.diagnostics.topLevelNameCollisions, ['shared']);
assert.equal(compiled.policy.network, 'none');
assert.equal(compiled.policy.externalActions, 'prohibited');
assert.equal(contractLibrary.validateCompiledContract(compiled).ok, true);
assert.throws(
  () => contractLibrary.compileDesignIntent({ tokens: {}, generation: { endpoint: 'https://example.com' } }),
  /not permitted/,
);
assert.throws(
  () => contractLibrary.compileDesignIntent({ tokens: JSON.parse('{"__proto__":{"polluted":true}}'), generation: {} }),
  /not permitted/,
);

const page = read('chaos-vault/patterns/design-intent-infrastructure.html');
assert.match(page, /Design Intent Serialization/);
assert.match(page, /Human-Inspectable Generation Contract/);
assert.match(page, /Reference-Constrained Artifact Compiler/);
assert.match(page, /Mechanical Burden Transfer/);
assert.match(page, /Compatibility as Care/);
assert.match(page, /No Arbitrary Fetch/);
assert.match(page, /Compiled locally\. No request was made\./);
assert.doesNotMatch(page, /data-buy|UndoneCommerce|etsy/i, 'Design intent page must remain isolated from commerce');

const harvest = read('chaos-vault/LEFT_BRAIN_MCP_HARVEST.md');
assert.match(harvest, /arbitrary server-side request target/i);
assert.match(harvest, /never shallow-merged/i);
assert.match(harvest, /DESIGN_INTENT_API_SECRET/);
assert.match(harvest, /no projects at harvest time/i);

const handler = require(path.join(root, 'api/compile-design-intent.js'));
function createResponse() {
  return {
    headers: {},
    statusCode: 200,
    body: null,
    setHeader(name, value) { this.headers[name.toLowerCase()] = value; },
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

const previousSecret = process.env.DESIGN_INTENT_API_SECRET;
process.env.DESIGN_INTENT_API_SECRET = 'test-secret';

let response = createResponse();
await handler({ method: 'GET', headers: {}, body: null }, response);
assert.equal(response.statusCode, 405);
assert.equal(response.body.code, 'method_not_allowed');

response = createResponse();
await handler({ method: 'POST', headers: { 'content-type': 'application/json' }, body: { tokens: {}, generation: {} } }, response);
assert.equal(response.statusCode, 401);

response = createResponse();
await handler({
  method: 'POST',
  headers: { authorization: 'Bearer test-secret', 'content-type': 'application/json' },
  body: { tokens: { color: { text: '#111' } }, generation: { templateId: 'card-v1' } },
}, response);
assert.equal(response.statusCode, 200);
assert.equal(response.body.ok, true);
assert.equal(response.body.contract.policy.network, 'none');
assert.equal(response.headers['cache-control'], 'no-store');

response = createResponse();
await handler({
  method: 'POST',
  headers: { authorization: 'Bearer test-secret', 'content-type': 'application/json' },
  body: { tokens: {}, generation: { mcpUrl: 'https://example.com' } },
}, response);
assert.equal(response.statusCode, 400);
assert.equal(response.body.code, 'invalid_contract');

if (previousSecret === undefined) delete process.env.DESIGN_INTENT_API_SECRET;
else process.env.DESIGN_INTENT_API_SECRET = previousSecret;

const patternIndex = read('chaos-vault/patterns/index.html');
assert.match(patternIndex, /Design Intent Infrastructure/);
assert.match(patternIndex, /5 Design Infrastructure Patterns/);
assert.match(patternIndex, /14 Donor Systems/);

const vaultIndex = read('chaos-vault/index.html');
assert.match(vaultIndex, /35 Documented Patterns/);
assert.match(vaultIndex, /Design Intent Infrastructure/);
assert.match(vaultIndex, /Left Brain MCP/);

console.log('Left Brain MCP harvest validation passed.');
