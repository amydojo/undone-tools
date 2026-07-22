# Chaos Vault Harvest Log

## Harvest 01 · Affective interface patterns

**Date:** 2026-07-22  
**Branch:** `agent/harvest-affective-patterns`

This harvest expands Chaos Vault from eight technical departments into a second layer for reusable affective product and interaction contracts.

The work is intentionally split into three evidence types:

1. **Original product inventions** — concepts authored across Amy Do / Lab Dojo products and preserved with their product provenance.
2. **Research-linked design hypotheses** — patterns from Affective UX Lab that retain their evidence labels, limitations, and falsification requirements.
3. **Clean-room reconstructions** — portable behavior rebuilt from audited product contracts instead of copying domain-specific source wholesale.

Nothing in this library should be presented as a validated clinical, diagnostic, or universal psychological standard.

## Core pattern departments

| Department | IDs | Primary source systems |
| --- | --- | --- |
| Affective Contracts | `CV-AFX-*` | Affective UX Lab, Fridge Web, Mirror |
| Interaction Budgets | `CV-IBG-*` | Bad Day Receipt, flame.io, Affective UX Lab |
| Artifact Compilers | `CV-ART-*` | Glint, Bad Day Receipt, Capsule, Face Value |
| Continuity Systems | `CV-CON-*` | Bad Day Receipt, Capsule, Mirror, Living Tapestry, KEYS, Face Value |
| Control Behavior | `CV-CTL-*` | Interface Behavior Lab, Bad Day Receipt, Mirror |

## Donor audit

### Affective UX Lab

Harvested:

- state hypotheses rather than emotional facts
- adaptation ladder
- load-adaptive disclosure
- gentle reentry
- user-correctable state
- calibrated language
- reversible simplification
- agency, expiration, and falsification requirements

Not imported:

- no source is treated as proof that a pattern is universally effective
- no evidence label is converted into a marketing quality score

### Bad Day Receipt · Carry Forward

Harvested:

- declared load, not detected emotion
- Interaction Budget
- Minimum Necessary Interface
- Three Valid Endings
- stable temporary mode
- emotional continuity envelope
- model-proposes / application-controls compiler boundary
- AI failure must not become product failure
- recovery attached to the originating action

Not imported:

- product-specific receipt paper copy and visual skins are not generalized into interface requirements
- no automatic send, submit, purchase, delete, or account action

### Mirror

Harvested:

- observation over optimization
- pattern memory over daily scoring
- no streaks and no penalties
- tentative state language
- similar-day context and what helped afterward
- relational context over isolated metrics

Not imported:

- no body-weather state is treated as diagnosis
- no deterministic rule output is treated as a private emotional fact

### Capsule

Harvested:

- Object Continuity System
- source capture as provenance
- manual Object Field lock
- specimen versus source separation
- archive and rediscovery ritual
- premium local fallback when AI is unavailable

Not imported:

- generated metadata is not treated as observed fact
- continuity scoring remains experimental and must not become an objective worth score

### Glint / boiler-room

Harvested:

- camera and upload to vision-analysis pipeline
- separate structured recognition and atmosphere outputs
- bounded design-template selection
- interpretation-conditioned artifact presentation
- retry and validation behavior

Quarantined:

- generated dialogue presented as an authentic quote
- model-generated confidence presented as calibrated probability
- simplistic emotion-to-color mappings presented as universal
- unimplemented share and download URLs presented as production behavior

### flame.io

Harvested:

- tone selection before prompt delivery
- daily bounded relationship ritual
- multimodal response contract
- AI generation fallback to local prompts
- database fallback to local state

Quarantined:

- relationship quality points
- creativity and sentiment bonuses for vulnerable responses
- streak punishment
- AI grading of intimacy

### Fridge Web

Harvested:

- “Something feels off?” mid-cook recovery reveal
- step-level repair guidance
- validate → repair → regenerate → guaranteed fallback
- lazy secondary enrichment
- ingredient normalization and matching patterns in the technical inventory

Correction to earlier vault copy:

Fridge Web was a mobile-first cooking companion that generated meal ideas from available ingredients. It was not a smart-fridge photo inventory product. The original recovery pattern concerned cooking going wrong during guided steps, not disclosing low model confidence.

Quarantined:

- fake Pro upgrade state
- duplicated enrichment requests
- silent extra AI calls caused by mismatched hook validation

### Living Tapestry

Harvested:

- chronological spine
- recurring-type clusters
- idea → action → insight chains
- time-of-day bucketing

Quarantined:

- positional links between unrelated entries presented as semantic growth
- fictional Apple Watch support
- hollow offline sync

### KEYS

Harvested:

