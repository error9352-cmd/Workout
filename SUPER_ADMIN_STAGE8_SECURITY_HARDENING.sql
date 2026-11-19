-- Athletic Physique — Stage 8 Security Hardening & Audit Integrity
-- Jalankan setelah SUPER_ADMIN_SETUP.sql dan Stage 4-7 SQL.
-- Aman dijalankan ulang.

begin;

-- 1) Audit helper: semua perubahan admin penting dicatat dari sisi database,
-- bukan hanya dari tombol frontend. Perubahan yang terjadi tanpa sesi pengguna
-- (mis. service role/backend) sengaja tidak dipaksakan sebagai actor admin.
create or replace function public.ap_admin_audit(
  p_action text,
  p_target_type text default null,
  p_target_id text default null,
  p_details jsonb default '{}'::jsonb
)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare new_id bigint;
begin
  if auth.uid() is null then raise exception 'Not authenticated'; end if;
  if not exists (select 1 from public.profiles where id=auth.uid() and role='admin') then
    raise exception 'Admin access required';
  end if;
  insert into public.admin_audit_log(actor_id,action,target_type,target_id,details)
  values(
    auth.uid(),
    left(trim(coalesce(p_action,'')),120),
    left(trim(p_target_type),80),
    left(trim(p_target_id),200),
    coalesce(p_details,'{}'::jsonb)
  )
  returning id into new_id;
  return new_id;
end;
$$;

revoke all on function public.ap_admin_audit(text,text,text,jsonb) from public, anon;
grant execute on function public.ap_admin_audit(text,text,text,jsonb) to authenticated;

-- 2) Audit perubahan role dari RPC yang menjadi sumber otoritatif.
create or replace function public.admin_set_user_role(target_user_id uuid, new_role text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare old_role text;
begin
  if not public.ap_is_admin() then
    raise exception 'Admin access required';
  end if;
  if new_role not in ('user', 'admin') then
    raise exception 'Invalid role';
  end if;
  if target_user_id = (select auth.uid()) then
    raise exception 'You cannot change your own role';
  end if;
  select role into old_role from public.profiles where id=target_user_id;
  if old_role is null then
    raise exception 'User profile not found';
  end if;
  update public.profiles
     set role = new_role, updated_at = now()
   where id = target_user_id;
  perform public.ap_admin_audit(
    'role_changed','user',target_user_id::text,
    jsonb_build_object('old_role',old_role,'new_role',new_role)
  );
end;
$$;
revoke all on function public.admin_set_user_role(uuid,text) from public, anon;
grant execute on function public.admin_set_user_role(uuid,text) to authenticated;

-- 3) Database-side audit trigger untuk app_settings, exercise_catalog,
--    dan program_templates. Ini mencegah audit hanya bergantung pada UI.
create or replace function public.ap_audit_admin_table_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  actor uuid := auth.uid();
  details jsonb := '{}'::jsonb;
  target text;
  action_name text;
begin
  if actor is null then
    return coalesce(new, old);
  end if;
  if not exists (select 1 from public.profiles where id=actor and role='admin') then
    return coalesce(new, old);
  end if;

  if tg_table_name = 'app_settings' then
    target := coalesce(new.key, old.key);
    action_name := case when tg_op='INSERT' then 'setting_created' when tg_op='UPDATE' then 'setting_updated' else 'setting_deleted' end;
    details := jsonb_build_object('key',target);
    if target !~* '(password|secret|token|private|credential|api[_-]?key)' then
      details := details || jsonb_build_object('value',coalesce(new.value,old.value));
    else
      details := details || jsonb_build_object('value','[REDACTED]');
    end if;
  elsif tg_table_name = 'exercise_catalog' then
    target := coalesce(new.slug, old.slug);
    action_name := case when tg_op='INSERT' then 'exercise_created' when tg_op='UPDATE' then 'exercise_updated' else 'exercise_deleted' end;
    details := jsonb_build_object('name',coalesce(new.name,old.name),'active',coalesce(new.active,old.active));
  elsif tg_table_name = 'program_templates' then
    target := coalesce(new.id, old.id)::text;
    action_name := case when tg_op='INSERT' then 'program_created' when tg_op='UPDATE' then 'program_updated' else 'program_deleted' end;
    details := jsonb_build_object('name',coalesce(new.name,old.name),'mode',coalesce(new.mode,old.mode),'active',coalesce(new.active,old.active));
  else
    return coalesce(new, old);
  end if;

  insert into public.admin_audit_log(actor_id,action,target_type,target_id,details)
  values(actor,action_name,tg_table_name,target,details);
  return coalesce(new, old);
end;
$$;

revoke all on function public.ap_audit_admin_table_change() from public, anon;
grant execute on function public.ap_audit_admin_table_change() to authenticated;

drop trigger if exists ap_audit_app_settings on public.app_settings;
create trigger ap_audit_app_settings
after insert or update or delete on public.app_settings
for each row execute function public.ap_audit_admin_table_change();

drop trigger if exists ap_audit_exercise_catalog on public.exercise_catalog;
create trigger ap_audit_exercise_catalog
after insert or update or delete on public.exercise_catalog
for each row execute function public.ap_audit_admin_table_change();

drop trigger if exists ap_audit_program_templates on public.program_templates;
create trigger ap_audit_program_templates
after insert or update or delete on public.program_templates
for each row execute function public.ap_audit_admin_table_change();

-- 4) Pastikan audit table tetap tidak dapat ditulis langsung oleh client.
revoke all on table public.admin_audit_log from anon, authenticated;
grant select on public.admin_audit_log to authenticated;

commit;
