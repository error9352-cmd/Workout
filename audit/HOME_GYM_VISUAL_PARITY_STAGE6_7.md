# Athletic Physique — Stage 6.7
## Home Gym Visual Parity + Start Workout Fix

### Scope
- Align Home Gym page hierarchy with the existing Gym Workout page grid.
- Keep the shared Workout mode switch full-width on desktop.
- Use the same three-card desktop rhythm: selected program, all programs, and side utility card.
- Preserve Home Gym-specific equipment and weekly recommendation controls.
- Fix Home Gym Start Workout routing.

### Root cause of Start Workout bug
`generatePlan()` creates Home Gym program IDs `201 + index`, but `homeView()` was passing `selectedIndex` (0, 1, 2, ...) into `startHome()`. `startHome()` therefore could not find the generated session and returned before calling the canonical `startWorkout()` engine.

The start button now passes `selected.id`. The duplicate bubble handler for `[data-home-start]` was also removed so the capture-phase Workout Flow UX remains the single launch path.

### Visual parity changes
- Desktop Home Gym wrapper is layout-transparent (`display: contents`) so the shared `#app` Workout grid can place cards like Gym.
- Page-level heading, day picker, and start card span the full grid width, matching Gym.
- Selected program and all-program cards use the same `.card` + `.row` hierarchy as Gym.
- Home Gym weekly recommendation and equipment are combined into the right-side utility card rather than occupying separate full-width blocks.
- Mode switch width is aligned with the shared Gym control.

### Validation
- `node --check assets/js/29-home-gym-workout-tab.js` — PASS
- `node --check assets/js/48-workout-flow-ux.js` — PASS
- Stage 16 deterministic intelligence audit — run after patch
- Stage 17 deterministic end-to-end intelligence QA — run after patch
- ZIP integrity — run after packaging

Browser visual E2E was not performed in this environment.
