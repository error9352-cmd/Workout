# Athletic Physique — Panduan Konfigurasi Supabase

Proyek ini sudah diarahkan ke proyek Supabase yang sebelumnya tertanam di aplikasi:

- Project URL: `https://tgbqtpmrkyfitvxchcwp.supabase.co`
- Browser key: publishable key (`sb_publishable_...`)
- Client SDK: `@supabase/supabase-js` v2.58.0

## 1. File konfigurasi aplikasi

Kredensial publik berada di `assets/js/supabase-config.js`:

```js
window.AP_SUPABASE_CONFIG = Object.freeze({
  url: 'https://tgbqtpmrkyfitvxchcwp.supabase.co',
  publishableKey: 'sb_publishable_C3nUA9n1BQKEImk145vXmg_VXVgpDDi'
});
```

Jika memakai proyek Supabase lain, ganti `url` dan `publishableKey` dengan nilai dari **Supabase Dashboard → Project Settings → API**. Publishable/anon key memang boleh berada di frontend jika RLS aktif. **Jangan pernah memasukkan `service_role` atau secret key** ke file JavaScript, HTML, GitHub, atau browser.

Urutan runtime yang benar pada arsip ini: `index.html` memuat Supabase JS CDN v2.58.0, `assets/js/supabase-config.js`, `assets/js/24-patch.js` (auth + cloud sync), kemudian `assets/js/61-super-admin.js` (dashboard admin). File `assets/js/25-supabase-auth-sync.js` dan `assets/js/24-supabase-cdn.js` adalah file paralel/arsip yang **tidak dimuat** oleh `index.html`. File `24-supabase-cdn.js` hanya placeholder JavaScript no-op; CDN aktif dimuat langsung oleh `index.html`. Jangan mengedit file yang tidak aktif dengan asumsi perubahan akan berlaku di aplikasi.

## 2. Buat seluruh tabel, trigger, fungsi, dan RLS

1. Buka Supabase Dashboard untuk project yang URL-nya sama dengan file konfigurasi.
2. Pilih **SQL Editor → New query**.
3. Buka `SUPER_ADMIN_SETUP.sql`, salin seluruh isinya, lalu jalankan.
4. Pastikan eksekusi berakhir dengan `Success`.

SQL menyiapkan:

| Objek | Kegunaan |
|---|---|
| `public.user_data` | Penyimpanan seluruh key `ap_*` per pengguna, format JSONB |
| `public.profiles` | Profil akun dan role `user` / `admin` |
| `public.app_settings` | Pengaturan global aplikasi dalam JSONB |
| `ap_handle_auth_user()` + trigger | Membuat/memperbarui profil ketika akun Auth dibuat atau email/metadata berubah |
| `ap_is_admin()` | Pemeriksaan role admin yang aman untuk RLS |
| `admin_set_user_role()` | RPC untuk mengubah role melalui dashboard |
| RLS policies | Pemilik hanya mengakses datanya; admin dapat membaca data seluruh akun |

Migration ini mengganti policy RLS yang sudah ada pada tiga tabel aplikasi (`user_data`, `profiles`, `app_settings`) agar policy lama yang terlalu permisif tidak ikut membuka akses. Jika tabel-tabel tersebut punya policy khusus buatan sendiri, simpan/review dulu sebelum menjalankan SQL.

## 3. Jadikan akun pertama sebagai Super Admin

1. Jalankan aplikasi dan daftar/login dengan email yang akan menjadi Super Admin.
2. Pastikan akun terlihat di **Authentication → Users**.
3. Kembali ke SQL Editor dan jalankan perintah berikut dengan email akun tersebut:

```sql
update public.profiles
set role = 'admin', updated_at = now()
where lower(email) = lower('EMAIL_ADMIN_ANDA@example.com');
```

Pastikan hasilnya memperbarui **1 row**. Muat ulang aplikasi dan login ulang. Tombol **SUPER ADMIN** akan muncul setelah role terbaca.

Pendaftaran biasa selalu membuat role `user`; jangan menaruh mekanisme promosi admin di frontend.

## 4. Pengaturan Authentication

Di **Authentication → URL Configuration**:

- Site URL: alamat utama tempat aplikasi benar-benar di-host.
- **Site URL:** gunakan URL utama aplikasi yang benar-benar dipakai. Jika belum ada hosting produksi dan hanya menguji lokal, sementara boleh gunakan `http://127.0.0.1:5502/`. Jika aplikasi sudah online, gunakan URL produksi sebagai Site URL.
- **Redirect URLs:** tambahkan setiap origin/path yang dipakai untuk development dan production. Untuk Live Server yang saat ini digunakan:
  - `http://127.0.0.1:5502/**`
  - `http://localhost:5502/**`
- Jika port Live Server berubah, sesuaikan port pada kedua URL tersebut. Jangan menambahkan wildcard port; masukkan port yang benar.
- Untuk GitHub Pages, tambahkan URL deployment yang tepat, misalnya `https://USERNAME.github.io/NAMA-REPOSITORY/**` (ganti placeholder dengan URL situs sebenarnya).

