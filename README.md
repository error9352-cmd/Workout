# Athletic Physique — Live Server Safe Refactor

This version is a safe structural extraction from the original `index.html`.

- The HTML markup is preserved.
- CSS is split into 6 files in original cascade order.
- Each original inline JavaScript block is extracted into its own file in original execution order.
- The large application core remains intact in `assets/js/00-app-core.js`.
- Supabase remains an external CDN dependency.
- No application logic was rewritten or renamed.

## Run
Open this folder in VS Code and use Live Server on `index.html`.

Do not open `index.html` by double-clicking if you want the same browser behavior as the development server.

## Tahap 2B — Feature Candidates

Fungsi dari `00-app-core.js` telah dipetakan ke kandidat feature module:
`features/workout.js`, `features/progress.js`, `features/history.js`,
`features/profile.js`, dan `features/ui.js`.

Kandidat tersebut **belum dimuat oleh `index.html` dan belum dihapus dari
`00-app-core.js`**. Ini sengaja agar versi yang sudah normal di Live Server
tetap identik. Setelah dependency review, fungsi akan dipindahkan satu kelompok
pada satu waktu dan diuji kembali.

## Tahap 2C — Core Utilities Extraction Preparation

Tahap ini menyiapkan lapisan utility yang paling aman untuk dipindahkan:
fungsi yang tidak memanggil fungsi aplikasi lain dan tidak bergantung langsung
pada state utama, render, localStorage, Supabase, atau DOM.

Fungsi tersebut disalin ke `assets/js/core/standalone-candidates.js` untuk
review. **Belum dihapus dari `00-app-core.js` dan belum dimuat oleh index.html**,
sehingga perilaku versi yang sudah normal tetap tidak berubah.

Langkah berikutnya adalah memindahkan kandidat yang benar-benar bebas
dependency satu per satu ke ES module, kemudian menghapus duplikat dari core
setelah verifikasi.

## Tahap 2D — First Active Utility Extraction

`wtText()` dan `est1()` sekarang benar-benar dipindahkan dari
`00-app-core.js` ke `assets/js/core/utils.js`.

`utils.js` dimuat sebelum `00-app-core.js`, sehingga fungsi tetap tersedia
dengan nama global yang sama dan pemanggil lama tidak perlu diubah. Ini adalah
pemindahan aktif pertama; utility lain belum dipindahkan sampai dependency-nya
terverifikasi.


## Home Workout terintegrasi

Exercise Library kini memiliki filter lokasi **Semua lokasi / Gym / Home Workout** dan filter peralatan **Semua alat / Tanpa alat / Resistance Band / Dumbbell**. Home Workout menambahkan 28 gerakan untuk dada, punggung, bahu, lengan, kaki, core, dan kardio. Gerakan yang relevan untuk kedua tempat ditandai **Gym + Home**. Katalog Gym, program, riwayat, dan data pengguna lama tetap dipertahankan.

Beberapa variasi gerakan baru memakai ilustrasi referensi dari gerakan dasar yang paling dekat; kartu menandainya sebagai **Ilustrasi referensi** agar tidak disalahartikan sebagai foto langkah teknik yang persis sama.

## Supabase configuration

- Browser connection values are centralized in `assets/js/supabase-config.js`.
- Run `SUPER_ADMIN_SETUP.sql` in the matching Supabase project's SQL Editor to create the full application schema, auth-profile triggers, RPC, grants, and RLS policies.
- Follow `SUPABASE_CONFIGURATION_GUIDE.md` for Authentication URLs, email confirmation, Google OAuth setup, first-admin bootstrap, and end-to-end checks. Current local Live Server port: `5502` (adjust Supabase/Google allowlists if the port changes).
- Never put a Supabase `service_role` / secret key in frontend code. The browser uses only the public publishable key.

## Panduan wajib sebelum update AI

- Baca `AI_UPDATE_INSTRUCTIONS.md` dan `PROJECT_GUIDE.md` sebelum mengubah source.
- Baca `FEATURE_INTEGRATION_REGISTRY.md` sebelum menambah atau mengubah fitur.
- Setiap fitur baru/perubahan harus memperbarui registry, Project Guide, dependency map, QA, dan status kontrol Super Admin dalam update yang sama. Toggle Super Admin harus dikunci jika runtime gate belum tersedia.
- Jangan reset Supabase atau mengubah data/RLS yang sudah ada tanpa migrasi aman dan persetujuan.
