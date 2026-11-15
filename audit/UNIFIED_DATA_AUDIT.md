# Unified Training Data Audit — v3

## Canonical source
`ap_training_model_v1` is the canonical completed-training dataset.

## Compatibility layer
`ap_sessions` is a derived compatibility projection. Existing UI code may still call `sessions()` or `ls.get/set('ap_sessions')`, but the storage adapter routes those calls back to the canonical model.

## Canonical consumers
- Beranda: session/volume/streak helpers consume `sessions()`; the projection is canonical.
- Workout: completed sessions are persisted through the `ap_sessions` adapter into the canonical model.
- Library: exercise metadata comes from the exercise catalog; performed-exercise history comes from the canonical training model.
- Progress: unified consumer overrides PR, muscle analysis and weekly aggregates to use `apDataModel`.
- History: session list and summaries use canonical projection/metrics.
- Profile: program/profile settings remain profile data; completed-training analytics are sourced from the canonical model.
- Adaptive/Home Gym: session selectors consume the canonical projection and therefore the same dataset.

## Canonical API added in v3
`window.apTraining` now exposes explicit `all/get/save/update/remove/clear/stats/weekly/records/muscles/exercises/program/audit` methods.

## Integrity checks
The v3 runtime audit verifies:
1. canonical session count equals compatibility projection count;
2. every exercise row has a canonical session and exercise object;
3. every canonical session has program context/type;
4. total volume and working sets are derived from canonical metrics.

## Important compatibility decision
No second training database was introduced. Legacy `ap_sessions` remains only as an API-compatible projection so older UI modules continue to function while the canonical model remains the single source of truth.
