# Chaos Vault Harvest Log

## Evidence classes

Chaos Vault distinguishes three kinds of retained material:

1. **Original product inventions** — portable concepts authored across Amy Do and Lab Dojo products, preserved with provenance.
2. **Research-linked design hypotheses** — patterns that retain evidence labels, limitations, competing explanations, and falsification requirements.
3. **Clean-room reconstructions** — behavior rebuilt from an audited contract instead of copying domain-specific source or unsafe demo wiring.

A harvested pattern is not automatically a universal effectiveness claim, clinical claim, production-readiness claim, or permission to copy branded source material.

## Harvest 01 · Affective interface patterns

**Date:** 2026-07-22  
**Original branch:** `agent/harvest-affective-patterns`

### Core departments

| Department | IDs | Primary source systems |
| --- | --- | --- |
| Affective Contracts | `CV-AFX-*` | Affective UX Lab, Fridge Web, Mirror |
| Interaction Budgets | `CV-IBG-*` | Bad Day Receipt, flame.io, Affective UX Lab |
| Artifact Compilers | `CV-ART-*` | Glint, Bad Day Receipt, Capsule, Face Value |
| Continuity Systems | `CV-CON-*` | Bad Day Receipt, Capsule, Mirror, Living Tapestry, KEYS, Face Value |
| Control Behavior | `CV-CTL-*` | Interface Behavior Lab, Bad Day Receipt, Mirror |

### Donor summary

#### Affective UX Lab

Retained state hypotheses rather than emotional facts, the adaptation ladder, load-adaptive disclosure, gentle reentry, correctable state, calibrated language, reversible simplification, and agency requirements.

#### Bad Day Receipt · Carry Forward

Retained declared load, Interaction Budget, Minimum Necessary Interface, Three Valid Endings, stable temporary modes, emotional continuity, controlled compiler boundaries, graceful AI failure, and recovery attached to action.

#### Mirror

Retained observation over optimization, pattern memory over scoring, tentative body-weather language, similar-day context, and non-punitive return.

#### Capsule

Retained object continuity, source provenance, specimen versus source separation, preservation ritual, rediscovery, and a local fallback when AI is unavailable.

#### Glint

Retained structured camera-to-analysis behavior, bounded template selection, interpretation-conditioned artifact presentation, retries, and validation. Generated dialogue presented as an authentic quote and fake calibrated confidence remain quarantined.

#### flame.io

Retained tone selection before vulnerability, bounded daily ritual, multimodal responses, and AI-to-local fallback. Relationship scores, creativity bonuses, vulnerability grading, and streak punishment remain quarantined.

#### Fridge Web / Get Fridge

Retained “Something feels off?” mid-task recovery, step-level repair, validate → repair → regenerate → fallback, lazy enrichment, and ingredient normalization.

Correction: Fridge Web was a mobile-first cooking companion, not a smart-fridge image inventory product. The source repository is `amydojo/get-fridge`; later harvests must deepen this donor rather than count it again.

#### Living Tapestry

Retained chronology, recurring-type clusters, idea → action → insight chains, and time-of-day grouping. Positional links must not be presented as semantic truth.

#### KEYS

Retained procedural accompaniment through housing discovery, risk, budgeting, paperwork, waiting, and response. The Airbnb-style nightly-rental schema was not retained as an affordable-housing model.

#### Interface Behavior Lab

Retained controls as contracts, consequence-weighted friction, state without spectacle, recovery attached to action, and the full action lifecycle.

#### Face Value

Retained delta over score, longitudinal self-comparison, comparable-condition evidence, and the skincare-fridge machine metaphor. Diagnosis, attractiveness scores, invented percentages, and uncontrolled causal claims remain prohibited.

### Core machine-readable assets

- `data/affective-patterns.json`
- `library/affective-contracts.js`

The core registry contains 27 patterns.

## Supplemental harvest · Capytopia

**Source:** `amydojo/capytopia`  
**Verified commit:** `627f68411f8e0110b53c5a72160ef3f4c83a54fc`

Capytopia was initially misclassified as empty because connector metadata reported `size: 0`. Direct commit and file inspection proved it contained a substantial React and TypeScript café-game prototype.

Retained:

- `CV-CAP-001` Sensory Assembly Ritual
- `CV-CAP-002` Avatar-Mediated Self-Expression
- `CV-CAP-003` Soft-World Task Scaffolding

See:

- `CAPYTOPIA_HARVEST.md`
- `data/capytopia-patterns.json`
- `patterns/capytopia.html`

## Harvest 02 · Design Intent Infrastructure

**Date:** 2026-07-22  
**Branch:** `agent/harvest-left-brain-mcp`  
**Source:** `amydojo/left-brain-mcp`  
**Verified ref:** `main`

### Source correction

The previous harvest log incorrectly grouped `left-brain-mcp` with empty GitHub shells.

That statement was wrong.

The repository contains a design-system-to-artifact prototype with:

- a browser interface for design tokens and generation instructions
- an Express relay to an external generation endpoint
- a detailed email-client token system
- compatibility-hardened email source templates

The source is populated and conceptually valuable. Its network relay is unsafe to reuse directly.

### Retained patterns

- `CV-DIN-001` Design Intent Serialization
- `CV-DIN-002` Human-Inspectable Generation Contract
- `CV-DIN-003` Reference-Constrained Artifact Compiler
- `CV-DIN-004` Mechanical Burden Transfer
- `CV-DIN-005` Compatibility as Care

### Clean-room reconstruction

Added:

