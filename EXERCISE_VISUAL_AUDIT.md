# Exercise Visual Audit — 14 November 2026

## Ringkasan katalog
- Total entri latihan: 79
- Entri dengan file gambar lokal yang tersedia: 49
- Entri yang masih perlu gambar: 30
- Referensi gambar lokal yang rusak/tidak ditemukan: 0
- File katalog `assets/js/data/exercise-catalog-defaults.js` lolos `node --check`.

## Batch terbaru: Lengan (10 panel)
Lembar sumber disimpan di `assets/images/exercises/source-sheets/arms-biceps-triceps-10.png`. Setiap panel dipotong menjadi WebP dan dipetakan ke entri katalog berikut:

1. Dumbbell Biceps Curl — `dumbbell-biceps-curl.webp`
2. Hammer Curl — `hammer-curl.webp`
3. Triceps Pushdown — `triceps-pushdown.webp`
4. Barbell Curl — `barbell-curl.webp`
5. Preacher Curl — `preacher-curl.webp`
6. Cable Curl — `cable-curl.webp`
7. Concentration Curl — `concentration-curl.webp`
8. Skull Crusher — `skull-crusher.webp`
9. Overhead Triceps Extension — `overhead-triceps-extension.webp`
10. Triceps Dips — `triceps-dips.webp`

Pemeriksaan visual: panel 1–10 cocok secara umum dengan jenis gerakan dan alat yang dimaksud. Panel 6 menampilkan variasi cable curl berdiri; panel 7 concentration curl satu lengan; panel 8 lying triceps extension; panel 9 overhead dumbbell extension; panel 10 parallel-bar dips. Detail anatomi tetap berupa ilustrasi instruksional, bukan referensi medis.

## Catatan audit sebelumnya
- Walking Lunge sebelumnya masih berupa pose lunge statis, belum menunjukkan fase melangkah.
- Incline Chest Press dan Incline Bench Press sebelumnya tampak terlalu mirip; perlu ditinjau ulang agar perbedaan sudut bangku/alat terlihat jelas.
- Arnold Press belum memiliki properti gambar pada entri katalog.

## Status
Seluruh 49 path gambar yang terisi mengarah ke file lokal yang ada. Sebanyak 30 entri masih memerlukan ilustrasi atau properti gambar. Tidak ada path gambar yang rusak.


## Batch terbaru: Kaki (9 panel dipakai)
Lembar sumber: `assets/images/exercises/source-sheets/legs-9-exercises-source.png`. Panel dipotong menjadi WebP dan dipetakan:

1. Leg Press — `assets/images/exercises/leg-press.webp`
2. Goblet Squat — `assets/images/exercises/goblet-squat.webp`
3. Dumbbell Romanian Deadlift — `assets/images/exercises/dumbbell-romanian-deadlift.webp`
4. Hack Squat — `assets/images/exercises/hack-squat.webp`
5. Leg Extension — `assets/images/exercises/leg-extension.webp`
6. Leg Curl — `assets/images/exercises/leg-curl.webp`
7. Seated Calf Raise — `assets/images/exercises/seated-calf-raise.webp`
8. Standing Calf Raise — `assets/images/exercises/standing-calf-raise.webp`


Pemeriksaan kecocokan: panel 1 leg press; panel 2 goblet squat; panel 3 dumbbell Romanian deadlift; panel 4 hack squat; panel 5 leg extension; panel 6 lying leg curl; panel 7 seated calf raise; panel 8 standing calf raise. Panel 9–10 tidak dipakai karena tidak ada entri katalog pending yang cocok karena tidak ada entri katalog pending yang cocok. Perlu tinjauan manusia akhir pada tampilan aplikasi, terutama pembedaan mesin leg press dan hack squat.

## Status setelah batch kaki
- Entri ready di metadata: 57
- Entri pending di metadata: 22


## Batch terbaru: Core (10 panel)
Lembar sumber: `assets/images/exercises/source-sheets/core-10-exercises-source.png`. Panel dipotong menjadi WebP dan dipetakan:

1. Plank — `assets/images/exercises/plank.webp`
2. Cable Crunch — `assets/images/exercises/cable-crunch.webp`
3. Pallof Press — `assets/images/exercises/pallof-press.webp`
4. Bicycle Crunch — `assets/images/exercises/bicycle-crunch.webp`
5. Hanging Leg Raise — `assets/images/exercises/hanging-leg-raise.webp`
6. Russian Twist — `assets/images/exercises/russian-twist.webp`
7. Ab Wheel Rollout — `assets/images/exercises/ab-wheel-rollout.webp`
8. Side Plank — `assets/images/exercises/side-plank.webp`
9. Mountain Climber — `assets/images/exercises/mountain-climber.webp`
10. Dead Bug — `assets/images/exercises/dead-bug.webp`

