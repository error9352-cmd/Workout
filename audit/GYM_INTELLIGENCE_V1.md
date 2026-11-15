# Gym Intelligence v1

Regular Gym now uses the same intelligence pattern previously built for Home Gym, while keeping the existing Gym scheduler/editor intact.

## Integrated layers
- Goal-aware target ranges
- Progressive overload from canonical training history
- RPE-aware load progression
- Session evaluation: successful / too easy / too hard / stagnant
- Weekly adaptation: progression / maintenance / volume reduction / rotation / deload
- Weekly Coach compatibility through the unified `apTraining` source
- Canonical persistence of Gym evaluation data

## Data source
Completed sessions are read from `window.apTraining` when available. No second completed-training database is created.

## Gym-specific behavior
- Equipment selection is not introduced because regular Gym already assumes gym access.
- Existing `PROG` schedules and exercise library remain the source for available Gym exercises.
- The engine does not invent new exercises.
- Home Gym-specific modules remain intact.