- procedural accompaniment through housing discovery, risk, budgeting, paperwork, waiting, and response
- scam-awareness and application-support service journey

Quarantined:

- Airbnb nightly-rental schema as an affordable-housing data model
- placeholder reviews and unsupported marketplace claims
- AI coach promises without verified service boundaries

### Interface Behavior Lab

Harvested:

- a control is a contract
- friction matches consequence
- state without spectacle
- recovery attached to action
- action lifecycle: approach → clarify → weigh → commit → resolve → recover
- accessible alternatives for novel input behavior

Not imported:

- elapsed hold is not physical pressure
- pointer proximity is not gaze
- novelty alone is not a use case

### Face Value

Harvested as product thesis only:

- delta over score
- longitudinal self-comparison rather than universal skin grading
- skincare-fridge machine metaphor
- evidence held under comparable conditions

Quarantined:

- medical diagnosis
- attractiveness or skin-quality scores
- invented percentages
- claims that vision can establish product causality from uncontrolled photos

### Capytopia

Source correction:

Capytopia was initially misclassified as empty because repository metadata reported `size: 0`. Direct commit-history inspection exposed a substantial Replit-generated React and TypeScript café-game prototype.

Harvested:

- `CV-CAP-001` Sensory Assembly Ritual
- `CV-CAP-002` Avatar-Mediated Self-Expression
- `CV-CAP-003` Soft-World Task Scaffolding

Quarantined:

- capybara happiness presented as psychological measurement
- avatar choices interpreted as detected emotion
- punishment economies for absence or vulnerability
- unfinished café zones described as working production features

### Offbeat

Source correction:

Offbeat was initially misclassified as a launch stub because commit search exposed only one initial commit with an empty `index.js`. Direct reads against the current `main` ref exposed the actual Vite and React alpha.

Verified surviving implementation:

- Tone.js loop playback and recording
- React DnD Vibe Tiles and Vibe Board
- Drums, Bass, and Melody sound roles
- three bundled audio loops
- browser download of the recorded mix

Harvested:

- `CV-OFF-001` Sound-as-Object Tile
- `CV-OFF-002` No-Wrong-Notes Constraint Field
- `CV-OFF-003` Immediate Auditory Consequence
- `CV-OFF-004` Play-to-Artifact Capture

Current build boundaries:

- malformed entry module and HTML module path
- empty Vite, Tailwind, PostCSS, and index-style files
- layered immediate loop playback rather than a true sequenced timeline
- missing remove, reorder, mute, solo, volume, transport, clear, and surfaced stop controls
- incomplete accessibility and recorder lifecycle hardening

Quarantined:

- creativity or talent scoring
- punishment for dissonance or experimentation
- drag-only interaction
- automatic recording
- unlicensed samples presented as reusable
- the current loop field presented as a production timeline

## Machine-readable assets

- `data/affective-patterns.json` — canonical 27-pattern core registry
- `data/capytopia-patterns.json` — three source-specific Capytopia patterns
- `data/offbeat-patterns.json` — four source-specific Offbeat patterns
- `library/affective-contracts.js` — dependency-free clean-room reference helpers
- `CAPYTOPIA_HARVEST.md` — source correction and evidence record
- `OFFBEAT_HARVEST.md` — source correction and evidence record

The JavaScript helper library intentionally performs no emotion inference, no external actions, and no generated-markup rendering.

## Import bans

Do not import or rehabilitate:

- fake skin, mood, relationship, creativity, talent, or emotional severity scores
- generated quotes presented as authentic source quotations
- diagnosis from face, voice, cursor, biometrics, avatar choices, or interaction telemetry
- permanent psychological profiles
- automatic consequential adaptation
- manipulative streak loss or vulnerability scoring
- fictional hardware integrations
- scraping bypasses or ToS circumvention
- fake payment gates
- arbitrary model-generated HTML, actions, routing, or persistence
- sound used as the only state signal
- automatic recording
- unfinished prototypes described as working production features

## Replit-origin repository audit rule

Do not classify a Replit-origin repository from one metadata surface.

Required verification sequence:

1. Inspect repository metadata.
2. Search commit history.
3. Identify a viable commit or active ref.
4. Read expected product paths directly.
5. Verify representative assets.
6. Separate surviving product invention from current build health.
7. Record uncertainty rather than converting missing metadata into an empty-repository claim.

## Current inventory

The core registry contains 27 patterns. Supplemental source-specific registries add three Capytopia patterns and four Offbeat patterns, for **34 documented patterns across 14 donor systems**.

## Next harvest candidate

`left-brain-mcp` still requires the same multi-surface verification sequence before it can be classified or harvested.
