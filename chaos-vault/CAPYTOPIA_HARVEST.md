# Capytopia Harvest Correction

**Date:** 2026-07-22  
**Source:** `amydojo/capytopia`  
**Verified commit:** `627f68411f8e0110b53c5a72160ef3f4c83a54fc`

## Correction

The initial Chaos Vault audit incorrectly classified Capytopia as an empty GitHub shell because repository metadata returned `size: 0` and branch enumeration returned no results.

That conclusion was wrong.

A direct repository commit search revealed a substantial Replit-generated history. Fetching the latest known commit and individual files by commit SHA confirmed a functioning React and TypeScript prototype with a database schema, game state, capybara entities, quests, customization items, animated interfaces, and sound-backed interactions.

The metadata anomaly must not be treated as evidence that a repository has no content. For Replit-origin repositories, commit history and direct SHA inspection are required before classifying a source as empty.

## Verified implementation

### Drink-making ritual

`client/src/components/game/DrinkMaker.tsx` contains:

- a three-stage base, milk, and topping sequence
- espresso, tea, cold brew, milk, and topping options
- pour, steam, and stir sounds through Howler
- a visible progress strip
- an animated cup whose layers accumulate as ingredients are chosen
- an explicit completion and serve state
- a cancel route

### Character customization

`client/src/components/game/CustomizationPanel.tsx` contains:

- user-selected character colors
- happy, excited, neutral, and sleepy expressions
- optional blush
- held items
- hats, shirts, glasses, and other customization items
- immediate SVG preview
- backend-loaded customization inventory

### Soft-world task model

`client/src/components/game/GameBoard.tsx` contains:

- named café zones for service, preparation, seating, and a garden
- distinct visual treatment and descriptions for each zone
- capybara entities placed inside the world
- game stats and a café action interface
- partially implemented zone interaction behavior

`shared/schema.ts` contains:

- persistent game state with coins, level, café layout, and a break-reminder timestamp
- capybara entities with outfit state, current task, and last-fed timestamp
- customization inventory
- quests such as latte art, lost items, and plant care

## Harvested patterns

1. **CV-CAP-001 · Sensory Assembly Ritual**  
   Make progress physically legible through staged choices, optional sensory cues, and a visible object that accumulates the user’s actions.

2. **CV-CAP-002 · Avatar-Mediated Self-Expression**  
   Provide symbolic expressive distance through a user-controlled character without asking for direct emotional disclosure or inferring a private emotional state.

3. **CV-CAP-003 · Soft-World Task Scaffolding**  
   Give responsibilities recognizable places and environmental meaning so the world itself can orient the next action.

## Import boundaries

Do not import the prototype literally without repair.

- The capybara `happiness` integer is game state, not a psychological measure.
- Coins, levels, and quests must not punish absence, fatigue, or emotional disclosure.
- Sound and motion need mute, reduced-motion, and textual equivalents.
- Canvas zones need keyboard, touch, and non-spatial list access.
- Zone hit detection and actions are incomplete in the verified snapshot.
- Avatar choices must never become inferred mood telemetry.

## Audit rule added

For Replit-origin GitHub repositories:

1. Do not trust repository `size` metadata alone.
2. Search commit history even when branch enumeration is empty.
3. Fetch the newest viable commit directly.
4. Inspect representative files by commit SHA.
5. Only then classify the repository as populated, orphaned, incomplete, or empty.
