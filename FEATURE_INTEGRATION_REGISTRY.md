# Athletic Physique — Feature Integration Registry

Dokumen ini adalah daftar kendali integrasi fitur. **Setiap fitur baru, perubahan fitur, atau penghapusan fitur wajib memperbarui registry ini dan tampilan Super Admin pada commit/update yang sama.** Jangan menganggap sebuah fitur terpantau hanya karena namanya muncul di dashboard.

## Status runtime saat ini (19 November 2026)

| Feature key | Area / entry point | Runtime status | Super Admin | Data / dependency utama |
|---|---|---|---|---|
| `maintenance_mode` | `assets/js/64-app-config.js` | Terhubung: overlay maintenance; admin tetap dapat mengakses control center | Toggle aktif | `app_settings`, RPC `ap_get_runtime_config` |
| `allow_registration` | `assets/js/24-patch.js` | Terhubung: menolak `signUp` email dan memblokir Google OAuth saat OFF agar OAuth tidak menjadi jalur pendaftaran alternatif; konsekuensinya login Google pengguna lama juga sementara tertutup saat registrasi ditutup | Toggle aktif | Supabase Auth, runtime config RPC |
| `allow_google_login` | `assets/js/24-patch.js` | Terhubung: menolak OAuth Google saat OFF | Toggle aktif | Supabase Auth Google provider, runtime config RPC |
| `weekly_coach_enabled` | `assets/js/00-app-core.js` | Terhubung: kartu Weekly Coach disembunyikan saat OFF | Toggle aktif | `weeklyCoach()`, `apWeeklyCoach`, `app_settings` |
| `auto_resume_workout` | `assets/js/00-app-core.js` | Belum terhubung sebagai runtime gate | Dikunci / read-only | `ap_active`, workout resume UI |
| `smart_program_enabled` | `assets/js/45-gym-smart-program.js` | Belum terhubung sebagai runtime gate | Dikunci / read-only | `apGymSmartProgram`, Gym program flow |
| `adaptive_workout_enabled` | `assets/js/46-unified-adaptive-engine.js` | Belum terhubung sebagai runtime gate | Dikunci / read-only | `apUnifiedAdaptive`, `PROG`, Gym/Home Gym |
| `intelligence_enabled` | `assets/js/44-unified-training-intelligence.js` | Belum terhubung sebagai master runtime gate | Dikunci / read-only | Unified Intelligence + downstream consumers |

## Kontrak wajib untuk setiap fitur baru/perubahan

1. **Runtime:** catat file entry point, API/global/event, kondisi enable/disable, fallback jika config tidak tersedia, dan urutan script.
2. **Data:** catat localStorage key, IndexedDB store, Supabase table/kolom/RPC, format data, migrasi, backup/restore, dan strategi kompatibilitas data lama.
3. **Dependencies:** perbarui `assets/js/features/dependency-map.json` bila sesuai; cari semua pembaca/penulis key dan pemanggil API sebelum mengubah kontrak.
4. **Super Admin:** tambahkan atau perbarui kartu fitur hanya jika kontrolnya benar-benar memengaruhi runtime. Sertakan key yang sama, default, status runtime, deskripsi, serta audit event bila pengaturan mengubah perilaku penting. Jika belum terhubung, tampilkan status belum terhubung dan kunci toggle—jangan memberi ilusi bahwa kontrol bekerja.
5. **Backend/security:** tinjau RLS, grants, RPC, role, dan isolasi `user_id`. Jangan memberikan akses lintas pengguna kepada client biasa. Akses admin lintas pengguna hanya untuk fungsi monitoring yang memang diizinkan RLS.
6. **Project guide:** perbarui `PROJECT_GUIDE.md`, `AI_UPDATE_INSTRUCTIONS.md`, `SUPABASE_CONFIGURATION_GUIDE.md` (jika backend berubah), dan registry ini dalam update yang sama.
7. **QA:** tambah pemeriksaan pada QA/health monitor untuk kontrak fitur yang diubah. Uji fitur, fitur tetangga, login/logout, refresh, data lama, dan Super Admin.

## Definisi status

- **Terhubung:** kontrol Super Admin terbukti memengaruhi perilaku runtime melalui sumber konfigurasi yang terdokumentasi.
- **Belum terhubung:** pengaturan atau modul ada, tetapi tidak ada gate runtime yang terbukti. Kontrol Super Admin wajib dikunci sampai integrasi selesai.
- **Perlu verifikasi:** implementasi ada tetapi belum dapat dibuktikan melalui tes yang tersedia. Jangan tampilkan sebagai lulus.

## Prinsip data multi-user

- `user_data` memakai primary key `(user_id, key)`.
- Sinkronisasi akun biasa harus membaca hanya baris dengan `user_id` milik sesi aktif, meskipun policy RLS memberi admin kemampuan monitoring lintas pengguna.
- Jangan memindahkan data pengguna lain ke localStorage browser admin.
- Admin dashboard boleh membaca seluruh data hanya melalui sesi admin yang tervalidasi dan policy RLS admin.
- Antrean sync lokal wajib terikat pada pemilik akun; antrean tidak boleh dikirim ulang di bawah UID akun lain.


## Auth Hydration & Workout Program Restore (2026-11-19)

- **Runtime entry points:** `assets/js/24-patch.js` (Supabase auth/session and user_data sync), `assets/js/00-app-core.js` (PROG/weights memory caches), `assets/js/10-patch.js` (welcome/onboarding wizard).
- **Persisted keys:** `ap_prog` (weekly/custom programs), `ap_profile`, `ap_weights`, plus other user `ap_*` keys. Local-only sync metadata uses `ap_sb_*` and must never be uploaded as user data.
- **Events/globals:** `window.__AP_CLOUD_AUTH_PENDING`, `window.__AP_CLOUD_READY`, event `ap:cloud-ready`, and `window.apApplyHydratedStorage(changedKeys)`.
- **Contract:** onboarding waits for auth ownership and cloud pull; restored `ap_prog` and other cached globals are applied before onboarding checks state. Standard cloud pull rehydrates in memory and renders without forced reload.
- **UID boundary:** every pull filters `user_data.user_id` by authenticated UID; dirty queue remains bound to its owner UID.
- **Super Admin relation:** Super Admin may inspect user data under authorized policies, but must not alter user program keys or local auth metadata.
- **Regression gate:** `node audit/program-hydration-regression.js`; existing-program login/refresh, delayed pull gate, memory hydration without reload, empty-cloud onboarding, two-account program isolation, and failed-pull non-overwrite.
- **Status:** implementation updated; static checks and local harness are required. Real browser/Supabase two-account verification remains a deployment test.
