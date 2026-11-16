# Home Gym UX Parity — Stage 6.4

## Scope
Refine the Home Gym weekly schedule recommendation so its presentation follows the same shared visual system used by Gym.

## Changes
- Replaced the Home Gym-specific schedule recommendation container styling with the shared `card` + `row` presentation.
- Reused the shared `apTplCard` / exercise-list renderer for recommendation preview cards when available.
- Preserved Home Gym-specific controls: level, weekly frequency, and equipment.
- Preserved equipment-aware plan generation and weekly adaptation context.

## Safety
No changes to:
- active workout state
- auto-resume
- strict completion guard
- progression engine
- Unified Intelligence data model
- Supabase integration

## Validation
- `node --check assets/js/29-home-gym-workout-tab.js` — PASS
- `node --check assets/js/10-program-recommendations.js` — PASS
- `node --check assets/js/54-unified-recommendation-engine.js` — PASS
- ZIP integrity — to be verified after packaging

Browser visual E2E was not performed in this stage.
