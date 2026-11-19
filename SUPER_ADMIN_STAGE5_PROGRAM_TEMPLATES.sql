-- ATHLETIC PHYSIQUE — SUPER ADMIN STAGE 5: PROGRAM TEMPLATES
-- Jalankan setelah SUPER_ADMIN_SETUP.sql.
-- Aman dijalankan ulang.

begin;

create table if not exists public.program_templates (
  id uuid primary key default gen_random_uuid(),
  slug text not null check (slug ~ '^[a-z0-9][a-z0-9-]{0,79}$'),
  name text not null,
  level text not null default 'Pemula' check (level in ('Pemula','Menengah','Lanjutan','Expert')),
  focus text,
  mode text not null default 'both' check (mode in ('gym','home','both')),
  days jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  updated_at timestamptz not null default now()
);

create unique index if not exists program_templates_slug_uidx on public.program_templates(slug);
create unique index if not exists program_templates_name_uidx on public.program_templates(lower(name));
create index if not exists program_templates_active_name_idx on public.program_templates(active, name);

alter table public.program_templates enable row level security;

drop policy if exists "ap_program_templates_read_active" on public.program_templates;
create policy "ap_program_templates_read_active"
on public.program_templates for select to authenticated
using (active = true or public.ap_is_admin());

drop policy if exists "ap_admin_program_templates_manage" on public.program_templates;
create policy "ap_admin_program_templates_manage"
on public.program_templates for all to authenticated
using (public.ap_is_admin())
with check (public.ap_is_admin());

grant select, insert, update, delete on public.program_templates to authenticated;

commit;
