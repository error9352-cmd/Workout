# Athletic Physique — Stage 10
## Progress & History Data Consistency

### Scope
This stage hardens the read path for Progress and History so summary metrics use the canonical `ap_training_model_v1` dataset through `window.apDataModel`.

### Canonical source
- Storage key: `ap_training_model_v1`
- Model: `window.apDataModel`
- Unified read contract: `window.apUnifiedAnalytics`
- Compatibility projection: `ap_sessions` remains available to legacy UI modules but is not a second dataset.

### Changes
- Added `assets/js/51-progress-history-data-consistency.js`.
- Added one script reference in `index.html` after Stage 9.
- History summary now derives sessions, working sets, volume and duration from canonical session metrics.
- PR badge counting now uses canonical session/exercise metrics and the same best-load definition as canonical PR records.
- Progress summary now derives its period metrics from canonical `apDataModel.stats()` and canonical sessions.
- Added regression markers on `<html>`:
  - `data-progress-data-source="unified-v1"`
  - `data-history-data-source="unified-v1"`
  - `data-analytics-contract="v1"`

### Deliberate non-changes
- No new storage key.
- No duplicate analytics dataset.
- No changes to workout logging, session evaluation, adaptive engine, weekly coach, or historical records.
- Existing charts/layout remain in place.

### Verification targets
- Stage 10 script loaded exactly once.
- Runtime JavaScript syntax check passes.
- Existing Stage 1–9 files remain present.
- ZIP integrity check passes.
