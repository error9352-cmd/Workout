# SUPER ADMIN STAGE 6 — APP CONFIGURATION & FEATURE CONTROL

## Added
- Super Admin `Fitur` tab for feature flags.
- Toggle controls for maintenance, registration, Google login, Auto Resume, Weekly Coach, Smart Program, Adaptive Workout, and Unified Intelligence.
- Safe runtime config RPC: `ap_get_runtime_config()`.
- Runtime client bridge: `window.AP_APP_CONFIG` and `window.AP_APP_CONFIG_READY`.
- Maintenance overlay for non-admin runtime users while keeping the Super Admin control center accessible.

## Supabase
Run:
- `SUPER_ADMIN_STAGE6_APP_CONFIG.sql`

The RPC exposes only explicitly approved runtime-safe keys. `app_settings` remains admin-only through existing RLS.

## Verification
1. Login as admin.
2. Open Super Admin → Fitur.
3. Toggle a flag and confirm it persists after refresh.
4. Toggle Maintenance Mode and verify the admin control center remains accessible.
5. Confirm normal users receive the maintenance overlay when maintenance mode is enabled.
6. Turn Maintenance Mode off before normal application testing.

## Runtime integration status update — 19 Nov 2026

The original Stage 6 feature-setting list included eight keys, but not all were connected to runtime behavior. Current source now wires `maintenance_mode`, `allow_registration`, `allow_google_login`, and `weekly_coach_enabled`. The other four keys (`auto_resume_workout`, `smart_program_enabled`, `adaptive_workout_enabled`, `intelligence_enabled`) remain stored for compatibility but are marked not wired; Super Admin controls and generic setting editors are disabled for those keys until a real runtime gate and regression tests are added. See `FEATURE_INTEGRATION_REGISTRY.md`.
