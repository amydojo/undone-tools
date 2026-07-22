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
- `/chaos-vault/patterns/` — affective and systems pattern library
- `/chaos-vault/patterns/design-intent-infrastructure.html` — Left Brain MCP clean-room harvest

## System isolation

- Studio uses the `.studio-*` namespace.
- Standards uses the `.std-*` namespace.
- Chaos Vault uses the `.cv-*` namespace.
- Commerce behavior never runs inside Chaos Vault.
- Chaos Vault reference helpers perform no emotion diagnosis, external actions, generated-markup execution, or hidden network requests.

Do not mix these namespaces.

## Chaos Vault

Chaos Vault has technical departments and six pattern families.

### Technical departments

- camera
- vision analysis
- recovery patterns
- AI validation
- motion primitives
- graph visualization
- real-time events
- notification engine

### Pattern families

- **Affective Contracts** — load-adaptive disclosure, gentle reentry, correctable state, calibrated language, reversible simplification, mid-task recovery
- **Interaction Budgets** — declared load, Minimum Necessary Interface, tone as consent, Three Valid Endings, stable temporary modes
- **Artifact Compilers** — interpretation-conditioned design, bounded machine metaphors, emotional artifacts, provenance-preserving generation
- **Continuity and Control** — emotional and object continuity, pattern memory, procedural accompaniment, delta over score, controls as contracts
- **Capytopia Play Systems** — sensory assembly, avatar-mediated expression, and soft-world task scaffolding
- **Design Intent Infrastructure** — structured design memory, inspectable generation contracts, compatibility shells, mechanical burden transfer, and compatibility as care

The current mainline harvest contains 27 core affective patterns, three Capytopia patterns, and five design-infrastructure patterns.

Canonical supporting files:

```text
chaos-vault/data/affective-patterns.json
chaos-vault/data/capytopia-patterns.json
chaos-vault/data/design-intent-patterns.json
chaos-vault/library/affective-contracts.js
chaos-vault/library/design-intent-contract.js
chaos-vault/contracts/design-intent.schema.json
chaos-vault/LEFT_BRAIN_MCP_HARVEST.md
chaos-vault/HARVEST_LOG.md
```

The registries distinguish original product inventions, research-linked hypotheses, clean-room reconstructions, and quarantined specimens. A pattern record is not automatically an effectiveness claim.

## Design intent API boundary

`api/compile-design-intent.js` is a Vercel-ready reference function.

It accepts a namespaced design-intent contract and returns validated data. It does not call a model, render HTML, write files, route requests, publish artifacts, or fetch an arbitrary endpoint.

Configure this environment variable before testing the route:

```text
DESIGN_INTENT_API_SECRET=<strong random secret>
```

Call the function with:

```text
Authorization: Bearer <secret>
Content-Type: application/json
```

A missing secret fails closed with `503 service_not_configured`.

The connected Vercel account contained no projects at harvest time, so no preview or production deployment was created. Import the GitHub branch into Vercel only after review.

## Chaos Vault import bans

Do not import or rehabilitate:

- fake skin, mood, relationship, creativity, talent, or emotional-severity scores
- diagnosis from face, voice, cursor, biometrics, avatar choices, or interaction telemetry
- generated quotes presented as authentic quotations
- permanent psychological profiles
- vulnerability scoring or streak punishment
- fictional hardware or integration claims
- fake payment gates
- scraping bypasses
- automatic consequential adaptation or external actions
- arbitrary model-generated markup, routing, persistence, or filenames
- arbitrary server-side URL fetching or open proxy behavior
- hidden network calls or full sensitive payload logging
- shallow merging of design memory and generation instructions
- branded source templates presented as generic reusable assets

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
npm test
```

The validation suite checks customer routes, purchase fallbacks, script order, query-parameter preservation, Commerce versus Chaos Vault isolation, pattern integrity, source-correction records, the dependency-free design-intent compiler, and the authenticated Vercel function boundary.
