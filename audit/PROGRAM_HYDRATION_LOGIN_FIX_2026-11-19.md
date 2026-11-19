# Program Hydration & Login Gate Fix — 2026-11-19

## Reported symptoms
- Welcome wizard appeared during/after login even for an existing account.
- Cloud data appeared after a delay.
- Saved workout programs (`ap_prog`) were missing after login.

## Root cause identified in active runtime
1. `10-patch.js` scheduled the welcome wizard 500 ms after core startup. It checked the initial in-memory `PROG` and profile before the Supabase session restore/pull had completed.
2. `00-app-core.js` caches `PROG` and `weights` in JavaScript memory at startup.
3. `24-patch.js` restored cloud values directly into `localStorage`, then relied on a page reload to update the cached globals. A reload guard could prevent a later reload, leaving `PROG` stale even though `ap_prog` was present in localStorage.
4. During the restore delay, the login flow hid the auth overlay before the pull completed, allowing the user to see and potentially interact with the not-yet-hydrated app state.

## Changes
- `assets/js/24-patch.js`
  - Added `__AP_CLOUD_AUTH_PENDING` / `__AP_CLOUD_READY` state and `ap:cloud-ready` event.
  - Holds onboarding until session ownership and cloud hydration finish, or until the user explicitly continues without an account.
  - Keeps a visible, disabled hydration overlay while program/history data is restored.
  - Applies cloud-restored keys through `window.apApplyHydratedStorage(changedKeys)` rather than relying on reload for normal pulls.
  - Keeps failed pull/push from being treated as a successful hydration.
  - Excludes local-only `ap_sb_*` metadata from user-data sync and normal user-data cache cleanup.
- `assets/js/00-app-core.js`
  - Added `window.apApplyHydratedStorage(keys)` to refresh in-memory `PROG`, `weights`, theme, and render after cloud pull.
- `assets/js/10-patch.js`
  - Welcome wizard now waits for `ap:cloud-ready` before evaluating whether an account needs onboarding.
- `index.html`
  - Bumped query versions for changed scripts to avoid stale browser/CDN assets.
- `sw.js`
  - Bumped service worker cache version to `ap-v61-program-hydration-gate`.
- `AI_UPDATE_INSTRUCTIONS.md`, `PROJECT_GUIDE.md`, `FEATURE_INTEGRATION_REGISTRY.md`
  - Added the mandatory login/cloud hydration/program restore contract and regression criteria.
- `audit/program-hydration-regression.js`
  - Added seven regression tests for cache hydration, onboarding gate, pull behavior, UID filtering, and local metadata handling.

## Verification
- Existing integration harness: 18/18 PASS.
- Program hydration regression harness: 7/7 PASS.
- JavaScript syntax: 116/116 files pass `node --check`.
- HTML local script references: 69/69 found.
- Duplicate literal HTML IDs: 0.

## Not verified in this environment
- Live browser rendering and timing against the deployed GitHub Pages site.
- Actual Supabase network calls, active account `user_data` contents, RLS behavior, and two real user accounts.
- Whether the previously missing program still exists in the user's cloud/local backup. This patch prevents the race going forward; it cannot reconstruct data already overwritten before the fix without a backup or remaining cloud copy.

## Deployment test
1. Deploy the complete project folder.
2. Open the live site and hard refresh once (Ctrl+Shift+R) after the service worker updates.
3. Login using an existing account with a saved program.
4. Expected: a short “Memulihkan data…” overlay may appear, then the saved program appears; welcome wizard does not appear.
5. Refresh and repeat. Confirm program remains visible.
6. Test a genuinely empty account separately; onboarding may appear only after cloud restore confirms that account has no saved program/profile.
