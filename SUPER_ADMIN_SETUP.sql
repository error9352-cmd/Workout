-- ============================================================================
-- ATHLETIC PHYSIQUE — COMPLETE SUPABASE DATABASE SETUP
-- Jalankan SATU KALI di Supabase Dashboard > SQL Editor.
-- Aman dijalankan ulang (idempotent) pada skema standar aplikasi ini.
-- Tidak memerlukan service_role key di browser.
-- ============================================================================

begin;

-- 1) DATA LATIHAN: satu baris per key localStorage untuk setiap pengguna.
create table if not exists public.user_data (
  user_id uuid not null references auth.users(id) on delete cascade,
  key text not null,
  value jsonb,
  updated_at timestamptz not null default now(),
  constraint user_data_pkey primary key (user_id, key)
);

-- Membantu instalasi yang sudah memiliki tabel user_data tanpa constraint PK.
alter table public.user_data add column if not exists user_id uuid;
alter table public.user_data add column if not exists key text;
alter table public.user_data add column if not exists value jsonb;
alter table public.user_data add column if not exists updated_at timestamptz not null default now();
create unique index if not exists user_data_user_id_key_uidx on public.user_data(user_id, key);
create index if not exists user_data_updated_at_idx on public.user_data(updated_at desc);

-- 2) PROFIL + ROLE. Role default selalu user; tidak dapat ditentukan dari metadata klien.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists profiles_created_at_idx on public.profiles(created_at desc);

create or replace function public.ap_handle_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles(id, email, display_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    'user'
  )
  on conflict (id) do update
    set email = excluded.email,
        display_name = coalesce(excluded.display_name, public.profiles.display_name),
        updated_at = now();
  return new;
end;
$$;

drop trigger if exists ap_on_auth_user_created on auth.users;
create trigger ap_on_auth_user_created
after insert on auth.users
for each row execute function public.ap_handle_auth_user();

drop trigger if exists ap_on_auth_user_updated on auth.users;
create trigger ap_on_auth_user_updated
after update of email, raw_user_meta_data on auth.users
for each row execute function public.ap_handle_auth_user();

-- Isi profil untuk akun yang sudah ada sebelum trigger dipasang.
insert into public.profiles(id, email, display_name, role)
select id, email,
       coalesce(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name'),
       'user'
from auth.users
on conflict (id) do update
  set email = excluded.email,
      display_name = coalesce(excluded.display_name, public.profiles.display_name),
      updated_at = now();

-- 3) PENGATURAN GLOBAL APLIKASI (JSONB).
create table if not exists public.app_settings (
  key text primary key check (key ~ '^[a-z][a-z0-9_]{1,60}$'),
  value jsonb not null default 'null'::jsonb,
  updated_at timestamptz not null default now()
);
insert into public.app_settings(key, value) values
  ('app_name', '"Athletic Physique"'::jsonb),
  ('maintenance_mode', 'false'::jsonb),
  ('allow_google_login', 'true'::jsonb),
  ('support_email', '""'::jsonb)
on conflict (key) do nothing;

-- 4) FUNGSI PEMERIKSA ADMIN. SECURITY DEFINER menghindari recursion policy profiles.
create or replace function public.ap_is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'admin'
  );
$$;
revoke all on function public.ap_is_admin() from public, anon;
grant execute on function public.ap_is_admin() to authenticated;

-- 5) RLS: default-deny lalu beri akses sesuai pemilik atau admin.
alter table public.user_data enable row level security;
alter table public.profiles enable row level security;
alter table public.app_settings enable row level security;

-- Bersihkan seluruh policy lama pada tabel aplikasi ini agar policy permisif
-- sebelumnya tidak tetap aktif (PostgreSQL menggabungkan policy permissive dengan OR).
do $$
declare pol record;
begin
  for pol in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in ('user_data', 'profiles', 'app_settings')
  loop
    execute format('drop policy if exists %I on %I.%I', pol.policyname, pol.schemaname, pol.tablename);
  end loop;
end;
$$;

-- User hanya membaca/menulis key miliknya. Admin boleh membaca semua untuk monitoring.
drop policy if exists "ap_user_data_select_own" on public.user_data;
create policy "ap_user_data_select_own" on public.user_data
for select to authenticated
using (user_id = (select auth.uid()));
drop policy if exists "ap_admin_read_all_user_data" on public.user_data;
create policy "ap_admin_read_all_user_data" on public.user_data
for select to authenticated
using (public.ap_is_admin());
drop policy if exists "ap_user_data_insert_own" on public.user_data;
create policy "ap_user_data_insert_own" on public.user_data
for insert to authenticated
with check (user_id = (select auth.uid()));
drop policy if exists "ap_user_data_update_own" on public.user_data;
create policy "ap_user_data_update_own" on public.user_data
for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));
drop policy if exists "ap_user_data_delete_own" on public.user_data;
create policy "ap_user_data_delete_own" on public.user_data
for delete to authenticated
using (user_id = (select auth.uid()));

-- Profil: user hanya dapat membaca profil sendiri; admin dapat membaca seluruh profil.
drop policy if exists "ap_profile_select_own" on public.profiles;
create policy "ap_profile_select_own" on public.profiles
for select to authenticated
using (id = (select auth.uid()));
drop policy if exists "ap_admin_read_all_profiles" on public.profiles;
create policy "ap_admin_read_all_profiles" on public.profiles
for select to authenticated
using (public.ap_is_admin());
-- Tidak ada policy INSERT/UPDATE/DELETE untuk klien pada profiles.
-- Role tidak bisa dinaikkan sendiri melalui REST API.

-- Hanya admin yang dapat membaca atau mengubah pengaturan global.
drop policy if exists "ap_admin_manage_app_settings" on public.app_settings;
create policy "ap_admin_manage_app_settings" on public.app_settings
for all to authenticated
using (public.ap_is_admin())
with check (public.ap_is_admin());

-- 6) RPC perubahan role. Admin tidak dapat mengubah role akunnya sendiri.
create or replace function public.admin_set_user_role(target_user_id uuid, new_role text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
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
  update public.profiles
     set role = new_role, updated_at = now()
   where id = target_user_id;
  if not found then
    raise exception 'User profile not found';
  end if;
end;
$$;
revoke all on function public.admin_set_user_role(uuid, text) from public, anon;
grant execute on function public.admin_set_user_role(uuid, text) to authenticated;

-- 7) GRANT SQL privileges. RLS tetap menjadi lapisan pembatas utama.
grant usage on schema public to authenticated;
grant select, insert, update, delete on public.user_data to authenticated;
grant select on public.profiles to authenticated;
grant select, insert, update, delete on public.app_settings to authenticated;

commit;

-- ============================================================================
-- BOOTSTRAP SUPER ADMIN — jalankan TERPISAH setelah akun berhasil mendaftar.
-- Ganti email di bawah dengan email akun milik Anda, lalu jalankan:
--
-- update public.profiles
-- set role = 'admin', updated_at = now()
-- where lower(email) = lower('EMAIL_ADMIN_ANDA@example.com');
--
-- Pastikan hasil UPDATE menunjukkan 1 row. Jangan pernah memberi role admin
-- berdasarkan input dari browser atau metadata pendaftaran.
-- ============================================================================