Pemeriksaan visual: panel 1 plank forearm; 2 kneeling cable crunch; 3 standing Pallof press; 4 bicycle crunch; 5 hanging knee/leg raise; 6 Russian twist dengan plate; 7 ab-wheel rollout; 8 side plank; 9 mountain climber; 10 dead bug. Kecocokan kategori gerak dan alat dinilai sesuai secara umum. Panel 5 tampak lebih menyerupai hanging knee raise daripada straight-leg raise; nama katalog tetap Hanging Leg Raise dan perlu validasi sudut lutut saat review aplikasi.

## Status setelah batch core
- Entri ready di metadata: 67
- Entri pending: 12
- Pending: Close Grip Pulldown, Arnold Press, Dumbbell Shrug, Close Grip Bench Press, Seated Leg Curl, Treadmill, Sepeda Statis, Elliptical, Rowing Machine, Stair Climber, Lompat Tali, Jalan Cepat


## Batch terbaru: Kardio (7 panel dipakai)
Lembar sumber: `assets/images/exercises/source-sheets/cardio-10-exercises-source.png`. Tujuh panel pertama yang cocok dipotong menjadi WebP dan dipetakan:
1. Treadmill — `treadmill.webp` (pelari di atas treadmill)
2. Sepeda Statis — `stationary-bike.webp` (pengguna sepeda statis)
3. Elliptical — `elliptical.webp` (pengguna mesin elliptical)
4. Rowing Machine — `rowing-machine.webp` (pengguna mesin rowing)
5. Stair Climber — `stair-climber.webp` (pengguna stair climber)
6. Lompat Tali — `jump-rope.webp` (atlet menggunakan tali skipping)
7. Jalan Cepat — `brisk-walking.webp` (atlet berjalan dengan langkah lebar)

Panel 8 (air bike) tidak dipakai karena tidak ada entri katalog yang sesuai. Panel 9 (mountain climber) tidak dipakai karena sudah memiliki gambar dari kelompok core. Panel 10 (step-up) tidak dipakai karena bukan entri kardio yang masih kosong.

## Status setelah batch kardio
- Entri bergambar: 79 dari 79
- Entri pending: 0
- Arnold Press: ilustrasi khusus menunjukkan posisi awal dumbbell di depan bahu dan rotasi keluar saat menekan ke atas.
- Path gambar yang dirujuk di katalog diperiksa terhadap file lokal.


## Batch terakhir: lima gerakan tersisa (14 November 2026)

- Close Grip Pulldown: gambar tersedia dan sesuai.
- Dumbbell Shrug: gambar tersedia dan sesuai.
- Close Grip Bench Press: gambar tersedia; pegangan relatif sempit, sesuai variasi close-grip.
- Seated Leg Curl: gambar tersedia dan sesuai.
- Arnold Press: dipasangkan ke aset khusus `arnold-press.webp`; visual menunjukkan posisi awal di depan bahu dan rotasi keluar saat menekan ke atas. Tinjau tampilan akhir pada perangkat untuk memastikan keterbacaan.

Empat gambar baru dipotong dari lembar 5 panel; panel dumbbell shoulder press biasa tidak digunakan untuk Arnold Press.


## Audit akhir — seluruh visual

- Total entri latihan: 79
- Entri dengan gambar lokal: 79 dari 79
- Entri pending: 0
- Arnold Press memakai aset khusus `assets/images/exercises/arnold-press.webp`.
- Semua file gambar yang direferensikan katalog diperiksa keberadaannya.
- Pemeriksaan sintaks JavaScript katalog berhasil.


## Batch ilustrasi bahu, lengan, dan kaki (14 November 2026)

Lembar sumber: `assets/images/exercises/source-sheets/15-exercise-muscle-guide-2026-11-14.png`.
Lima belas panel dipotong menjadi aset WebP lokal dan dipetakan ke katalog:

1. Cable Lateral Raise — `cable-lateral-raise.webp`
2. Leaning Cable Lateral Raise — `leaning-cable-lateral-raise.webp`
3. Rear Delt Fly — `rear-delt-fly.webp`
4. Hammer Curl — `hammer-curl.webp`
5. Barbell Shrug — `barbell-shrug.webp`
6. Seated Barbell Shoulder Press — `seated-barbell-shoulder-press.webp`
7. Plate Front Raise — `plate-front-raise.webp`
8. Machine Lateral Raise — `machine-lateral-raise.webp`
9. Walking Lunge — `walking-lunge.webp`
10. Reverse Lunge — `reverse-lunge.webp`
11. Forward Lunge — `forward-lunge.webp`
12. Lateral Lunge — `lateral-lunge.webp`
13. Reverse Hack Squat — `reverse-hack-squat.webp`
14. Single-Leg Leg Press — `single-leg-leg-press.webp`
15. Single-Leg Romanian Deadlift — `single-leg-romanian-deadlift.webp`

Empat gerakan yang sudah ada memperbarui ilustrasi sebelumnya; sebelas variasi baru ditambahkan ke Exercise Library dan metadata katalog. Seluruh 90 entri katalog kini memiliki path gambar lokal yang valid.