Aplikasi OAuth mengarahkan pengguna kembali ke `window.location.origin + window.location.pathname`, jadi domain/path harus diizinkan pada Redirect URLs. Site URL bukan Google OAuth callback.

### Email + password

Auth email/password sudah dipakai oleh form Masuk/Daftar aplikasi. Jika **Confirm email** aktif, pengguna harus membuka tautan konfirmasi email sebelum bisa masuk. Untuk pengujian lokal, atur sesuai kebijakan keamanan project; untuk produksi, disarankan tetap memakai konfirmasi email dan konfigurasi SMTP yang benar.

### Google login (opsional)

Tombol Google sudah ada di aplikasi, tetapi provider harus diaktifkan di Supabase:

1. Buka **Authentication → Providers → Google** dan aktifkan.
2. Buat OAuth Client ID dan Client Secret di Google Cloud Console.
3. Masukkan Client ID/Secret ke provider Google di Supabase.
4. Di Google Cloud → Google Auth Platform → Clients → OAuth Web Client, masukkan origin lokal berikut pada **Authorized JavaScript origins**:
   - `http://127.0.0.1:5502`
   - `http://localhost:5502` (opsional jika juga mengakses lewat localhost)
   Tambahkan origin produksi jika aplikasi sudah online.
5. Tambahkan callback Supabase berikut sebagai **Authorized redirect URI** di Google Cloud (ini harus persis dan bukan URL localhost):
   `https://tgbqtpmrkyfitvxchcwp.supabase.co/auth/v1/callback`
6. Simpan. Uji tombol Google dari origin yang sudah dimasukkan ke Redirect URLs Supabase.

Client ID dan Client Secret Google dimasukkan ke Authentication → Providers → Google di Supabase. **Client Secret hanya disimpan di dashboard Supabase/Google Cloud**, bukan di source code aplikasi, file konfigurasi frontend, repository, atau ZIP.

## 5. Pengaturan API dan keamanan

- Pastikan schema `public` tersedia di Data API (pengaturan default Supabase).
- Frontend memakai publishable key; akses tabel dibatasi oleh RLS dan JWT pengguna.
- Jangan menonaktifkan RLS pada tabel aplikasi.
- Jangan memberikan akses `anon` ke tabel profil, data latihan, atau pengaturan admin.
- Untuk menghapus atau menonaktifkan akun Auth secara permanen, buat Edge Function/server endpoint terpisah. Jangan memakai service-role key di browser.

## 6. Pengujian setelah setup

- [ ] Daftar akun User baru → profil otomatis muncul di `public.profiles` dengan role `user`.
- [ ] Login email/password → sesi tersimpan dan akun terhubung.
- [ ] Google Provider aktif di Supabase dan OAuth Web Client menggunakan callback Supabase yang tepat.
- [ ] Google Login berhasil dari `http://127.0.0.1:5502/` (jika diuji melalui Live Server port 5502).
- [ ] Catat/perbarui latihan → baris `user_data` milik akun tersebut tersimpan.
- [ ] Login akun sama di browser/perangkat lain → data latihan ditarik dari cloud.
- [ ] Akun User tidak dapat membaca data pengguna lain atau tabel admin.
- [ ] Sinkronisasi browser admin hanya menarik `user_data` dengan `user_id` akun aktif; monitoring lintas akun hanya dilakukan oleh dashboard admin melalui RLS.
- [ ] Akun Super Admin melihat tombol dashboard.
- [ ] Dashboard Admin dapat memuat profil, ringkasan latihan, dan pengaturan global.
- [ ] Ubah role User lain → berhasil melalui RPC `admin_set_user_role`.
- [ ] User biasa tidak dapat memanggil RPC untuk mengubah role.

## Batasan yang perlu diketahui

- Dashboard Admin menampilkan hingga 500 profil dan 5.000 baris `user_data` per pemuatan; untuk skala besar perlu pagination dan agregasi server-side.
- `app_settings` merupakan penyimpanan pengaturan global. Feature flags yang runtime-wired per 19 Nov 2026: `maintenance_mode`, `allow_registration`, `allow_google_login`, dan `weekly_coach_enabled`. Saat `allow_registration=false`, Google OAuth juga diblokir agar pengguna baru tidak dapat melewati larangan registrasi; konsekuensinya login Google untuk akun lama ikut tertutup selama pengaturan tersebut OFF. `auto_resume_workout`, `smart_program_enabled`, `adaptive_workout_enabled`, dan `intelligence_enabled` belum terhubung dan toggle-nya dikunci pada Super Admin sampai implementasi runtime selesai. Periksa `FEATURE_INTEGRATION_REGISTRY.md` sebelum menambah/mengubah flag.
- Penghapusan akun Auth permanen belum tersedia dari dashboard karena memerlukan Edge Function yang aman.
- Konfigurasi file ini menggunakan project URL/key yang sudah ada di arsip. Saya tidak memiliki akses untuk masuk ke dashboard Supabase milik Anda atau memverifikasi konfigurasi provider/URL secara langsung.
