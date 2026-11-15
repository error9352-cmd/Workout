# Unified Training Intelligence — Stage 1

Stage 1 establishes one shared intelligence foundation for Gym and Home Gym without changing program selection or adaptation decisions.

## Shared context
- Goal: Muscle Gain, Strength, Fat Loss, Athletic Performance
- Level: normalized from Home Gym plan / profile fallback
- Frequency: normalized to planned sessions per week
- Equipment: Home Gym equipment list; Gym represented as gym equipment context
- Mode: gym / home

## Shared selectors
`window.apUnifiedIntelligence` provides `sessions(mode)`, `recent()`, `last()`, `exerciseHistory()`, `context()`, `stats()`, `weeklyStats()`, `performance()`, `lastEvaluation()`, and `snapshot()`.

## Engines migrated to the foundation
- Home Gym Adaptive Engine
- Home Gym Session Evaluator
- Home Gym Weekly Adaptation Engine
- Gym Intelligence Engine

Legacy storage remains as fallback for compatibility.

## Deferred
Stage 2 will unify exercise selection and program generation. Stage 3 will unify adaptive exercise rotation.
