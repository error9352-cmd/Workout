# Athletic Physique — Adaptive Safety & Consistency Audit (Stage 6)

## Scope
Audit the adaptive chain after Stage 5, with emphasis on Gym/Home Gym consistency, duplicate mutation paths, decision authority, and protection of completed history.

## Findings

### 1. Canonical data remains shared
- `assets/js/44-unified-training-intelligence.js` reads completed sessions through `window.apTraining`.
- Gym and Home Gym continue to use the same intelligence API while retaining mode-specific equipment/program rules.

### 2. Unified Recommendation is the final active-workout authority
The existing start chain contains several historical progression/adaptive bridges. Stage 6 removes one duplicate mutation path:
- `assets/js/53-progression-workout-adaptive-bridge.js` no longer applies its legacy progression target directly when `window.apUnifiedRecommendation` is ready.
- It still builds and stores the progression bridge context for diagnostics.
- `assets/js/54-unified-recommendation-engine.js` remains responsible for resolving the final recommendation.
- `assets/js/56-recommendation-safety-guardrails.js` remains the final safety validation layer.

This prevents the same active workout from receiving two independent target mutations in sequence.

### 3. Gym exercise rotation authority is aligned
`assets/js/45-gym-smart-program.js` no longer performs status-based `too_hard` / `stagnant` rotation when the Unified Adaptive Engine is available. The existing Stage 3 adaptive engine remains responsible for those rotations. Frequency-based smart rotation is retained.

This avoids a render-order conflict where two engines could independently rotate the same exercise.

### 4. Home Gym weekly adaptation remains mode-specific
`assets/js/35-home-gym-weekly-adaptation.js` continues to own Home Gym weekly volume/frequency adaptation. The Unified Recommendation Engine consumes that decision rather than replacing the Home Gym engine.

### 5. Completed history protection
Stage 6 does not rewrite canonical completed sessions. Changes remain limited to future `PROG` entries and the current active workout state.

## Validation

- `node --check` passed for all application JavaScript files, excluding the known HTML-wrapper `assets/js/24-supabase-cdn.js`.
- Stage 16 intelligence audit: 12/12 passed.
- Stage 17 end-to-end intelligence QA: 21/21 passed.
- ZIP integrity check passed.
- Browser-level E2E was not claimed in this stage.

## Result
The adaptive chain now has a clearer authority order:

**Canonical Training Data → Exercise Progression / Session Evaluation → Weekly Adaptation → Unified Adaptive Rotation → Unified Recommendation → Decision Trace → Safety Guardrails → Active Workout**

No new intelligence engine was added.
