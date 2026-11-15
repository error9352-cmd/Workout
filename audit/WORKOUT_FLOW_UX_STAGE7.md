# Workout Flow UX — Stage 7

## Scope
This stage focuses only on the frontend workout journey:

`Mulai Workout → Workout aktif → Catat set → Selesai → Riwayat`

The existing canonical training model and Gym/Home Gym intelligence layers are preserved.

## Changes

### 1. Reliable workout entry
Added `assets/js/48-workout-flow-ux.js`.

- Intercepts Gym and Home Gym start actions before duplicate handlers can run.
- Prevents rapid double-click/tap from creating duplicate active sessions.
- Reuses the existing `startWorkout()` / `startHome()` engine instead of replacing it.
- If the same active workout is already running, it returns to the Workout tab rather than creating a second session.
- If another workout is active, it blocks the new start and keeps the user in the existing session flow.
- Adds a short launch lock and accessible busy state.

### 2. Navigation safety during an active workout
- Prevents accidental navigation away from an active workout through the bottom navigation.
- The Workout tab remains the single active-session destination.
- Existing cancel/finish controls remain available.

### 3. Visual consistency
Added `assets/css/16-workout-flow-ux.css`.

- Start buttons retain the existing visual language.
- Busy/disabled launch state is clear rather than looking broken.
- Active-session completion controls receive consistent emphasis.
- Mobile spacing is refined without redesigning the workout screen.

## Preserved

- Existing Gym workout engine.
- Existing Home Gym workout engine.
- Canonical `ap_training_model_v1` data model.
- Session evaluation and weekly adaptation.
- Unified Adaptive Engine.
- Weekly Coach.
- Existing history/progress calculations.
- Existing workout set logging, timers, supersets, RPE, and exercise controls.

## Verification

- `48-workout-flow-ux.js` passes `node --check`.
- `16-workout-flow-ux.css` is referenced exactly once.
- `48-workout-flow-ux.js` is referenced exactly once.
- Existing runtime JS files were syntax-checked.
- The full project remains packaged as a complete ZIP; no existing project files are intentionally removed.
