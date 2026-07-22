# Offbeat Harvest

## Source correction

**Repository:** `amydojo/offbeat`  
**Verified ref:** `main`  
**Verified:** 2026-07-22

The first audit classified Offbeat as an empty deployment stub after commit search surfaced only one initial commit with an empty `index.js`.

That conclusion was incomplete.

Direct file reads against the current `main` ref expose a separate Vite and React alpha containing:

- `src/App.jsx` and `src/NewApp.jsx`
- `src/components/VibeTile.jsx`
- `src/components/VibeBoard.jsx`
- `src/lib/audioEngine.js`
- three bundled loop assets
- Tone.js playback and recording
- React DnD composition

The repository is not empty. It is a damaged alpha export whose product concept and core interaction primitives survived even though its boot and styling files are incomplete.

## Product thesis recovered

Offbeat is a vibe-first music learning and remix playground.

Its intended interaction grammar is:

> choose a sound by feel, place it into a shared field, hear the consequence immediately, and preserve the result as an artifact.

The concept reduces the intimidation of conventional digital audio workstations without pretending that musical structure does not exist. Complexity is moved into the curation of compatible materials so the person can learn through playful consequence rather than prerequisite theory.

## Verified implementation

### Vibe tiles

`VibeTile` turns a musical role into a draggable object. The current alpha exposes Drums, Bass, and Melody as named tiles.

### Vibe board

`VibeBoard` accepts tiles and renders the growing mix as a visible collection. Dropping a tile immediately invokes audio playback.

### Audio engine

The Tone.js helper:

- creates looping players
- routes audio to the destination
- records the destination
- creates a browser download URL
- includes stop-one and stop-all helpers

### Bundled source material

`loop1.mp3`, `loop2.mp3`, and `loop3.mp3` exist in the repository as distinct audio blobs.

## Harvested patterns

### CV-OFF-001 · Sound-as-Object Tile

Represent a complex medium as a small manipulable object with a legible role. The user acts on the object directly instead of configuring an abstract channel first.

### CV-OFF-002 · No-Wrong-Notes Constraint Field

Curate a bounded set of compatible materials so exploration remains expressive while catastrophic failure becomes unlikely. The constraint lives in the material system, not in corrective scolding after the action.

### CV-OFF-003 · Immediate Auditory Consequence

Couple placement and consequence tightly. A dropped sound becomes audible immediately, allowing the person to learn relationships through perception rather than explanation alone.

### CV-OFF-004 · Play-to-Artifact Capture

Let an ephemeral play state become a portable artifact through explicit recording and download. The result is owned by the person rather than trapped inside the experiment.

## Affective-interface relevance

Offbeat contributes a useful alternative to coaching, instruction, and optimization:

> Build a safe field where understanding emerges from playful consequence.

This is applicable beyond music:

- creative tools
- low-pressure onboarding
- configuration systems
- learning environments
- therapeutic-adjacent play that avoids clinical claims
- any domain where fear of doing it wrong prevents exploration

## Current repository limitations

The verified alpha is not build-ready.

- `src/main.jsx` references React, ReactDOM, and `NewApp` without imports.
- `index.html` points to `/src/` rather than a concrete module entry.
- `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, and `src/index.css` are empty.
- The visible “timeline” does not schedule clips in time. Every drop starts a loop immediately, so it is currently a layered loop field rather than a real timeline.
- There are no visible remove, reorder, mute, solo, volume, transport, or clear controls.
- `stopLoop` and `stopAll` exist but are not surfaced in the UI.
- Reconnecting `Tone.Destination` to the recorder on every loop creation needs review.
- Recording format, browser support, object URL cleanup, and error states are not hardened.

## Required safeguards for reuse

- Every sound needs a visible text label and non-audio state indication.
- Playback must expose stop, mute, volume, and clear controls.
- Motion and drag must have keyboard and touch equivalents.
- The system must distinguish curated compatibility from a claim that every musical result is objectively good.
- Recording must be explicit and locally controlled.
- Export ownership and sample licensing must remain visible.
- The interface must never grade creativity, infer talent, or punish experimentation.

## New audit rule reinforced

For Replit-origin repositories, commit summaries and launch stubs are not sufficient evidence. Read expected product paths directly from the active ref and search for known source concepts before classifying the implementation as absent.
