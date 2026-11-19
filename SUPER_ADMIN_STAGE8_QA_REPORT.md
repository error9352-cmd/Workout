# Super Admin Stage 8 — QA & Security Hardening

## Static QA completed

- JavaScript syntax checked with Node.js for the Super Admin modules.
- Stage 7 SQL reviewed for RLS, grants, SECURITY DEFINER functions, and audit insertion.
- Stage 8 adds database-side audit triggers so important admin changes do not depend solely on frontend audit calls.
- Role changes are audited inside `admin_set_user_role`.
- Direct client INSERT/UPDATE/DELETE access to `admin_audit_log` remains blocked.
- Audit values matching password/secret/token/private/credential/API-key patterns are redacted.

## Manual Supabase QA

1. Run `SUPER_ADMIN_STAGE8_SECURITY_HARDENING.sql` after Stage 7 SQL.
2. As a normal user, verify `admin_audit_log` cannot be selected and admin RPCs reject access.
3. As an admin, change a user role and confirm one `role_changed` event appears.
4. As an admin, change an app setting and confirm one `setting_updated` event appears.
5. Create/update/disable an exercise and confirm the corresponding audit event appears.
6. Create/update/disable a program template and confirm the corresponding audit event appears.
7. Confirm audit details do not expose values for sensitive-looking setting keys.
8. Verify the admin account cannot change its own role.
9. Verify maintenance mode does not block the Super Admin Control Center.
