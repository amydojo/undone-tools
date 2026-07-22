const crypto = require('node:crypto');
const {
  compileDesignIntent,
  validateCompiledContract,
} = require('../chaos-vault/library/design-intent-contract.js');

const MAX_BODY_BYTES = 100_000;
const ALLOWED_BODY_KEYS = new Set(['tokens', 'generation', 'metadata']);

function constantTimeEqual(left, right) {
  const leftBuffer = Buffer.from(String(left));
  const rightBuffer = Buffer.from(String(right));
  if (leftBuffer.length !== rightBuffer.length) return false;
  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function sendJson(response, status, body) {
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'");
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('Referrer-Policy', 'no-referrer');
  return response.status(status).json(body);
}

function parseBody(request) {
  if (request.body === null || request.body === undefined) {
    throw new TypeError('request body is required');
  }

  const body = typeof request.body === 'string' ? JSON.parse(request.body) : request.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new TypeError('request body must be a JSON object');
  }

  const unexpectedKeys = Object.keys(body).filter((key) => !ALLOWED_BODY_KEYS.has(key));
  if (unexpectedKeys.length > 0) {
    throw new TypeError(`unexpected request keys: ${unexpectedKeys.sort().join(', ')}`);
  }

  const serialized = JSON.stringify(body);
  if (Buffer.byteLength(serialized, 'utf8') > MAX_BODY_BYTES) {
    const error = new RangeError(`request body exceeds ${MAX_BODY_BYTES} bytes`);
    error.code = 'body_too_large';
    throw error;
  }

  return body;
}

module.exports = async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return sendJson(response, 405, { ok: false, code: 'method_not_allowed' });
  }

  const secret = process.env.DESIGN_INTENT_API_SECRET;
  if (!secret) {
    return sendJson(response, 503, { ok: false, code: 'service_not_configured' });
  }

  const authorization = request.headers && request.headers.authorization;
  const expectedAuthorization = `Bearer ${secret}`;
  if (!authorization || !constantTimeEqual(authorization, expectedAuthorization)) {
    return sendJson(response, 401, { ok: false, code: 'unauthorized' });
  }

  const contentType = String((request.headers && request.headers['content-type']) || '');
  if (!contentType.toLowerCase().includes('application/json')) {
    return sendJson(response, 415, { ok: false, code: 'unsupported_media_type' });
  }

  try {
    const body = parseBody(request);
    const contract = compileDesignIntent(body);
    const validation = validateCompiledContract(contract);

    if (!validation.ok) {
      return sendJson(response, 422, {
        ok: false,
        code: 'compiled_contract_invalid',
        errors: validation.errors,
      });
    }

    return sendJson(response, 200, { ok: true, contract });
  } catch (error) {
    if (error && error.code === 'body_too_large') {
      return sendJson(response, 413, { ok: false, code: 'body_too_large' });
    }

    if (error instanceof SyntaxError || error instanceof TypeError || error instanceof RangeError) {
      return sendJson(response, 400, {
        ok: false,
        code: 'invalid_contract',
        error: error.message,
      });
    }

    return sendJson(response, 500, { ok: false, code: 'internal_error' });
  }
};
