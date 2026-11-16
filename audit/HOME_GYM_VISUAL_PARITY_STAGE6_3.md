# HOME GYM VISUAL PARITY — STAGE 6.3

## Tujuan
Menyamakan bahasa visual dan alur utama halaman Workout Home Gym dengan halaman Workout Gym tanpa menghilangkan karakteristik Home Gym seperti pemilihan peralatan.

## Perubahan
- Home Gym sekarang menggunakan struktur visual Workout yang sama dengan Gym untuk:
  - judul dan subjudul halaman;
  - pemilih hari/sesi (`dpick` / `dp`);
  - kartu `SIAP LATIHAN` (`workout-start-card`);
  - kartu detail program;
  - daftar `Semua program` berbasis row;
  - kartu peralatan aktif.
- Rekomendasi jadwal mingguan Home Gym menggunakan struktur `card` dan row yang konsisten dengan pola halaman Gym.
- Modal rekomendasi Home Gym menggunakan komponen visual rekomendasi yang sama dengan Gym (`schedule-recommendation-modal`, `sheet`, `chips`, dan `ap-recommend-day` / `ap-rec-*`).
- Home Gym tetap mempertahankan kontrol unik yang memang diperlukan: level, frekuensi, dan peralatan.
- Pemilihan sesi Home Gym sekarang dapat dilakukan dari day picker tanpa mengubah engine program.
- Tombol `Mulai` tetap memakai engine Home Gym yang sudah ada.

## Tidak diubah
- Engine Home Gym equipment-aware.
- Unified Intelligence.
- Weekly adaptation.
- Gym recommendation flow.
- Workout completion guard dan auto-resume.
- Struktur data workout yang sudah ada.

## Validasi
- `node --check assets/js/29-home-gym-workout-tab.js` — PASS
- Stage 16 Intelligence Audit — 12/12 PASS
- Stage 17 End-to-End Intelligence QA — 21/21 PASS
- ZIP integrity — PASS

## Catatan
Validasi browser visual/manual belum dijalankan pada environment ini. Perubahan ditujukan untuk menggunakan komponen visual Gym yang sudah ada, sehingga inspeksi manual di desktop dan mobile tetap menjadi langkah final sebelum deployment.
