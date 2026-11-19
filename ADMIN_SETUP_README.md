# Athletic Physique — Super Admin Setup

For the complete Supabase setup, use these files:

- `assets/js/supabase-config.js` — project URL and browser-safe publishable key.
- `SUPER_ADMIN_SETUP.sql` — complete database schema, profiles, user_data, app_settings, triggers, role RPC, grants, and RLS.
- `SUPABASE_CONFIGURATION_GUIDE.md` — dashboard settings, Auth redirect URLs, optional Google OAuth, bootstrap admin, and test checklist.

After running the SQL, register/login with the intended admin email, then run the bootstrap UPDATE in `SUPABASE_CONFIGURATION_GUIDE.md` (or the matching bootstrap section in `SUPER_ADMIN_SETUP.sql`) with that email. Reload/login again so the role is refreshed.

Public registration must always create `user` accounts. Do not expose role selection in the registration form. To change a role, use the protected admin role-management flow/RPC when available; a project owner can also make a controlled manual change in Supabase Table Editor or SQL Editor.

For the current local Live Server setup, the app is opened at `http://127.0.0.1:5502/`. See `SUPABASE_CONFIGURATION_GUIDE.md` for the matching Supabase Site URL/Redirect URLs and Google OAuth origins/callback. If the port changes, update the dashboard allowlists accordingly.

The frontend never contains a service_role key. Permanent Auth account deletion remains a server-side/Edge Function task and is intentionally not exposed in the browser dashboard.
