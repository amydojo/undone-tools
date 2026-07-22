(function attachDesignIntentContract(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.DesignIntentContract = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createDesignIntentContractLibrary() {
  'use strict';

  const SCHEMA_VERSION = '1.0.0';
  const MAX_DEPTH = 12;
  const MAX_KEYS = 500;
  const FORBIDDEN_KEYS = new Set([
    '__proto__',
    'prototype',
    'constructor',
    'mcpUrl',
    'endpoint',
    'url',
    'fetch',
    'webhook',
    'callback',
    'redirect',
    'script',
    'html',
    'filename',
    'route',
    'persist',
  ]);

  function isPlainObject(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
    const prototype = Object.getPrototypeOf(value);
    return prototype === Object.prototype || prototype === null;
  }

  function assertSafeJson(value, path = '$', depth = 0, state = { keys: 0 }) {
    if (depth > MAX_DEPTH) throw new TypeError(`${path} exceeds maximum depth ${MAX_DEPTH}`);

    if (
      value === null ||
      typeof value === 'string' ||
      typeof value === 'boolean' ||
      (typeof value === 'number' && Number.isFinite(value))
    ) {
      return true;
    }

    if (Array.isArray(value)) {
      value.forEach((item, index) => assertSafeJson(item, `${path}[${index}]`, depth + 1, state));
      return true;
    }

    if (!isPlainObject(value)) throw new TypeError(`${path} must contain JSON-compatible values only`);

    for (const [key, nested] of Object.entries(value)) {
      state.keys += 1;
      if (state.keys > MAX_KEYS) throw new TypeError(`Contract exceeds maximum key count ${MAX_KEYS}`);
      if (FORBIDDEN_KEYS.has(key)) throw new TypeError(`${path}.${key} is not permitted in a design-intent contract`);
      assertSafeJson(nested, `${path}.${key}`, depth + 1, state);
    }

    return true;
  }

  function cloneJson(value) {
    assertSafeJson(value);
    return JSON.parse(JSON.stringify(value));
  }

  function detectTopLevelCollisions(tokens, generation) {
    const tokenKeys = new Set(Object.keys(tokens));
    return Object.keys(generation).filter((key) => tokenKeys.has(key)).sort();
  }

  function normalizeMetadata(metadata) {
    if (metadata === undefined) return {};
    if (!isPlainObject(metadata)) throw new TypeError('metadata must be a plain object');
    return cloneJson(metadata);
  }

  function compileDesignIntent(input) {
    if (!isPlainObject(input)) throw new TypeError('input must be a plain object');

    const tokens = input.tokens === undefined ? {} : input.tokens;
    const generation = input.generation === undefined ? {} : input.generation;

    if (!isPlainObject(tokens)) throw new TypeError('tokens must be a plain object');
    if (!isPlainObject(generation)) throw new TypeError('generation must be a plain object');

    const safeTokens = cloneJson(tokens);
    const safeGeneration = cloneJson(generation);
    const safeMetadata = normalizeMetadata(input.metadata);
    const collisions = detectTopLevelCollisions(safeTokens, safeGeneration);

    return Object.freeze({
      schemaVersion: SCHEMA_VERSION,
      intent: Object.freeze({ tokens: safeTokens }),
      request: Object.freeze({ generation: safeGeneration }),
      provenance: Object.freeze({
        sourceRepository: 'amydojo/left-brain-mcp',
        reconstruction: 'Chaos Vault clean-room contract',
        ...safeMetadata,
      }),
      diagnostics: Object.freeze({
        topLevelNameCollisions: collisions,
      }),
      policy: Object.freeze({
        network: 'none',
        rendering: 'bounded-shell-only',
        logging: 'redacted',
        output: 'data-only',
        externalActions: 'prohibited',
      }),
    });
  }

  function validateCompiledContract(contract) {
    if (!isPlainObject(contract)) return { ok: false, errors: ['contract must be a plain object'] };

    const errors = [];
    if (contract.schemaVersion !== SCHEMA_VERSION) errors.push(`schemaVersion must equal ${SCHEMA_VERSION}`);
    if (!isPlainObject(contract.intent) || !isPlainObject(contract.intent.tokens)) errors.push('intent.tokens must be a plain object');
    if (!isPlainObject(contract.request) || !isPlainObject(contract.request.generation)) errors.push('request.generation must be a plain object');
    if (!isPlainObject(contract.policy)) errors.push('policy must be a plain object');
    if (contract.policy && contract.policy.network !== 'none') errors.push('policy.network must remain none in the reference compiler');
    if (contract.policy && contract.policy.externalActions !== 'prohibited') errors.push('policy.externalActions must remain prohibited');

    try {
      assertSafeJson(contract);
    } catch (error) {
      errors.push(error.message);
    }

    return { ok: errors.length === 0, errors };
  }

  function renderJsonAsText(target, value) {
    if (!target || typeof target.textContent === 'undefined') throw new TypeError('target must expose textContent');
    target.textContent = JSON.stringify(value, null, 2);
  }

  return Object.freeze({
    SCHEMA_VERSION,
    compileDesignIntent,
    validateCompiledContract,
    detectTopLevelCollisions,
    renderJsonAsText,
  });
});
