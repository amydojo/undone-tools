# Undone Tools

A static site for Undone Studio, the Undone Standards product library, and the isolated Chaos Vault parts department.

## Run locally or on Replit

```bash
npx http-server . -p 5000 -c-1
```

Primary routes:

- `/` — Undone Studio
- `/standards/` — customer-facing product library
- `/vault/` — canonical Chaos Vault front door
- `/chaos-vault/` — legacy route that redirects to `/vault/`
- `/chaos-vault/patterns/` — detailed affective and systems pattern library
- `/chaos-vault/patterns/design-intent-infrastructure.html` — Left Brain MCP clean-room harvest
- `/chaos-vault/patterns/artifact-infrastructure.html` — Catmode, Get Fridge, and StickerOS clean-room harvest

The short `/vault/` route is the intended public entry. It uses progressive disclosure, local search, three primary routes, and an editorial archive visual system. Detailed records and working demonstrations remain under `/chaos-vault/` so existing deep links do not break.

## System isolation

- Studio uses the `.studio-*` namespace.
- Standards uses the `.std-*` namespace.
- The detailed archive uses the `.cv-*` namespace.
- The short front door uses the `.vault-*` namespace.
- Commerce behavior never runs inside either Vault surface.
- Chaos Vault reference helpers perform no emotion diagnosis, external actions, generated-markup execution, or hidden network requests.

Do not mix these namespaces.

## Chaos Vault

Chaos Vault has technical departments and seven pattern families.

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
- **Affective Artifact Infrastructure** — behavioral prescriptions, route-before-object intervention, appliance modes, quiet completion, sendable ambient state, and local context suggestions

The current branch represents 27 core affective patterns, three Capytopia patterns, five design-infrastructure patterns, and fourteen artifact-infrastructure patterns: **49 documented patterns across 16 donor systems**.

Canonical supporting files:

```text
vault/index.html
vault/vault.css
vault/vault.js
chaos-vault/data/affective-patterns.json
chaos-vault/data/capytopia-patterns.json
chaos-vault/data/design-intent-patterns.json
chaos-vault/data/artifact-infrastructure-patterns.json
chaos-vault/library/affective-contracts.js
chaos-vault/library/design-intent-contract.js
chaos-vault/contracts/design-intent.schema.json
chaos-vault/LEFT_BRAIN_MCP_HARVEST.md
chaos-vault/ARTIFACT_INFRASTRUCTURE_HARVEST.md
chaos-vault/HARVEST_LOG.md
```

The registries distinguish original product inventions, research-linked hypotheses, clean-room reconstructions, and quarantined specimens. A pattern record is not automatically an effectiveness claim. An implemented prototype illustrates a pattern; it does not validate general effectiveness.

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

## Chaos Vault import bans

Do not import or rehabilitate:

- fake skin, mood, relationship, creativity, talent, or emotional-severity scores
- diagnosis from face, voice, cursor, biometrics, avatar choices, stickers, or interaction telemetry
- generated quotes presented as authentic quotations
- permanent psychological profiles
- vulnerability scoring or streak punishment
- fictional hardware or integration claims
- fake payment gates
- scraping bypasses
- automatic consequential adaptation or external actions
- automatic sharing of status, availability, energy, battery, location, or activity data
- arbitrary model-generated markup, routing, persistence, or filenames
- arbitrary server-side URL fetching or open proxy behavior
- hidden network calls or full sensitive payload logging
- shallow merging of design memory and generation instructions
- branded source templates presented as generic reusable assets
- prototype implementation presented as proof of general effectiveness

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

The validation suite checks customer routes, purchase fallbacks, script order, query-parameter preservation, Commerce versus Chaos Vault isolation, pattern integrity, source-correction records, the dependency-free design-intent compiler, the authenticated Vercel function boundary, the `/vault/` front-door contract, and the Affective Artifact Infrastructure registry and page.
