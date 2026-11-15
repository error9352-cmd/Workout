# Gym Smart Program — Stage 2

Stage 2 applies the shared Unified Training Intelligence foundation to regular Gym program selection.

## Inputs
- Goal
- Level
- Weekly frequency
- Canonical training history
- Recent exercise usage
- Last session evaluation

## Behaviour
- Keeps the existing Gym schedule structure and day names.
- Adjusts exercise targets from goal + level.
- Retains an existing exercise unless there is a clear rotation signal.
- Rotates exercises when the last evaluation is `stagnant` or `too_hard`, or when a high-frequency plan repeatedly uses the same movement.
- Uses the existing Gym exercise library (`apALL` / `apLIB`).
- Does not touch Home Gym program IDs (201+).

## API
`window.apGymSmartProgram.preview()`
`window.apGymSmartProgram.smartize()`
`window.apGymSmartProgram.context()`

## Stage boundary
This stage does not redesign the weekly split or implement the full exercise-rotation adaptation engine. Those belong to Stage 3.
