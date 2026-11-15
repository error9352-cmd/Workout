# Exercise Demonstration Images

Folder ini menyimpan gambar demonstrasi yang dipakai aplikasi.

## Struktur folder
- `*.webp` — gambar per gerakan yang sudah dipotong dari lembar komposit; file inilah yang dipakai aplikasi.
- `source-sheets/` — lembar gambar asli sebelum dipotong, untuk arsip dan sumber pemotongan ulang.

## Menambahkan gerakan dari lembar komposit
1. Buat satu lembar berisi beberapa gerakan dengan grid yang rapi dan ukuran panel seragam.
2. Simpan lembar sumber di `assets/images/exercises/source-sheets/`.
3. Potong setiap panel menjadi file WebP terpisah di `assets/images/exercises/`.
4. Gunakan nama file slug yang konsisten, misalnya `incline-dumbbell-press.webp`.
5. Daftarkan path relatifnya pada metadata gerakan di `assets/js/data/exercise-catalog-defaults.js`, atau melalui tombol `Detail` di Exercise Library untuk perubahan lokal.

Contoh path: `assets/images/exercises/incline-dumbbell-press.webp`.

## Standar aset
- Format yang disarankan: WebP.
- Satu file final untuk satu gerakan; lembar komposit hanya disimpan sebagai sumber.
- Pastikan panel sudah dipotong tanpa garis pemisah panel yang mengganggu.
- Kompres gambar agar tetap ringan untuk perangkat mobile.
- Pastikan aset memiliki izin penggunaan yang sesuai.

Path gambar bawaan disimpan dalam metadata `image` pada katalog. Perubahan lokal tersimpan pada localStorage `ap_exercise_meta`. File fisik gambar harus ikut di-commit/deploy bersama project dan tidak ikut dalam backup JSON.


## Status katalog (14 Nov 2026)
Seluruh 79 gerakan memiliki visual WebP yang dipetakan pada `exercise-catalog-defaults.js`. Lihat `EXERCISE_VISUAL_AUDIT.md` untuk daftar gerakan kosong dan catatan kecocokan visual.


### Batch bahu (9 ilustrasi)

Ditambahkan dari `source-sheets/shoulders-01.png`. Panel yang dipasangkan: Dumbbell Shoulder Press, Dumbbell Lateral Raise, Face Pull, Overhead Press, Machine Shoulder Press, Rear Delt Fly, Upright Row, Dumbbell Front Raise, dan Cable Lateral Raise. Panel 5 tidak dipakai karena memperlihatkan shoulder press standar, bukan Arnold Press.


### Batch 15 gerakan (14 Nov 2026)
Lembar sumber `source-sheets/15-exercise-muscle-guide-2026-11-14.png` dipotong menjadi 15 aset WebP. Empat gambar menggantikan ilustrasi gerakan yang sudah ada dan sebelas gerakan baru didaftarkan di Exercise Library. Rincian pemetaan ada di `EXERCISE_VISUAL_AUDIT.md`.

### Home Workout atlas batch (14 Nov 2026)
The 15-panel home-workout atlas is archived in `source-sheets/home-workout-15-exercises-atlas.png` and cropped into dedicated `*-home.webp` / home movement assets. Their catalog mapping is maintained in `assets/js/28-home-workout.js`.
