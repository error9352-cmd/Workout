# Workout Logging UX — Stage 8

## Scope

This stage refines the active workout logging journey without replacing the existing workout engine:

`Buka sesi → isi beban/repetisi/durasi → Catat set → lanjut ke set berikutnya → Selesaikan workout`

## Changes

### 1. Set logging feedback
- Added a compact live status showing recorded sets versus total working sets.
- Status updates after the existing render cycle, so the existing workout state remains authoritative.
- Completed state is visually distinct without introducing a new color system.

### 2. Faster set entry
- Pressing Enter in a repetition field triggers the existing `Catat` action.
- Existing input values are selected on focus for quick replacement.
- Validation error styling is cleared when the user starts editing again.
- After recording a set, focus moves to the next available set when possible.

### 3. Safer completion
- If the user attempts to finish with unrecorded working sets remaining, the app asks for confirmation.
- A fully recorded workout continues through the existing finish handler without an extra confirmation step.
- No changes were made to the existing history persistence logic.

## Preserved

- Existing `startWorkout()` / Home Gym start flow.
- Existing set data structure in `ap_active`.
- Existing `Catat` behavior, rest timer, RPE, supersets, warm-up, exercise rotation and swap controls.
- Existing `ap_sessions` compatibility projection and canonical training model integration.
- Existing Session Evaluation, Weekly Adaptation, Adaptive Engine and Weekly Coach.

## Verification

- `49-workout-logging-ux.js` passes `node --check`.
- `17-workout-logging-ux.css` is referenced exactly once.
- `49-workout-logging-ux.js` is referenced exactly once.
- No existing runtime files were removed.
