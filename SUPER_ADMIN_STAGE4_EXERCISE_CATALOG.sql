-- ATHLETIC PHYSIQUE — SUPER ADMIN STAGE 4: EXERCISE CATALOG
-- Jalankan setelah SUPER_ADMIN_SETUP.sql.
-- Aman dijalankan ulang.

begin;

create table if not exists public.exercise_catalog (
  slug text primary key check (slug ~ '^[a-z0-9][a-z0-9-]{0,79}$'),
  name text not null,
  category text,
  primary text,
  secondary text,
  equipment text,
  mode text not null default 'weight' check (mode in ('weight','bodyweight','time')),
  instructions jsonb not null default '[]'::jsonb,
  image text,
  image_status text not null default 'ready' check (image_status in ('ready','missing','review')),
  active boolean not null default true,
  updated_at timestamptz not null default now()
);

create unique index if not exists exercise_catalog_name_uidx on public.exercise_catalog(lower(name));
create index if not exists exercise_catalog_active_name_idx on public.exercise_catalog(active, name);

alter table public.exercise_catalog enable row level security;

drop policy if exists "ap_exercise_catalog_read_active" on public.exercise_catalog;
create policy "ap_exercise_catalog_read_active"
on public.exercise_catalog for select to authenticated
using (active = true or public.ap_is_admin());

drop policy if exists "ap_admin_exercise_catalog_manage" on public.exercise_catalog;
create policy "ap_admin_exercise_catalog_manage"
on public.exercise_catalog for all to authenticated
using (public.ap_is_admin())
with check (public.ap_is_admin());

grant select, insert, update, delete on public.exercise_catalog to authenticated;

commit;
