# Left Brain MCP Harvest

**Date:** 2026-07-22  
**Source:** `amydojo/left-brain-mcp`  
**Verified ref:** `main`  
**Harvest type:** surgical clean-room reconstruction

## What the source actually was

Despite the repository name, Left Brain MCP was not an executive-function assistant. It was an early design-system-to-artifact pipe.

The source combined:

- a browser form for design-token JSON and generation instructions
- an Express relay that merged those objects and posted them to a user-supplied endpoint
- a detailed email-client token system
- compatibility-hardened HTML email templates used as generator source material

The original product instinct was strong:

> Preserve design intent as structured machine memory, then let a bounded generator absorb mechanical production work.

The implementation boundary was not safe enough to reuse directly.

## Verified source evidence

### Structured design memory

`email-client-tokens.json` serializes:

- primitive and semantic color roles
- email-specific states
- typography and spacing
- radii, borders, shadows, and z-index
- dimensions for email lists, sidebars, toolbars, search, compose, cards, badges, and dropdowns
- motion duration and easing
- responsive breakpoints

This is more than a palette. It is a portable representation of visual and behavioral intent.

### Inspectable generation request

The browser UI kept two inputs visible:

1. design tokens
2. generation configuration

The server then combined them and sent the resulting payload to an external endpoint.

The useful contract is that the generation request remains inspectable and versionable before execution.

### Compatibility-hardened shell

The stored email source includes defensive behavior for Outlook, Microsoft Office, Gmail, Apple data detectors, responsive mobile layouts, font fallbacks, and table-based email rendering.

The portable lesson is not to reuse the branded template. It is to separate a tested compatibility shell from variable generated content.

## Source problems that are not imported

### Arbitrary server-side request target

The original server accepted a user-supplied `mcpUrl` and fetched it from the server. That creates server-side request forgery and open-proxy risk.

### Global CORS and no authentication

The relay exposed broad cross-origin access and did not require a trusted caller.

### Shallow payload merge

`{ ...tokens, ...generate }` silently allows top-level collisions and erases the distinction between design memory and generation intent.

### Sensitive logging

The complete merged payload was written to application logs.

### Weak response semantics

The relay did not require a successful upstream status, did not enforce a response contract, and returned application failures with HTTP 200.

### Unsafe browser rendering

The client inserted endpoint responses and errors with `innerHTML`.

### Template provenance

The Huel templates are evidence of compatibility engineering, not generic reusable templates. Branded copy, assets, and exact layouts remain quarantined.

## Reconstructed system

The Chaos Vault reconstruction keeps the useful architecture while removing the dangerous relay behavior.

### Namespaced contract

Design tokens and generation instructions remain separate:

```json
{
  "schemaVersion": "1.0.0",
  "intent": { "tokens": {} },
  "request": { "generation": {} },
  "provenance": {},
  "policy": {}
}
```

They are never shallow-merged.

### Data-only compiler

The reference helper validates JSON-compatible values, blocks prototype-pollution keys, detects top-level naming collisions, and returns a deterministic contract.

It performs:

- no network requests
- no HTML rendering
- no file writes
- no routing
- no external actions
- no model calls

### Bounded Vercel function

`api/compile-design-intent.js` is a deploy-ready reference endpoint for Vercel Functions.

It:

- accepts POST only
- requires `DESIGN_INTENT_API_SECRET`
- requires bearer authentication
- sets no-store and defensive response headers
- enforces a serialized request-size ceiling
- rejects arbitrary endpoint, URL, script, HTML, redirect, callback, webhook, fetch, and filename control keys
- returns meaningful HTTP status codes
- logs no request body
- performs no outbound fetch

The function compiles and validates a contract. It does not execute the artifact generator.

## Harvested patterns

### CV-DIN-001 · Design Intent Serialization

Encode visual, semantic, component, motion, responsive, and compatibility decisions as portable structured data.

### CV-DIN-002 · Human-Inspectable Generation Contract

Keep the exact generation request visible, editable, reviewable, and versionable before execution.

### CV-DIN-003 · Reference-Constrained Artifact Compiler

Generate variable content inside an approved structural shell rather than regenerating hostile-runtime infrastructure from scratch.

### CV-DIN-004 · Mechanical Burden Transfer

Move repetitive compatibility work to the system while leaving meaning, taste, authorship, and final approval with the person.

### CV-DIN-005 · Compatibility as Care

Treat reliable rendering in the recipient’s actual environment as part of the intended experience rather than post-production polish.

## Affective-interface relevance

This donor contributes the systems-engineering half of affective interface engineering:

> Humane software should not repeatedly make people carry implementation complexity that the system can safely hold for them.

The machine should absorb tedious mechanical burden without taking authorship, concealing its actions, or quietly expanding its authority.

## Import boundary

Do not import or recreate:

- arbitrary server-side URL fetching
- open proxy behavior
- full payload logging
- broad unauthenticated CORS
- shallow merging of intent and instructions
- unescaped response insertion
- arbitrary generated HTML execution
- generator-controlled routing, persistence, external actions, or filenames
- branded template content as a generic library asset
- hidden network calls

## Deployment status

The connected Vercel account had no projects at harvest time. No production or preview deployment was created.

The branch is Vercel-ready but should be imported only after review. Configure `DESIGN_INTENT_API_SECRET` before exercising the API route. A missing secret intentionally produces a service-not-configured response rather than opening the endpoint anonymously.
