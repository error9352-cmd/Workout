# Post Workout Flow UX — Stage 9

## Scope

This stage connects the existing completion engines into one post-workout journey:

`Selesaikan workout → ringkasan → evaluasi sesi → Riwayat / Progres`

## Changes

### 1. Completion bridge
- Added `50-post-workout-flow.js` as an additive completion observer.
- It does not replace the existing Gym or Home Gym finish handlers.
- It waits for the existing persistence/render cycle to finish before opening the summary.
- If completion did not persist (for example because no set was recorded), no summary is shown.

### 2. Unified post-workout summary
- Shows workout mode, exercise count, working-set count, volume, and duration.
- Reads the evaluation already attached to the completed session.
- Supports Gym `gymEvaluation` and Home Gym `hgEvaluation` through the same UI.
- Does not recalculate or overwrite evaluation data.

### 3. Next-step navigation
- `Lihat Riwayat` returns to the existing History page and opens the latest session item.
- `Lihat Progres` opens the existing Progress page.
- `Tutup` leaves the user on the already-rendered post-completion page.
- Escape and backdrop click close the summary.

## Preserved

- Existing Gym finish engine.
- Existing Home Gym evaluator and finish engine.
- Canonical `ap_training_model_v1` persistence.
- Existing History rendering and Session Evaluation cards.
- Weekly Adaptation, Unified Adaptive Engine, and Weekly Coach.

## Verification

- `50-post-workout-flow.js` passes `node --check`.
- CSS/JS references are each inserted once.
- No existing runtime files are removed.
