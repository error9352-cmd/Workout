# Stage 11 — Exercise-Level Progression

## Objective
Unify per-exercise progression analytics on the canonical `ap_training_model_v1` dataset.

## Implemented
- Added `assets/js/52-exercise-progression.js`.
- Added `assets/css/19-exercise-progression.css`.
- Added a Progress card: **Progress per gerakan**.
- Added `window.apExerciseProgression` with `rows`, `summarize`, `all`, `target`, `e1rm`, and `audit`.
- Uses `window.apDataModel.exerciseRows()` only; no second storage dataset is created.
- Calculates working-set best load/reps and Epley estimated 1RM.
- Detects simple up/down/stable trends from recent completed sessions.
- Detects three-entry stagnation and gives a next-step recommendation.
- Uses program exercise target ranges when available; otherwise explicitly shows that a target is unavailable.
- Warm-up sets are excluded from progression metrics.
- Completed history is read-only and is not rewritten.

## Integration
`index.html` loads Stage 11 after Stage 10. The existing Progress renderer is wrapped once so the new card is prepended without replacing existing Progress cards/charts.

## Verification
- Runtime JavaScript syntax check passed for all JS files loaded by `index.html`.
- Stage 11 JS/CSS references occur exactly once.
- ZIP integrity checked with `unzip -t`.
