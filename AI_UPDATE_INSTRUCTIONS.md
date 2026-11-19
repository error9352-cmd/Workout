# AI Update Instructions — Athletic Physique

Dokumen ini adalah instruksi wajib setiap kali AI (ChatGPT, Claude, atau coding agent lain) diminta memperbarui aplikasi Athletic Physique.

## 1. Baca dan pahami project sebelum mengedit

1. Baca `README.md`, `PROJECT_GUIDE.md`, `SUPABASE_CONFIGURATION_GUIDE.md`, `ADMIN_SETUP_README.md`, dan dokumen audit yang relevan sebelum mengubah kode.
2. Periksa `index.html` untuk mengetahui file CSS/JavaScript yang benar-benar dimuat dan urutan pemuatannya. Jangan berasumsi semua file yang ada di folder `assets/` aktif digunakan.
3. Identifikasi versi dan alur runtime yang sedang aktif. Dokumentasi bisa tertinggal dari source code; jika ada konflik, verifikasi source aktual dan jelaskan perbedaannya.
4. Buat perubahan sekecil mungkin dan terarah. Jangan melakukan refactor besar, mengganti framework, atau menulis ulang aplikasi kecuali diminta secara eksplisit.

## 2. Supabase adalah backend utama — lindungi konfigurasi yang sudah ada

Aplikasi menggunakan Supabase untuk autentikasi, profil, penyimpanan data pengguna, sinkronisasi cloud, dan fitur Super Admin.

Aturan wajib:

- Pertahankan project Supabase yang sudah terhubung. Jangan mengganti Supabase project URL atau publishable/anon key yang sudah ada.
- Konfigurasi browser berada di `assets/js/supabase-config.js` (periksa path aktual jika struktur berubah). Jangan menghapus file ini atau mengubah nilai koneksi tanpa instruksi eksplisit dari pemilik aplikasi.
- Publishable/anon key memang boleh digunakan di browser. **Jangan pernah memasukkan `service_role` key, secret key, database password, OAuth client secret, atau kredensial privat ke HTML, JavaScript, CSS, repository publik, atau ZIP frontend.**
- Jangan menonaktifkan Supabase, mengganti backend, atau menghapus mekanisme fallback/local storage tanpa persetujuan.
- Pertahankan kompatibilitas dengan tabel, kolom, RPC, trigger, grants, dan RLS policies yang sudah berjalan.
- Jangan menghapus, truncate, reset, atau menimpa data pengguna yang sudah tersimpan.
- Jangan menjalankan atau menyarankan SQL destruktif sebagai bagian dari update rutin.

## 3. Authentication, Google OAuth, dan session

- Pertahankan login, pendaftaran, logout, pemulihan sesi, email confirmation, dan Google OAuth yang sudah ada.
- Jangan mengganti nama provider, callback flow, redirect handling, atau konfigurasi auth tanpa alasan teknis dan penjelasan.
- Jika domain/port development, Site URL, Redirect URLs, provider OAuth, callback, atau langkah setup berubah, perbarui `SUPABASE_CONFIGURATION_GUIDE.md`, `ADMIN_SETUP_README.md`, dan bagian backend terkini di `PROJECT_GUIDE.md` agar dokumentasi di dalam ZIP tetap sesuai. Port Live Server saat ini `5502`, tetapi jangan menganggap port ini permanen jika pemilik mengubahnya.
- Jangan menaruh Google OAuth Client Secret di frontend. Secret hanya dikelola melalui Supabase Dashboard/provider configuration.
- Jangan menganggap perubahan URL localhost membutuhkan perubahan database. Perubahan port/domain biasanya cukup disesuaikan pada Supabase Authentication URL Configuration dan Google Cloud OAuth origins/redirects.
- Pastikan user yang login tetap mendapatkan identitas Supabase yang benar dan sesi tidak hilang setelah refresh.

## 4. Role User dan Admin / Super Admin

- Pendaftaran publik harus menghasilkan role `user` secara default.
- Jangan pernah menyediakan cara bagi pengguna publik untuk memilih atau mengubah role menjadi `admin` saat mendaftar.
- Hanya admin yang berwenang boleh mengelola role sesuai mekanisme server-side/RPC yang telah tersedia.
- Pertahankan pembatasan akses dashboard Super Admin dan pemeriksaan otorisasi di backend/RLS. Menyembunyikan tombol di UI saja bukan pengamanan yang cukup.
- Jangan memperlonggar RLS agar semua pengguna dapat membaca atau mengubah data pengguna lain.
- Jangan menambahkan kemampuan menaikkan role hanya dengan mengubah localStorage, metadata client, atau request frontend.

## 5. Data pengguna dan sinkronisasi cloud

