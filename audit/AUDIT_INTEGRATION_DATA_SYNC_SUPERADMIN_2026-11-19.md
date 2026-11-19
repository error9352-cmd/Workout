# Audit & Perbaikan Integrasi Data Sync, Workout Monitoring, dan Feature Control

Tanggal: 19 November 2026  
Basis: source ZIP `AthleticPhysique-WeeklyCoach-Integration-Fix.zip` yang sudah memuat perbaikan Weekly Coach sebelumnya.

## Temuan yang dikonfirmasi

1. `assets/js/24-patch.js` melakukan pull `user_data` tanpa filter `user_id`. Ini berisiko khususnya untuk akun admin karena policy RLS memang mengizinkan admin membaca seluruh baris untuk kebutuhan monitoring. Tanpa filter eksplisit, data akun lain dapat ikut ditulis ke localStorage browser admin. Ini bukan berarti RLS user biasa terbuka; policy pemilik tetap membatasi user biasa.
2. Model latihan aktif menyimpan sumber kanonis pada `ap_training_model_v1`; `ap_sessions` hanya compatibility projection melalui `36-training-data-model.js`. Super Admin hanya membaca `ap_sessions`, sehingga tidak membaca sumber fisik terbaru secara andal.
3. `flush()` tidak mengembalikan status keberhasilan yang dapat dipakai alur logout. Tombol logout tetap menghapus data lokal setelah mencoba push, termasuk ketika push gagal.
4. Antrean `sbq` sebelumnya berupa array key tanpa UID pemilik. Jika sesi akun berubah tanpa alur logout bersih, antrean berisiko diunggah dengan UID sesi yang berbeda.
5. Delapan feature flags ditampilkan seolah-olah seluruhnya terhubung. Pemeriksaan runtime menunjukkan hanya sebagian yang memiliki konsumen runtime yang terbukti.

## Perbaikan yang diterapkan

- Pull cloud sekarang menggunakan `.eq('user_id', uid)`.
- Queue `sbq` sekarang menyimpan `{uid, keys}`. Queue dengan UID yang tidak sama dengan sesi aktif tidak diputar ulang di bawah akun baru. Format queue lama tanpa UID memerlukan konfirmasi eksplisit bahwa akun aktif adalah pemilik data sebelum diunggah; jika dibatalkan, login dihentikan dan data lokal dipertahankan.
- `flush()` mengembalikan boolean, mempertahankan queue saat push gagal, dan logout diblokir sampai queue kosong. Jika `signOut` gagal, data lokal tidak dihapus.
- Super Admin membaca `ap_training_model_v1` sebagai sumber kanonis, dengan fallback `ap_sessions` per pengguna untuk data lama. Ringkasan set/volume membaca `kg`, `reps`, dan mengecualikan warm-up.
- Menambahkan pembaca detail sesi yang sesuai dengan struktur data kanonis.
- Runtime gate dihubungkan untuk `allow_registration` (termasuk blokir Google OAuth saat registrasi ditutup agar tidak menjadi jalur bypass), `allow_google_login`, dan `weekly_coach_enabled`; `maintenance_mode` tetap memakai implementasi sebelumnya. Konsekuensinya akun Google lama juga tidak dapat login saat registrasi ditutup.
- Feature flags `auto_resume_workout`, `smart_program_enabled`, `adaptive_workout_enabled`, dan `intelligence_enabled` diberi status belum terhubung dan toggle-nya dikunci pada Super Admin serta editor pengaturan generik. Ini mencegah pengaturan yang tersimpan tetapi tidak berpengaruh pada runtime.
- `64-app-config.js` mengekspos default config lebih awal, mengirim event ketika config cloud siap, dan memicu render ulang agar perubahan Weekly Coach diterapkan.
- Cache PWA dinaikkan ke `ap-v60-sync-admin-integrity`.
- Ditambahkan `FEATURE_INTEGRATION_REGISTRY.md` dan aturan wajib pembaruan di `AI_UPDATE_INSTRUCTIONS.md`, `AGENTS.md`, `PROJECT_GUIDE.md`, serta `SUPABASE_CONFIGURATION_GUIDE.md`.

## Pemeriksaan yang dijalankan

Perintah regresi yang dapat dijalankan ulang dari root project: `node audit/verify-integration.js`.

| Pemeriksaan | Hasil |
|---|---:|
| `node --check` seluruh JavaScript | 112 file, 0 error |
| Referensi script lokal di `index.html` | 69, 0 hilang |
| ID HTML statis ganda | 0 |
| Integration harness gabungan (`node audit/verify-integration.js`) | 18/18 lulus |

## Belum diverifikasi

- Belum menjalankan browser UI secara langsung.
- Belum menguji autentikasi dan transaksi pada project Supabase aktif.
- Belum menguji RLS menggunakan dua akun nyata (User dan Admin) atau melakukan pemeriksaan penetrasi.
- Belum menjalankan alur workout penuh dari mulai, pencatatan set, rest timer, penyelesaian, history, hingga perangkat kedua.
- Empat feature flags yang berstatus belum terhubung masih memerlukan implementasi runtime terpisah sebelum dapat diaktifkan.

## Dampak backend

Tidak ada perubahan schema, policy, RPC, atau data Supabase pada patch ini. Tidak perlu menjalankan SQL ulang. Runtime flags tetap memerlukan migrasi Stage 6 `SUPER_ADMIN_STAGE6_APP_CONFIG.sql` yang sudah disediakan proyek; jalankan hanya jika sebelumnya belum diterapkan.
