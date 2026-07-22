---
name: Chaos Vault architecture
description: Isolated parts and affective-pattern library at /chaos-vault/ — namespace rules, provenance, status, quarantine, and file structure
---

# Chaos Vault — Architecture Notes

## Purpose

Chaos Vault is the reusable-parts and interaction-pattern archive for Lab Dojo and Undone experiments.

It has two layers:

1. **Technical departments** — clean-room engineering primitives reconstructed from donor applications.
2. **Affective pattern libraries** — original product inventions, research-linked hypotheses, and portable interaction contracts.

The archive must distinguish working implementation, product hypothesis, research evidence, and demo fiction. It is not a place to make old prototypes look more complete than they were.

## Namespace isolation

- CSS prefix: `.cv-*` — never mixed with `.studio-*` or `.std-*`
- CSS custom properties: `--cv-*`
- JS: wrapped in an IIFE or exposed through an explicit `ChaosVault*` namespace
- Styles live in `/chaos-vault/assets/cv.css` or page-local isolated styles
- Scripts live in `/chaos-vault/assets/`, `/chaos-vault/library/`, or page-local modules
- Never append Chaos Vault behavior to `/assets/app.js`
- Chaos Vault contains no commerce behavior and no medical free-form input

## Accent color

`#f0c040` (amber/gold) — distinct from Undone purple `#7b6cff`.

## Status taxonomy

- `reconstructed` — behavior rebuilt from an audited donor contract
- `tested` — demonstrated in a working product or coded laboratory; not automatically validated as effective
- `experimental` — plausible design or engineering hypothesis requiring evaluation
- `quarantined` — documented specifically so it cannot be imported
- `awaiting` — donor source is known but unavailable for direct inspection

Status is implementation maturity, not scientific evidence.

Research-linked patterns also retain an evidence label or bounded evidence statement. Never convert evidence labels into a flattering aggregate score.

## Provenance types

### Original product invention

A pattern authored across Amy Do / Lab Dojo products. Preserve the originating product and the exact claim being made.

### Research-linked design hypothesis

A portable proposal connected to evidence, limitations, competing explanations, harms, and falsification conditions. Do not market it as a proven universal standard.

### Clean-room reconstruction

A reusable implementation rebuilt from audited behavior rather than copying domain-specific source wholesale.

### Quarantined specimen

A failed, fictional, unsafe, misleading, or domain-bound behavior preserved only to prevent accidental reuse.

## Quarantine policy

Must not be imported:

- fake skin, emotion, mood, relationship, or severity scores
- generated quotes presented as authentic source quotations
- Smooth MD diagnostic or business logic
- broken Airtable wiring
- retailer scraping bypasses
- fictional Apple Watch or hardware support
- fake Pro monetization gates
- relationship-quality points, vulnerability grading, or streak punishment
- diagnosis from face, voice, cursor, biometrics, or interaction telemetry
- permanent psychological profiles
- automatic consequential adaptation or external actions
- arbitrary model-generated markup, routing, persistence, or actions

## File structure

```text
/chaos-vault/
  index.html                         inventory dashboard
  HARVEST_LOG.md                    source-by-source audit and corrections
  assets/
    cv.css                          all shared .cv-* styles
    cv.js                           Chaos Vault demos and reveal behavior
  data/
    affective-patterns.json         canonical machine-readable pattern registry
  library/
    affective-contracts.js          dependency-free reference helpers
  departments/
    camera.html
    vision-analysis.html
    recovery-patterns.html
    ai-validation.html
    motion-primitives.html
    graph-visualization.html
    real-time-events.html
    notification-engine.html
  patterns/
    index.html                      affective pattern library landing page
    affective-contracts.html
    interaction-budgets.html
    artifact-compilers.html
    continuity-systems.html
```

## Technical donor provenance

- Let’s Glo → camera, vision-analysis, motion-primitives
- Fridge Web → recovery-patterns, ai-validation
- Living Tapestry → graph-visualization
- Jellycat Tracker → real-time-events, notification-engine

## Affective pattern provenance

- Affective UX Lab → state-hypothesis ethics, adaptation ladder, research-linked patterns
- Bad Day Receipt → declared load, Interaction Budget, Minimum Necessary Interface, Three Valid Endings, continuity envelope
- Mirror → pattern memory over scoring, observation over optimization, calibrated uncertainty language
- Capsule → Object Continuity System, source/specimen provenance, archival ritual
- Glint → interpretation-conditioned artifact design
- flame.io → tone-as-consent and graceful prompt fallback
- Fridge Web → mid-task recovery reveal
- Interface Behavior Lab → controls as contracts, consequence-weighted friction, attached recovery, state without spectacle
- Living Tapestry → thought-to-action topology
- KEYS → procedural accompaniment
- Face Value → delta-over-score and longitudinal evidence thesis

## Reference-library rules

`library/affective-contracts.js` must remain:

- dependency free
- deterministic
- inspectable
- explicit about user-selected policies
- incapable of emotion diagnosis
- incapable of external actions
- incapable of generated HTML execution
- safe to evaluate in Node validation and in a browser namespace

## Validation requirements

Static validation must confirm:

- all department and pattern routes exist
- the pattern registry parses and has unique IDs
- every registry record has provenance, thesis, status, and risk fields
- the reference helper library exposes the expected API
- the Chaos Vault namespace remains isolated from Studio and Standards commerce
- quarantined concepts remain named in the architecture or harvest log

## Current source limitation

The GitHub repositories `left-brain-mcp`, `offbeat`, and `capytopia` are empty shells as of this harvest. Their live source remains in Replit and is marked awaiting until it is pushed or materialized for independent inspection.