- Data setiap pengguna harus tetap terisolasi berdasarkan Supabase authenticated user ID (`user_id` / `auth.uid()` sesuai skema).
- Pertahankan alur local-to-cloud dan cloud-to-local sync yang ada, termasuk penanganan konflik dan status login.
- Fitur workout baru harus menggunakan mekanisme penyimpanan/sinkronisasi yang konsisten dengan arsitektur aktif; jangan membuat penyimpanan duplikat tanpa kebutuhan yang jelas.
- Pastikan data lama tetap dapat dibaca setelah update. Jika bentuk data berubah, buat migrasi yang kompatibel ke belakang dan jelaskan strategi rollback.
- Jangan menghapus riwayat workout, program, profil, pengukuran, foto progres, atau preferensi pengguna.

## 5A. Login, Cloud Hydration, dan Program Latihan — KONTRAK WAJIB

Urutan boot/auth aktif wajib dipertahankan:

1. `00-app-core.js` membangun UI dan memuat cache lokal awal. Pada fase ini data belum boleh dianggap final untuk akun yang sedang login.
2. `24-patch.js` memeriksa sesi Supabase, memastikan antrean sinkronisasi milik UID yang benar, lalu menjalankan push/pull sesuai kontrak.
3. Hanya setelah proses pull akun selesai, `24-patch.js` mengubah `window.__AP_CLOUD_AUTH_PENDING` menjadi `false` dan mengirim event `ap:cloud-ready`.
4. Onboarding/welcome wizard wajib menunggu `ap:cloud-ready` saat auth/hydration sedang berlangsung. Jangan pernah membuka wizard berdasarkan localStorage awal sebelum cloud pull selesai.
5. Setelah cloud pull menulis key ke localStorage, modul yang menyimpan cache global di memori wajib dihidrasi ulang. Saat ini `window.apApplyHydratedStorage(keys)` memperbarui `PROG` dari `ap_prog`, `weights` dari `ap_weights`, tema dari `ap_theme`, lalu render ulang.

Aturan data program:
- `ap_prog` adalah sumber data program latihan mingguan dan program custom. Jangan membuat program default/onboarding lalu mengirimkannya ke cloud sebelum memastikan akun sudah selesai di-hydrate.
- Jangan menghapus atau mengganti `ap_prog` hanya karena nilainya belum tersedia pada fase boot awal. Bedakan `belum selesai dimuat` dari `akun benar-benar kosong`.
- Jangan melakukan `location.reload()` sebagai mekanisme normal untuk menerapkan hasil pull. Gunakan hydration hook agar `PROG` dan cache global lain tidak tertinggal dari localStorage. Reload hanya boleh dipakai untuk kasus khusus yang dijelaskan dan diberi guard.
- Setiap key baru yang disimpan dalam variabel global/cache wajib ditambahkan ke `apApplyHydratedStorage` dan daftar pengujian hydration.
- Key metadata lokal `ap_sb_*` tidak boleh diunggah sebagai data pengguna dan tidak boleh ikut terhapus saat pergantian akun menghapus cache data aplikasi.
- Jangan mengubah UID, queue owner, atau dirty queue tanpa memastikan data antrean berasal dari akun yang sama. Jangan pernah push data default/akun lain ke UID yang baru login.

Regression test wajib setelah mengubah auth, onboarding, program, atau storage:
- Akun yang sudah memiliki `ap_prog` tidak boleh melihat welcome wizard saat login/refresh.
- Program mingguan dan custom program harus tampil setelah cloud pull tanpa reload manual.
- Login lambat (simulasikan pull tertunda) tidak boleh membuka onboarding sebelum `ap:cloud-ready`.
- Akun cloud kosong boleh melihat onboarding hanya setelah status kosong terkonfirmasi dan user menyelesaikan pilihan akun.
- User A dan User B tidak boleh saling melihat atau menimpa `ap_prog`; antrean offline harus tetap terikat ke UID asal.
- Refresh setelah login harus mempertahankan program yang sama.

## 6. Jika fitur baru membutuhkan perubahan database

Jangan mengulang setup Supabase dari awal. Sebagai gantinya:

1. Periksa skema dan kebijakan yang sudah ada terlebih dahulu.
2. Buat file migrasi SQL tambahan dengan nama berurutan dan deskriptif, misalnya `migrations/2026-11-18_add_new_feature.sql`.
3. Migrasi harus idempotent bila memungkinkan (`IF NOT EXISTS`, pemeriksaan constraint/policy, dan pola aman sejenis).
4. Tambahkan grants dan RLS policies minimum yang diperlukan. Terapkan prinsip least privilege.
5. Jangan menghapus atau mengganti policy yang sudah ada tanpa analisis dampak dan persetujuan eksplisit.
6. Jangan menjalankan migrasi secara otomatis dari browser/frontend.
7. Sertakan instruksi lokasi menjalankan SQL, dampak, prasyarat, verifikasi, dan rollback.
8. Jika perubahan bisa dilakukan tanpa mengubah skema, pilih solusi tanpa migrasi.

## 7. Aturan menjaga struktur dan fungsi aplikasi

