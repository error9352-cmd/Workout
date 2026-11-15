# Unified Adaptive Engine — Stage 3

## Tujuan
Menyatukan mekanisme adaptasi Gym dan Home Gym dan membuat keputusan `Rotasi Gerakan` benar-benar mengganti gerakan pada program berikutnya.

## Implementasi
- `assets/js/46-unified-adaptive-engine.js`
- Shared context memakai `apUnifiedIntelligence` dan canonical `apTraining`.
- Keputusan per gerakan membaca evaluasi sesi terakhir.
- `stagnant` dan `too_hard` memicu rotasi.
- Kandidat Gym berasal dari library latihan Gym.
- Kandidat Home Gym berasal dari katalog gerakan Home Gym dan dibatasi equipment yang tersedia.
- Kandidat dinilai berdasarkan fokus program, goal, level, riwayat penggunaan, dan variasi.
- Substitusi diterapkan ke `PROG` untuk workout berikutnya; riwayat sesi lama tidak diubah.
- Plan disimpan di `ap_unified_adaptive_plan_v1`.
- Log perubahan disimpan di `ap_unified_adaptive_log_v1`.
- API: `window.apUnifiedAdaptive`.

## Keputusan
- `rotation`: mengganti gerakan.
- `progression`: mempertahankan gerakan; progressive overload tetap ditangani engine progresi yang sudah ada.
- `maintenance`: mempertahankan gerakan.

## Proteksi
- Tidak mengubah `apTraining` atau sesi historis.
- Tidak membuat rotasi terus-menerus pada render yang sama.
- Tidak mengganti gerakan jika kandidat valid tidak ditemukan.
- Home Gym tidak boleh memakai gerakan yang membutuhkan equipment yang tidak tersedia.

## Verifikasi statis
- Arsip sumber Stage 2 berhasil diekstrak tanpa error.
- Script Stage 3 ditambahkan sebagai file baru sehingga file lama tidak dipangkas.
