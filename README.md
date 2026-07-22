# Undone Tools

A static site for Undone Studio, the Undone Standards product library, and the isolated Chaos Vault parts department.

## Run locally or on Replit

```bash
npx http-server . -p 5000 -c-1
```

Primary routes:

- `/` — Undone Studio
- `/standards/` — customer-facing product library
- `/chaos-vault/` — reusable technical parts inventory
- `/chaos-vault/patterns/` — affective interface pattern library

## System isolation

- Studio uses the `.studio-*` namespace.
- Standards uses the `.std-*` namespace.
- Chaos Vault uses the `.cv-*` namespace.
- Commerce behavior never runs inside Chaos Vault.
- Chaos Vault reference helpers perform no network requests, emotion diagnosis, external actions, or generated-markup rendering.

Do not mix these namespaces.

## Chaos Vault

Chaos Vault has two layers.

### Technical departments

- camera
- vision analysis
- recovery patterns
- AI validation
- motion primitives
- graph visualization
- real-time events
- notification engine

### Affective pattern libraries

- **Affective Contracts** — load-adaptive disclosure, gentle reentry, correctable state, calibrated language, reversible simplification, mid-task recovery
- **Interaction Budgets** — declared load, Minimum Necessary Interface, tone as consent, Three Valid Endings, stable temporary modes
- **Artifact Compilers** — interpretation-conditioned design, bounded machine metaphors, emotional artifacts, provenance-preserving generation
- **Continuity and Control** — emotional and object continuity, pattern memory, procedural accompaniment, delta over score, controls as contracts

Canonical supporting files:

```text
chaos-vault/data/affective-patterns.json
chaos-vault/library/affective-contracts.js
chaos-vault/HARVEST_LOG.md
.agents/memory/chaos-vault-architecture.md
```

The pattern registry distinguishes original product inventions, research-linked hypotheses, clean-room reconstructions, and quarantined specimens. A pattern record is not automatically an effectiveness claim.

## Chaos Vault import bans

Do not import or rehabilitate:

- fake skin, mood, relationship, or emotional-severity scores
- diagnosis from face, voice, cursor, biometrics, or interaction telemetry
- generated quotes presented as authentic quotations
- permanent psychological profiles
- vulnerability scoring or streak punishment
- fictional hardware or integration claims
- fake payment gates
- scraping bypasses
- automatic consequential adaptation or external actions
- arbitrary model-generated markup, routing, persistence, or filenames

## Etsy product configuration

All product destinations live in:

```text
assets/products.js
```

The active products use the Undone by Design Etsy shop as a working fallback when an exact listing URL is not stored in the repository. Replace each `checkoutUrl` with its exact Etsy Share & Save listing URL. Existing query parameters are preserved. Inbound UTM values are carried forward only when the destination does not already define that field.

## Commerce behavior

`assets/app.js` provides:

- checkout link hydration with a functional HTML fallback
- safe external-link attributes
- the `G` checkout shortcut on active product pages
- protection against firing the shortcut while typing
- session-scoped campaign attribution
- mobile sticky checkout visibility
- accordion and preview behavior

## Analytics adapter

`assets/analytics.js` emits local `undone:analytics` browser events and supports registered subscribers. It sends no network requests by default and does not claim that a provider is connected.

Tracked events:

- `product_page_viewed`
- `preview_activated`
- `primary_etsy_cta_clicked`
- `sticky_etsy_cta_clicked`
- `related_product_clicked`

To connect a provider later, register one subscriber at application startup:

```js
window.UndoneAnalytics.register((event) => {
  // Forward the event to an approved analytics provider.
});
```

Do not forward sensitive or free-form medical information.

## Product routes

Active:

- `/standards/microneedling-pre-care.html`
- `/standards/summer-skin-safety.html`

Concept archive:

- `/standards/injectables-aftercare.html`
- `/standards/laser-aftercare.html`

## Validation

Run:

```bash
node --check assets/products.js
node --check assets/analytics.js
node --check assets/app.js
node --check chaos-vault/library/affective-contracts.js
node scripts/validate.mjs
```

Validation covers storefront routes and commerce behavior plus Chaos Vault route existence, namespace isolation, pattern-registry uniqueness and provenance, quarantine rules, reference-helper exports, and selected affective invariants.

See `PRODUCT_CONTENT_NEEDED.md` for owner-supplied listing links, product facts, and authentic preview assets still needed.