- Pertahankan struktur HTML/CSS/JavaScript vanilla dan pola global yang sedang digunakan, kecuali pemilik meminta perubahan arsitektur.
- Pertahankan urutan script di `index.html`; beberapa patch bergantung pada global/function yang dibuat oleh file sebelumnya.
- Jangan menghapus file hanya karena terlihat duplikat atau tidak digunakan sebelum memastikan referensi runtime dan dependency-nya.
- Jangan mengubah ID elemen, nama fungsi global, localStorage keys, event attributes, atau format data yang dipakai modul lain tanpa menelusuri semua pemanggil.
- Pertahankan fitur Gym dan Home Workout, program latihan, workout aktif/resume, pencatatan set, rest timer/notifikasi, progres, riwayat, profil, dan fitur lain yang sudah ada.
- Pertahankan PWA/service worker/manifest bila update menyentuh aset atau cache. Perbarui cache version bila memang diperlukan dan pastikan tidak menyebabkan aplikasi menyajikan file lama.
- Jangan mengganti desain atau perilaku fitur yang tidak diminta.


## 7A. Feature Integration Registry — WAJIB DIPERBARUI

Sebelum mengedit fitur, baca `FEATURE_INTEGRATION_REGISTRY.md`. Setiap kali menambah, mengubah, memindahkan, atau menghapus fitur, AI wajib: 

1. Memetakan entry point runtime, API/global/event, script order, dependency, seluruh pembaca/penulis data, dan fallback.
2. Memperbarui registry dengan file terkait, key konfigurasi, status runtime, data contract, dan dependensi.
3. Memperbarui Super Admin pada update yang sama. Tambahkan kontrol hanya jika toggle benar-benar terhubung ke runtime. Jika belum, tampilkan status **Belum terhubung** dan nonaktifkan toggle sampai gate runtime selesai.
4. Memastikan fitur baru tercatat di Super Admin/Feature Registry dan System Health/QA bila relevan; jangan hanya menambahkan label UI tanpa implementasi.
5. Memperbarui `PROJECT_GUIDE.md`, `FEATURE_INTEGRATION_REGISTRY.md`, dan dokumen backend terkait secara sinkron.
6. Menguji fitur baru dan fitur yang berbagi key/API/data dengannya. Cari konflik penulisan, wrapper ganda, script order, dan perubahan schema.
7. Melaporkan secara eksplisit item yang belum terhubung atau belum diuji; jangan menandainya selesai hanya karena data setting tersimpan di Supabase.

## 8. Prosedur kerja setiap update

Sebelum mengedit:

- Nyatakan pemahaman terhadap permintaan dan file yang terdampak.
- Periksa dependency dan alur data terkait.
- Catat risiko terhadap auth, database, RLS, sinkronisasi, dan data lama.

Saat mengedit:

- Buat backup/patch terarah bila sesuai.
- Jangan menimpa file konfigurasi backend dengan placeholder.
- Jangan mengubah file yang tidak relevan.

Setelah mengedit, lakukan pemeriksaan yang tersedia:

- Validasi sintaks JavaScript dan struktur HTML/CSS yang diubah.
- Jalankan `node audit/verify-integration.js` untuk regression gate integrasi Supabase, workout model, Super Admin, dan runtime config; perbarui harness jika kontrak berubah.
- Jalankan `node audit/program-hydration-regression.js` setiap kali mengubah login, onboarding, `ap_prog`, localStorage hydration, atau alur Supabase pull.
- Pastikan referensi file dan urutan script tetap benar.
- Uji atau jelaskan cara menguji login email/password dan Google OAuth.
- Uji akses User biasa dan Admin; User tidak boleh melihat/mengubah data pengguna lain.
- Uji simpan workout, refresh, logout/login, dan sinkronisasi cloud.
- Uji fitur yang diminta serta regresi pada fitur terkait.
- Jika tidak dapat menjalankan browser atau mengakses Supabase, katakan dengan jelas bahwa pengujian tersebut belum dilakukan. Jangan mengklaim sukses tanpa bukti.

## 9. Output yang wajib diberikan AI setelah update

Sertakan:

1. Ringkasan perubahan yang benar-benar dilakukan.
2. Daftar file yang diubah/ditambahkan/dihapus.
3. Konfirmasi apakah konfigurasi Supabase, auth, role, RLS, dan struktur database dipertahankan.
4. SQL migration tambahan (hanya jika diperlukan) beserta langkah menjalankannya.
5. Hasil pemeriksaan/pengujian dan bagian yang belum bisa diuji.
6. ZIP aplikasi lengkap yang siap diuji, bukan hanya potongan file, jika pengguna meminta ZIP.
7. Peringatan eksplisit jika ada langkah manual di Supabase atau Google Cloud.

## 10. Prinsip utama

**Update fitur aplikasi tanpa mereset backend. Jaga data pengguna. Jaga keamanan. Pertahankan kompatibilitas. Jangan mengubah konfigurasi Supabase atau database kecuali memang diperlukan dan dijelaskan terlebih dahulu.**
