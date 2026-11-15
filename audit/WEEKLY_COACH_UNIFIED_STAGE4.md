# Weekly Coach Unified Integration — Stage 4

## Tujuan
Menghubungkan Weekly Coach dengan Unified Weekly Adaptation dan Unified Adaptive Engine sehingga keputusan mingguan tidak berhenti sebagai informasi, tetapi menjadi jembatan ke perubahan workout berikutnya.

## Implementasi
- `assets/js/47-weekly-coach-unified-integration.js`
- Weekly Coach v2 membaca canonical `apTraining` melalui engine yang sudah ada.
- Gym memakai `apGymIntelligence.weekly()` untuk keputusan mingguan Gym.
- Home Gym memakai `apHomeGymWeeklyAdaptation.collect()/decide()` untuk keputusan mingguan Home Gym.
- `apUnifiedAdaptive.run(mode)` dijalankan sebagai lapisan exercise-level adaptation.
- Rotasi `stagnant` dan `too_hard` benar-benar diterapkan pada program berikutnya.
- Perubahan program tidak mengubah sesi historis.
- Weekly Coach menampilkan perubahan rotasi yang benar-benar diterapkan, bukan sekadar rekomendasi.
- Label keputusan tetap memakai bahasa pengguna: Naikkan Progres, Pertahankan & Progres, Kurangi Volume, Rotasi Gerakan, Deload / Pemulihan.

## Proteksi
- Tidak membuat sumber data sesi kedua.
- Tidak menulis ulang sesi historis.
- Tidak memaksa rotasi jika tidak ada kandidat valid.
- Gym dan Home Gym tetap memakai kandidat exercise masing-masing.
- Engine tetap resilient bila salah satu mode tidak tersedia.

## Verifikasi
- Syntax check dilakukan pada file Stage 4.
- Arsip final diuji dengan `unzip -t`.
