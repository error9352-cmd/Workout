# Instructions for AI coding agents

Before making any change to this repository, read `AI_UPDATE_INSTRUCTIONS.md` in full. It contains the project-specific rules for preserving Supabase, Google OAuth, User/Admin roles, RLS, cloud sync, user data, runtime script order, and update/testing procedure.

Also read `README.md` and `PROJECT_GUIDE.md` before editing application code. Do not reset or replace the existing backend configuration or database. If a database change is genuinely required, provide a separate safe SQL migration and explain it; do not silently apply destructive changes.

Before any feature work, also read `FEATURE_INTEGRATION_REGISTRY.md`. Every feature update must update the registry, the Project Guide, and the Super Admin feature status in the same change. Never expose a working-looking toggle for a feature that has no runtime gate.