## Penambahan Home Workout (14 Nov 2026)
- Ditambahkan 28 gerakan Home Workout pada kategori Dada, Punggung, Bahu, Lengan, Kaki, Core, dan Kardio.
- Peralatan yang didukung: tanpa alat, resistance band, dan dumbbell.
- Exercise Library memiliki filter lokasi dan filter peralatan yang terintegrasi dengan filter kelompok otot serta pencarian yang sudah ada.
- Gerakan bersama diberi penanda Gym + Home.
- Ilustrasi variasi yang menggunakan aset gerakan dasar diberi label Ilustrasi referensi.
- Service worker dinaikkan ke versi cache `ap-v53` agar pembaruan terdeteksi pada instalasi PWA.

## Home Workout atlas — 15 panel batch (14 Nov 2026)

Source sheet: `assets/images/exercises/source-sheets/home-workout-15-exercises-atlas.png`.
The approved 5-column × 3-row sheet was cropped into individual local WebP assets:

1. Push Up — `push-up-home.webp` (Gym + Home)
2. Pike Push Up — `pike-push-up.webp` (Home)
3. Bodyweight Squat — `bodyweight-squat.webp` (Home)
4. Bulgarian Split Squat — `bulgarian-split-squat-home.webp` (Gym + Home)
5. Reverse Lunge — `reverse-lunge-home.webp` (Gym + Home)
6. Glute Bridge — `glute-bridge-home.webp` (Home)
7. Single Leg Glute Bridge — `single-leg-glute-bridge.webp` (Home)
8. Plank — `plank-home.webp` (Gym + Home)
9. Mountain Climber — `mountain-climber-home.webp` (Gym + Home)
10. Dumbbell Bent Over Row — `dumbbell-bent-over-row-home.webp` (Home)
11. High Knees — `high-knees.webp` (Home)
12. Jumping Jack — `jumping-jack.webp` (Home)
13. Jump Squat — `jump-squat.webp` (Home)
14. Lunge Jump — `lunge-jump.webp` (Home; new catalog entry)
15. Burpee — `burpee.webp` (Home)

All 15 panel crops are bundled locally. The plank panel lacked the requested movement arrow in the generated sheet; a small white stabilization arrow was added to that crop. The illustrations are instructional references and should not be treated as clinical anatomical guidance.


## Koreksi ilustrasi Home Workout — 15 November 2026

Lembar sumber: `assets/images/exercises/source-sheets/home-workout-corrected-19-exercises-source.png`. Panel dibuat menjadi aset WebP persegi terpisah. Daftar yang sebelumnya mencantumkan Incline Push Up dua kali dinormalisasi menjadi 19 gerakan unik; panel duplikat tidak dipakai.

Pemetaan aset yang telah diperiksa berdasarkan pose dan alat yang tampak:

1. Wide Push Up — `wide-push-up-home.webp`
2. Diamond Push Up — `diamond-push-up-home.webp`
3. Incline Push Up — `incline-push-up-home.webp`
4. Resistance Band Row — `resistance-band-row-home.webp`
5. Reverse Snow Angel — `reverse-snow-angel-home.webp`
6. Single-Arm Cable Lateral Raise — `single-arm-cable-lateral-raise-home.webp`
7. Band Lateral Raise — `band-lateral-raise-home.webp`
8. Hammer Curl — `hammer-curl-home.webp`
9. Cable Hammer Curl — `cable-hammer-curl-home.webp`
10. Cross-Body Hammer Curl — `cross-body-hammer-curl-home.webp`
11. Close Grip Push Up — `close-grip-push-up-home.webp`
12. Resistance Band Biceps Curl — `resistance-band-biceps-curl-home.webp`
13. Band Overhead Triceps Extension — `band-overhead-triceps-extension-home.webp`
14. Standing Calf Raise — `standing-calf-raise-home.webp`
15. Reverse Crunch — `reverse-crunch-home.webp`
16. Hollow Body Hold — `hollow-body-hold-home.webp`
17. Bird Dog — `bird-dog-home.webp`
18. Skater Hop — `skater-hop-home.webp`
19. March in Place — `march-in-place-home.webp`

Panel duplikat Incline Push Up pada lembar 20 panel sengaja tidak dipakai. Dua gerakan berbasis cable machine (Single-Arm Cable Lateral Raise dan Cable Hammer Curl) ditandai Gym, bukan Home, karena memerlukan cable machine. Gerakan band dan bodyweight tetap di Home; gerakan dumbbell/bodyweight yang praktis di kedua lokasi ditandai Both. Semua 19 metadata gambar diset `ready`, dan override gambar lama pada `ap_exercise_meta` diperbarui agar tidak menimpa aset yang telah dikoreksi.


## Pembaruan ukuran ilustrasi Home Workout (15 Nov 2026)

- 19 ilustrasi Home Workout dikalibrasi ulang agar subjek mengisi area gambar lebih besar dan konsisten.
- Pemotongan mempertahankan figur, peralatan, dan panah gerakan; rasio aspek tiap ilustrasi tetap dijaga.
- Ukuran kanvas aset tetap 512×512 WebP.
- Cache service worker dinaikkan dari ap-v55 ke ap-v56 agar aset baru dimuat.
