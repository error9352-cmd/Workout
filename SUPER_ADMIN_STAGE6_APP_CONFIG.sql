-- Athletic Physique — Stage 6 App Configuration & Feature Control
-- Jalankan setelah SUPER_ADMIN_SETUP.sql.

create or replace function public.ap_get_runtime_config()
returns table(key text, value jsonb)
language sql
stable
security definer
set search_path = ''
as $$
  select s.key, s.value
  from public.app_settings s
  where s.key in (
    'maintenance_mode',
    'allow_registration',
    'allow_google_login',
    'auto_resume_workout',
    'weekly_coach_enabled',
    'smart_program_enabled',
    'adaptive_workout_enabled',
    'intelligence_enabled'
  );
$$;

revoke all on function public.ap_get_runtime_config() from public, anon;
grant execute on function public.ap_get_runtime_config() to anon, authenticated;

insert into public.app_settings(key,value) values
  ('allow_registration','true'::jsonb),
  ('auto_resume_workout','true'::jsonb),
  ('weekly_coach_enabled','true'::jsonb),
  ('smart_program_enabled','true'::jsonb),
  ('adaptive_workout_enabled','true'::jsonb),
  ('intelligence_enabled','true'::jsonb)
on conflict (key) do nothing;
