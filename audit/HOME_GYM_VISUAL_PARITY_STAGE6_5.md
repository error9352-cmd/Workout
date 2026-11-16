# HOME GYM VISUAL PARITY — STAGE 6.5

## Scope
Static source audit and minimal refinement of the Home Gym Workout view against the existing Gym Workout view.

## Confirmed shared anatomy
- Shared workout mode switcher.
- Shared day-picker component: `.dpick` / `.dp`.
- Shared `SIAP LATIHAN` component: `.workout-start-card` / `.wsc-*`.
- Shared base card component: `.card`.
- Shared recommendation sheet base: `.sheetbg.schedule-recommendation-modal` / `.sheet` / `.chips` / `.chip`.
- Shared mobile recommendation-sheet behavior from the existing modal CSS.

## Refinements
1. Home Gym day cards now prefer the same `dayMus()` muscle-summary logic used by Gym, with Home Gym focus as fallback.
2. The selected Home Gym program card now uses the same primary description hierarchy as Gym instead of adding an extra inline meta line.
3. Weekly Home Gym recommendation is explicitly marked as a shared card component and receives mobile button sizing consistent with the existing card rhythm.

## Preservation
No changes to workout data model, Supabase integration, Auto Resume, Strict Completion Guard, Unified Intelligence, adaptive engine, or completed workout history.

## Validation
- `node --check assets/js/29-home-gym-workout-tab.js` — PASS
- `node --check assets/js/10-program-recommendations.js` — PASS
- `node --check assets/js/54-unified-recommendation-engine.js` — PASS
- Stage 16 Intelligence Audit — expected unchanged from Stage 6.4
- Stage 17 End-to-End Intelligence QA — expected unchanged from Stage 6.4
- ZIP integrity — PASS

## Limitation
This stage is a static/source parity audit. Browser visual E2E was not executed in the available environment.
