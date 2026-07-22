---
name: Chaos Vault architecture
description: Third site area at /chaos-vault/ — namespace rules, accent color, quarantine policy, file structure
---

# Chaos Vault — Architecture Notes

## Namespace isolation
- CSS prefix: `.cv-*` — never mixed with `.studio-*` (homepage) or `.std-*` (standards)
- CSS custom properties: `--cv-*`
- JS: wrapped in `(function ChaosVault() { ... })()`
- Styles live in `/chaos-vault/assets/cv.css` — never appended to `/assets/styles.css`
- Scripts live in `/chaos-vault/assets/cv.js` — never appended to `/assets/app.js`

## Accent color
`#f0c040` (amber/gold) — distinct from Undone purple `#7b6cff`. Do not drift toward purple.

## Status taxonomy (5 states)
reconstructed · tested · experimental · quarantined · awaiting

## Quarantine policy (must not be imported)
- Fake skin scores / Smooth MD diagnostic logic
- Smooth MD business logic
- Broken Airtable wiring
- Retailer scraping bypasses
- Fictional Apple Watch support
- Fake Pro monetization gate

## File structure
```
/chaos-vault/
  index.html                    — inventory dashboard
  assets/cv.css                 — all .cv-* styles
  assets/cv.js                  — ChaosVault IIFE, all 8 demo handlers
  departments/
    camera.html
    vision-analysis.html
    recovery-patterns.html
    ai-validation.html
    motion-primitives.html
    graph-visualization.html
    real-time-events.html
    notification-engine.html
```

## Donor provenance
- Let's Glo → camera, vision-analysis, motion-primitives
- Fridge Web → recovery-patterns, ai-validation
- Living Tapestry → graph-visualization
- Jellycat Tracker → real-time-events, notification-engine

**Why:** Clean-room reconstruction — behavioral contracts only, not copied source files. All demos use simulated/mock data; no live API calls.