- `LEFT_BRAIN_MCP_HARVEST.md`
- `data/design-intent-patterns.json`
- `contracts/design-intent.schema.json`
- `library/design-intent-contract.js`
- `patterns/design-intent-infrastructure.html`
- `api/compile-design-intent.js`
- `scripts/validate-left-brain.mjs`

The reconstructed compiler:

- keeps tokens and generation instructions separately namespaced
- detects top-level naming collisions
- blocks prototype-pollution and execution-control keys
- returns a deterministic data-only contract
- performs no network request, rendering, persistence, routing, publication, or model call

The Vercel reference function:

- accepts POST only
- requires `DESIGN_INTENT_API_SECRET`
- requires bearer authentication
- sets no-store and defensive response headers
- enforces a request-size ceiling
- returns meaningful HTTP status codes
- logs no request body
- performs no outbound fetch

### Not retained

- arbitrary user-supplied server-side request targets
- open proxy behavior
- broad unauthenticated CORS
- full payload logging
- shallow merging of design memory and generation instructions
- unescaped response insertion
- arbitrary generated HTML execution
- generator-controlled routing, persistence, external actions, or filenames
- branded email templates as generic reusable assets

### Vercel status

The connected Vercel account contained no projects during this harvest. No deployment was created. The branch is ready to import after review and requires `DESIGN_INTENT_API_SECRET` before the API route can be exercised.

## Harvest 03 · Affective Artifact Infrastructure

**Date:** 2026-07-23  
**Branch:** `agent/harvest-artifact-infrastructure`

### Verified sources

| Source | Verified commit | Vault relationship |
| --- | --- | --- |
| `amydojo/Catmode` | `1bb108fb29d2885004a5df188526aa3cdb956e93` | new donor |
| `amydojo/get-fridge` | `919becd1d472d9d648fb68dcfb21f1e518322bc1` | deepens existing Fridge Web donor |
| `amydojo/STICKER-OS` | `4c23eafb1922b6134316d1c2bddbb4a8817884ae` | new donor |

### Recovered architecture

The three sources independently implement a higher-order product grammar:

> situation → bounded artifact → operational mode → repair → record → re-entry

This harvest names that grammar **Affective Artifact Infrastructure**.

### Retained patterns

#### Catmode

- `CV-AFI-001` Behavioral Loop Prescription
- `CV-AFI-002` Route Before Object
- `CV-AFI-003` Subject-Decides-Outcome
- `CV-AFI-004` Medium-Translated Intervention
- `CV-AFI-005` Use-What-You-Have Trial

#### Get Fridge

- `CV-AFI-006` Appliance Mode
- `CV-AFI-007` Available-Materials Compiler
- `CV-AFI-008` Choice Surrender Control
- `CV-AFI-009` Quiet Satisficing Completion
- `CV-AFI-010` Evidence-by-Use Archive

#### StickerOS

- `CV-AFI-011` Ambient State Object
- `CV-AFI-012` Context Without Confession
- `CV-AFI-013` Cross-Surface Expressive Continuity
- `CV-AFI-014` Local Context Suggestion

### Existing records strengthened rather than duplicated

- `CV-AFX-006` Something Feels Off? Recovery Reveal
- `CV-ART-003` Bounded Machine Metaphor
- `CV-ART-005` Format Carries Meaning

### Added assets

- `ARTIFACT_INFRASTRUCTURE_HARVEST.md`
- `data/artifact-infrastructure-patterns.json`
- `patterns/artifact-infrastructure.html`
- `scripts/validate-artifact-infrastructure.mjs`

### Not retained

- personal room or animal details as reusable generic sample data
- veterinary, behavioral, causal, clinical, or therapeutic certainty
- unsafe cooking substitutions, allergy assumptions, or unverified food-safety guidance
- daily-use paywalls that exploit basic care needs
- automatic status, availability, energy, battery, location, or activity sharing
- full-access keyboard permissions as a hidden prerequisite
- emotion, personality, diagnosis, or relationship inference from selected expressive objects
- prototype implementation represented as proof of general effectiveness

### Vercel status

The connected Vercel team reported no projects during this harvest. No preview or production deployment was created, and the repository must not claim otherwise.

## Replit-origin repository audit rule

For repositories created from Replit:

1. Do not trust repository size, branch enumeration, a launch stub, or one commit summary alone.
2. Search commit history.
3. Inspect the current active ref and expected product paths.
4. Fetch representative source and assets directly.
5. Separate surviving product invention from current build health.
6. Record uncertainty instead of converting missing metadata into an empty-repository claim.

## Global import bans

Do not import or rehabilitate:

- fake skin, mood, relationship, creativity, talent, or emotional-severity scores
- diagnosis from face, voice, cursor, biometrics, avatar choices, stickers, or interaction telemetry
- generated quotes presented as authentic quotations
- permanent psychological profiles
- vulnerability scoring or streak punishment
- fictional hardware, integrations, payments, or production claims
- scraping bypasses
- automatic consequential adaptation or external actions
- automatic status, availability, energy, battery, location, or activity sharing
- arbitrary model-generated markup, routing, persistence, or filenames
- arbitrary server-side URL fetching or open proxy behavior
- hidden network calls or full sensitive payload logging
- branded source templates without provenance and permission
- prototype implementation presented as proof of general effectiveness

## Current mainline inventory represented by this branch

- 23 technical parts
- 27 core affective patterns
- 3 Capytopia patterns
- 5 Design Intent Infrastructure patterns
- 14 Affective Artifact Infrastructure patterns
- 49 documented patterns across 16 donor systems
