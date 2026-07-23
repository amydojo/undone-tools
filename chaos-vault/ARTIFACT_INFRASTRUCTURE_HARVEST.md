# Affective Artifact Infrastructure Harvest

**Date:** 2026-07-23  
**Branch:** `agent/harvest-artifact-infrastructure`

## Scope

This harvest audits three authored prototype repositories:

| Donor | Verified commit | Retained surface |
| --- | --- | --- |
| `amydojo/Catmode` | `1bb108fb29d2885004a5df188526aa3cdb956e93` | room prescription, delivery formats, installation sequence, and seven-day observation protocol |
| `amydojo/get-fridge` | `919becd1d472d9d648fb68dcfb21f1e518322bc1` | ingredient intake, bounded selection, Cook Mode, repair reveal, completion, and saved recipes |
| `amydojo/STICKER-OS` | `4c23eafb1922b6134316d1c2bddbb4a8817884ae` | reactive object model, local suggestions, shared storage, and cross-surface extensions |

`amydojo/get-fridge` is the source already represented in the Vault as **Fridge Web**. This harvest deepens that donor instead of counting it twice.

No donor code is imported. The Vault retains clean-room behavioral contracts, implementation evidence, required controls, failure modes, and explicit quarantine rules.

## Product thesis recovered

These donors independently implement the same higher-order architecture:

> Convert a messy real-world condition into a bounded artifact, reduce the next interaction to an operational mode, keep repair nearby, and preserve only the evidence needed for future re-entry.

This collection names that architecture **Affective Artifact Infrastructure**.

## Catmode

Catmode is a behavioral site-plan prototype rather than a generic pet app. It models a missing sequence, prescribes a route through existing objects, translates one intervention into screen, document, and field-log formats, and lets observed use determine whether the intervention worked.

Retained:

- `CV-AFI-001` Behavioral Loop Prescription
- `CV-AFI-002` Route Before Object
- `CV-AFI-003` Subject-Decides-Outcome
- `CV-AFI-004` Medium-Translated Intervention
- `CV-AFI-005` Use-What-You-Have Trial

Do not retain:

- personal room or animal details as generic sample data
- veterinary, behavioral, or causal certainty
- the claim that using existing materials is always safer or more ethical than buying needed equipment
- observation protocols that become coercive monitoring

## Get Fridge

Get Fridge is stronger as a bounded execution system than as an AI recipe generator. It compiles possibilities from present materials, supports explicit decision delegation, turns the phone into a one-task cooking appliance, keeps repair inside the task, and ends without demanding productivity spectacle.

Retained:

- `CV-AFI-006` Appliance Mode
- `CV-AFI-007` Available-Materials Compiler
- `CV-AFI-008` Choice Surrender Control
- `CV-AFI-009` Quiet Satisficing Completion
- `CV-AFI-010` Evidence-by-Use Archive

Strengthened rather than duplicated:

- `CV-AFX-006` Something Feels Off? Recovery Reveal
- `CV-ART-003` Bounded Machine Metaphor

Do not retain:

- unverified food-safety guidance
- allergy or medical assumptions
- opaque generated substitutions
- daily-use paywalls attached to basic care needs
- novelty ranking that ignores feasibility

## StickerOS

StickerOS treats changing personal context as a user-owned object that can travel through ordinary communication. The useful invention is not a sticker marketplace. It is ambient state made sendable without requiring a dashboard, confession, or server-side conversation analysis.

Retained:

- `CV-AFI-011` Ambient State Object
- `CV-AFI-012` Context Without Confession
- `CV-AFI-013` Cross-Surface Expressive Continuity
- `CV-AFI-014` Local Context Suggestion

Do not retain:

- automatic sending
- full-access keyboard permissions as a hidden prerequisite
- location, battery, activity, availability, or energy data shared without explicit choice
- emotion or personality inference from selected objects
- context collection beyond the smallest declared purpose

## Import contract

Every record in `data/artifact-infrastructure-patterns.json` must retain:

- donor repository and immutable commit
- implemented evidence separated from effectiveness claims
- a portable thesis
- observed mechanics
- required controls
- known risks
- collection-level quarantine rules

The implementation relationship is always:

> **illustrates, does not validate**

## Inventory effect

This harvest adds 14 documented patterns and two new donor systems. Get Fridge deepens the existing Fridge Web donor.

Mainline totals represented by this branch:

- 23 technical parts
- 27 core affective patterns
- 3 Capytopia patterns
- 5 Design Intent Infrastructure patterns
- 14 Affective Artifact Infrastructure patterns
- **49 documented patterns across 16 donor systems**
