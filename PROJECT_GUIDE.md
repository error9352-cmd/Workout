# Athletic Physique Dashboard — Project Guide



## Pembaruan Library (14 November 2026)

- Navigasi utama kini memiliki halaman **Library** tersendiri di antara Workout dan Progres.
- Halaman Exercise Library menyediakan pencarian nama gerakan, filter kelompok otot, jumlah gerakan, serta kartu ringkas untuk otot dan jenis pencatatan.
- Tombol **Lihat detail** memakai panel detail gerakan yang sudah tersedia di aplikasi.
- Daftar gerakan tetap menggunakan `window.apLIB` / `ap_lib`; metadata tambahan tetap menggunakan `window.apExerciseCatalog` (`ap_exercise_meta`). Tidak dibuat penyimpanan katalog duplikat.
- Navigasi bawah pada layar kecil disesuaikan menjadi enam kolom agar item Library tetap terlihat.

> Dokumentasi ini dibuat dari pemeriksaan source code arsip `athletic-physique-refactored.rar` yang diterima pada 14 November 2026. Fokusnya adalah kondisi file dalam arsip, bukan asumsi mengenai versi lain yang mungkin ada di perangkat atau repository.
>
> **Status audit:** struktur dan referensi HTML, CSS, JavaScript, storage, alur utama, dan konfigurasi yang ditemukan telah diperiksa. Tidak ada pengujian browser end-to-end atau akses ke dashboard Supabase/database yang dilakukan. Informasi yang tidak dapat dibuktikan dari source ditandai secara eksplisit.

## 1. Project Overview

**Nama aplikasi:** Athletic Physique Dashboard (judul HTML: `Athletic Physique`).

**Jenis aplikasi:** dashboard fitness/workout berbasis HTML, CSS, dan JavaScript vanilla. Tidak ditemukan framework frontend, bundler, package manifest, atau sistem routing framework.

**Entry point:** `index.html`.

**Runtime utama:** `assets/js/00-app-core.js` (sekitar 1.5 MB; aplikasi inti masih terkonsentrasi di satu file). Aplikasi membuat halaman dengan template string dan mengisi elemen `#app` serta `#nav`.

**Fitur yang terbukti ada:** Beranda, Workout, Progres, Riwayat, Profil, program latihan mingguan/custom, pencatatan set, tiga mode latihan (beban+repetisi, bodyweight, waktu), active workout yang dapat dilanjutkan, rest timer, timer set berbasis waktu, superset, warm-up, RPE, exercise notes, PR, estimasi 1RM, progressive-overload recommendation, Weekly Coach, weight/body measurements, BMI, progress photos, muscle/volume analysis, backup/restore, CSV export, auth Supabase, serta mekanisme local/cloud sync.

**Penting tentang tahap refactor:** beberapa file `features/`, `core/standalone-candidates.js`, `data/`, dan file bernama `*-supabase-*` merupakan kandidat/hasil ekstraksi atau salinan. Sebagian besar **tidak dimuat oleh `index.html`**. Jangan menganggap keberadaan file tersebut berarti aplikasi runtime telah memakai modul itu.

## 2. Project Structure

Struktur aktual file dalam arsip (folder kosong tidak ditampilkan; `assets/pwa/` juga ada tetapi kosong):

```text
athletic-physique-refactored/
├── index.html
├── manifest.webmanifest            # PWA manifest (ada)
├── sw.js                           # service worker (ada)
├── icon-192.png                    # icon PWA / Apple touch icon (ada)
├── icon-512.png                    # icon PWA (ada)
├── PROJECT_GUIDE.md
├── README.md
├── TREE.txt
├── PROJECT_MAP.md                 # kosong pada arsip
├── Plain_text.md                  # kosong pada arsip
├── .vscode/
│   └── settings.json
└── assets/
    ├── css/
    │   ├── 01-base.css             # tidak direferensikan index.html
    │   ├── 01-styles.css           # dimuat
    │   ├── 02-responsive.css       # tidak direferensikan
    │   ├── 02-styles.css           # dimuat
    │   ├── 03-layout-components.css# tidak direferensikan
    │   ├── 03-styles.css           # dimuat
    │   ├── 04-pages-workout-progress.css # tidak direferensikan
    │   ├── 04-styles.css           # dimuat
    │   ├── 05-final-pages.css      # tidak direferensikan
    │   ├── 05-styles.css           # dimuat
    │   └── 06-modals-mobile.css    # tidak direferensikan
    │                              # 06-styles.css dimuat
    └── js/
        ├── 00-app-core.js          # runtime utama; dimuat
        ├── 01-patch.js             # dimuat
        ├── 01-set-completion-pop.js# tidak dimuat
        ├── 01-core-functions.js    # tidak dimuat
        ├── 02-patch.js             # dimuat
        ├── 02-dashboard-number-animation.js # tidak dimuat
        ├── 02-workout.js           # tidak dimuat
        ├── 03-patch.js             # dimuat
        ├── 03-before-after-slider.js# tidak dimuat
        ├── 03-history.js           # tidak dimuat
        ├── 04-patch.js             # dimuat
        ├── 04-profile.js           # tidak dimuat
        ├── 04-theme-switcher.js    # tidak dimuat
        ├── 05-patch.js             # dimuat
        ├── 05-haptics.js           # tidak dimuat
        ├── 05-progress.js          # tidak dimuat
        ├── 06-patch.js             # dimuat
        ├── 06-audio-stop.js        # tidak dimuat
        ├── 06-physique.js          # tidak dimuat
        ├── 07-patch.js             # dimuat
        ├── 07-plate-calculator.js  # tidak dimuat
        ├── 08-patch.js             # dimuat
        ├── 08-exercise-library.js  # tidak dimuat
        ├── 08-misc-functions.js    # tidak dimuat
        ├── 09-patch.js             # dimuat
        ├── 09-keyboard-viewport.js # tidak dimuat
        ├── 10-patch.js             # dimuat
        ├── 10-program-recommendations.js # tidak dimuat
        ├── 11-patch.js             # dimuat
        ├── 11-history-editor.js    # tidak dimuat
        ├── 12-patch.js             # dimuat
        ├── 12-session-note.js      # tidak dimuat
        ├── 13-patch.js             # dimuat
        ├── 13-stopwatch.js         # tidak dimuat
        ├── 14-patch.js             # dimuat
        ├── 14-tooltip.js           # tidak dimuat
        ├── 15-patch.js             # dimuat
        ├── 15-week-controls.js     # tidak dimuat
        ├── 16-patch.js             # dimuat
        ├── 16-target-controls.js   # tidak dimuat
        ├── 17-patch.js             # dimuat
        ├── 17-photo-modal.js       # tidak dimuat
        ├── 18-patch.js             # dimuat
        ├── 18-photo-pose.js        # tidak dimuat
        ├── 19-patch.js             # dimuat
        ├── 19-exercise-note.js     # tidak dimuat
        ├── 20-patch.js             # dimuat
        ├── 20-progress-animations.js # tidak dimuat
        ├── 21-patch.js             # dimuat
        ├── 21-rpe-controls.js      # tidak dimuat
        ├── 22-patch.js             # dimuat
        ├── 22-pairing-controls.js  # tidak dimuat
        ├── 23-patch.js             # dimuat
        ├── 23-rpe-modal.js         # tidak dimuat
        ├── 24-patch.js             # dimuat; Supabase auth + sync
        ├── 24-supabase-cdn.js      # tidak dimuat; berisi tag script CDN
        ├── 25-patch.js             # dimuat; recommendation modal scroll lock
        ├── 25-supabase-auth-sync.js# tidak dimuat; salinan/versi auth-sync
        ├── 26-patch.js             # dimuat; general modal scroll lock
        ├── 26-recommendation-modal-lock.js # tidak dimuat
        ├── 27-all-modals-lock.js   # tidak dimuat
        ├── app.js                 # tidak dimuat
        ├── core/
        │   ├── utils.js            # dimuat sebelum core
        │   ├── standalone-candidates.js # kandidat, tidak dimuat
        │   └── standalone-map.json # daftar kandidat utility
        ├── data/
        │   ├── app-data.js         # data/kandidat, tidak dimuat
        │   ├── exercise-catalog.js # registry metadata exercise; runtime aktif
        │   └── exercise-images.js  # dataset gambar lama; tidak dimuat terpisah
        ├── images/
        │   └── exercises/         # lokasi foto exercise tambahan (path dikelola lewat library)
        ├── features/
        │   ├── dependency-map.json
        │   ├── workout.js          # kandidat salinan, tidak dimuat
        │   ├── progress.js         # kandidat salinan, tidak dimuat
        │   ├── history.js          # kandidat salinan, tidak dimuat
        │   ├── profile.js          # kandidat salinan, tidak dimuat
        │   └── ui.js               # kandidat salinan, tidak dimuat
        └── refactor-map.json
```

Catatan struktur:
- `manifest.webmanifest`, `sw.js`, `icon-192.png`, dan `icon-512.png` berada langsung di root, sejajar dengan `index.html`.
- `assets/images/exercises/` menyimpan gambar demonstrasi per gerakan dalam format WebP; lembar sumber komposit diarsipkan di `assets/images/exercises/source-sheets/`. Path bawaan didaftarkan pada metadata katalog. Tidak ada kebutuhan membuat `assets/icons/` atau `assets/fonts/`.
- File icon PWA yang berada di root memang sesuai dengan path relatif yang dipakai manifest dan HTML pada arsip ini.
- `index.html` memuat enam CSS bernama `01-styles.css` sampai `06-styles.css`. File CSS bernama `01-base.css`, `02-responsive.css`, `03-layout-components.css`, `04-pages-workout-progress.css`, `05-final-pages.css`, dan `06-modals-mobile.css` tidak dimuat oleh entry point.
- `README.md` menjelaskan refactor bertahap dan status kandidat; baca sebelum memindahkan fungsi lebih lanjut.

### File utama dan relasinya

| File | Peran aktual | Dependency/pemakai |
|---|---|---|
| `index.html` | Shell HTML, metadata, CSS inline, mount `#app`, `#rest`, `#nav`, dan urutan script | Memuat CSS aktif, `core/utils.js`, `00-app-core.js`, patch 01–26, Supabase CDN |
| `assets/js/00-app-core.js` | State, data akses, template UI, render, handler interaksi, workout/progress/history/profile; lookup gambar/otot/mode exercise | DOM `#app/#nav/#rest`, localStorage, IndexedDB foto, `window.apExerciseCatalog`, Supabase wrapper melalui `ls.set` |
| `assets/js/data/exercise-catalog.js` | Registry metadata exercise tambahan: foto, otot utama/pendukung, peralatan, mode, instruksi; API `window.apExerciseCatalog` | `ls.get/set`, key `ap_exercise_meta`; dipakai `00-app-core.js`, `08-patch.js`, `10-patch.js` |
| `assets/js/08-patch.js` | Exercise Library dan editor detail exercise; `ap_lib` tetap menjadi daftar nama custom per kategori | `window.apLIB`, `window.apALL`, `window.apExerciseCatalog`, modal program workout |
| `assets/js/10-patch.js` | Picker/detail exercise, thumbnail, info otot/peralatan, daftar gerakan workout | `exImg()`, `exInfo()`, `tipHtml()`, `window.apExerciseCatalog` |
| `assets/js/core/utils.js` | Utility `wtText()` dan `est1()` | Dimuat sebelum core; fungsi global dipakai core |
| `assets/js/01-patch.js`–`23-patch.js` | Patch berurutan atas runtime core | Mengasumsikan fungsi/state core sudah tersedia |
| `assets/js/24-patch.js` | Auth Supabase, cloud sync, login/logout UI | Supabase CDN, `ls`, `#app`, localStorage, tabel `user_data` |
| `assets/js/25-patch.js` | Scroll locking untuk modal rekomendasi jadwal | `.schedule-recommendation-modal`, `body` |
| `assets/js/26-patch.js` | Scroll locking untuk `.sheetbg` | DOM modal, document/body scroll |
| `assets/css/01-styles.css`–`06-styles.css` | CSS aktif, urutannya penting | Semua markup core dan komponen dinamis |
| `assets/js/features/*.js` | Salinan/kandidat ekstraksi fungsi core | Belum dimuat; jangan edit sebagai runtime aktif tanpa migrasi script |
| `assets/js/data/app-data.js` dan `exercise-images.js` | Data/kandidat lama | Tidak dimuat terpisah; `exercise-catalog.js` adalah pengecualian yang aktif |

## 3. Application Architecture

### Runtime flow

```text
Browser / Live Server
  └─ index.html
      ├─ metadata, Google Fonts, CSS links + inline style blocks
      ├─ <main id="app"> / <div id="rest"> / <nav id="nav">
      └─ scripts (defer, sesuai urutan dokumen)
          ├─ core/utils.js
          ├─ 00-app-core.js
          ├─ 01-patch.js ... 23-patch.js
          ├─ Supabase JS CDN v2.58.0 (external script)
          ├─ 24-patch.js (auth + sync)
          ├─ 25-patch.js (recommendation modal lock)
          └─ 26-patch.js (all sheet modal lock)
```

### Pola aplikasi

- Vanilla JavaScript global-scope; bukan React/Vue/Svelte dan tidak ada module loader pada entry point.
- `tab` adalah state navigasi sederhana (`home`, `workout`, `progress`, `history`, `profile`).
- `view()` menghasilkan HTML sesuai tab. `render()` mengganti `#app.innerHTML`, menyusun navigasi, lalu memasang kembali handler pada elemen hasil render.
- `rr()` menyimpan posisi scroll halaman dan slide sebelum memanggil `render()` lagi.
- Interaksi utama memakai atribut `data-*` dan handler yang dipasang setelah render; sebagian listener global memakai `document.addEventListener` di patch.
- `ls.get()` / `ls.set()` adalah wrapper localStorage dengan fallback memory `mem` jika akses storage gagal. `ls.set()` di-wrap lagi oleh `24-patch.js` untuk menandai data cloud-sync.
- Tidak ditemukan router URL/history API; navigasi terjadi lewat state `tab` dan tombol `data-go`/navigation.
- Toast, confirmation/arm, sheet/modal, timer, dan beberapa helper berada di core atau patch.
- `assets/js/features/*` adalah salinan fungsi untuk rencana pemisahan, bukan sumber runtime saat ini.

### Inisialisasi dan urutan script

Urutan script di `index.html` adalah bagian dari kontrak aplikasi. `core/utils.js` harus tetap sebelum `00-app-core.js`. Patch menggunakan identifier global yang didefinisikan core. Supabase CDN ditempatkan setelah `23-patch.js` dan sebelum `24-patch.js`. Jangan menggabungkan, memindahkan, atau menghapus script tanpa dependency review.

## Exercise Library — Katalog Gerakan

- `assets/js/08-patch.js` mendefinisikan katalog built-in melalui object `LIB` dengan kategori Dada, Punggung, Bahu, Lengan, Kaki, Core, dan Kardio. Katalog bawaan diperluas pada pembaruan 14 Nov 2026.
- Exercise custom tetap digabungkan dari localStorage `ap_lib`; jangan mengganti mekanisme ini.
- Metadata opsional foto, otot, peralatan, mode, dan instruksi disimpan terpisah pada `ap_exercise_meta` melalui `assets/js/data/exercise-catalog.js`.
- Foto demonstrasi lokal disimpan di `assets/images/exercises/`; lembar sumber komposit disimpan di subfolder `source-sheets/`, sedangkan aplikasi memakai file WebP per gerakan. Sepuluh gerakan kaki/core pertama sudah memiliki gambar bawaan. Exercise lain tetap dapat ditambahkan melalui metadata tombol `Detail`. Pada rekomendasi jadwal mingguan, setiap kartu hari menampilkan preview hingga tiga exercise dengan thumbnail, target set/repetisi, dan tombol Detail; ketuk thumbnail/nama membuka modal detail exercise. Tombol Lihat semua membuka daftar exercise lengkap hari tersebut.

## 4. Navigation & Pages

Navigasi lima tab dibuat dari `IC` (ikon SVG path) dan `NAMA` dalam core. Label aktual: Beranda, Workout, Progres, Riwayat, Profil. Container nav adalah `#nav`.

| Tab/state | Fungsi tampilan | Sumber utama |
|---|---|---|
| `home` | Dashboard harian dan ringkasan minggu | `view()` di `00-app-core.js` |
| `workout` | Program latihan atau sesi aktif | `view()`, `activeView()`, `startWorkout()` |
| `progress` | Ringkasan, physique, berat/BMI, strength, training | `view()`, helper Progress di core |
| `history` | Pencarian, filter, ringkasan, daftar sesi dan aksi | `historyFiltered()`, `historyStats()`, `histItem()` |
| `profile` (default branch) | Akun, profil pribadi, physique, backup, perangkat | `view()`, `profileCard()`, `bodyCard()`, `photoCard()`, `backupCard()` |

## 5. Home

**File utama:** `assets/js/00-app-core.js`, fungsi `view()` pada cabang `tab==='home'`.

Komponen yang dirender:
- Sapaan nama dari `prof().name`, tanggal lokal, dan hari dari `HARI`/`BLN`.
- Hero program hari ini; tombol mulai workout atau pilih latihan lain.
- Kartu workout aktif bila `ap_active` ada, dengan progres set dan tombol lanjut.
- Ringkasan aktivitas minggu berjalan: jumlah sesi, durasi, volume, streak.
- Weekly Coach (`weeklyCoach(ss, mon)`).
- Tiga aktivitas terakhir.
- Berat badan terakhir dan mini chart (`chart(110)`).
- PR (`prHtml()`).

Sumber data: `ap_profile`, `ap_prog`, `ap_active`, `ap_sessions`, `ap_weights`. Home adalah ringkasan; data detail dikelola oleh tab lain.

## 6. Workout

**File runtime utama:** `assets/js/00-app-core.js`. Candidate module `assets/js/features/workout.js` tidak dimuat.

### Program dan exercise

- Jadwal mingguan disimpan di `PROG`, dimuat dari `ap_prog`; `saveProg()` menulis kembali.
- Kunci hari menggunakan angka `Date.getDay()` (0 Minggu sampai 6 Sabtu). Setiap program memiliki `n` (nama), `f` (fokus), dan `ex` (array exercise). Exercise berupa array dengan nama, target teks, dan mode (dapat disimpulkan oleh `exMode()`).
- UI Workout menampilkan hari melalui `dayChips()`, daftar gerakan melalui `exList()`, edit program melalui `dayEdit()`/`editList()`, daftar semua program melalui `weekRows()`, serta program tambahan di `customCard()`.
- Pengguna dapat mengedit nama/fokus/hari, menambah/mengubah/menghapus exercise, menambah hari, memindahkan hari, membuat program custom, atau menggunakan rekomendasi/template melalui patch rekomendasi.
- `P()` membaca jumlah set dari target berbentuk seperti `3 × 10–12`.
- Exercise Library yang sudah ada tetap memakai `ap_lib` untuk nama custom per kategori. Metadata tambahan disimpan terpisah di `ap_exercise_meta` melalui `window.apExerciseCatalog`, sehingga format `PROG.ex` dan riwayat sesi lama tidak perlu diubah.
- Tombol `Detail` di picker exercise mengatur path foto, otot utama/pendukung, peralatan, mode pencatatan default, dan instruksi teknik. Saat exercise custom baru disimpan, editor detail terbuka agar metadata dapat langsung diisi.

### Mode pencatatan

`exMode(e)` mengembalikan:
- `weight`: beban kg dan repetisi.
- `bodyweight`: repetisi tanpa input beban.
- `time`: durasi; satuan dideteksi sebagai detik atau menit melalui `modeUnit(e)`.

### Memulai dan melanjutkan sesi

- `startWorkout(dow)` memastikan program hari itu tersedia dan memeriksa sesi aktif yang tersimpan.
- Sesi baru membuat object `ap_active` dengan `date`, `dow`, `name`, `start`, dan `sets` per exercise. Nilai set dapat diprefill dari performa terakhir melalui `prev()`.
- Jika ada sesi aktif untuk hari/program yang sama, tombol mulai berperilaku sebagai lanjut; jika sesi aktif berbeda, aplikasi meminta sesi tersebut diselesaikan/dibatalkan dahulu.
- Setiap perubahan input menyimpan object `ap_active` melalui `ls.set()`, sehingga sesi dapat dilanjutkan setelah navigasi/reload selama storage tetap tersedia.
- `activeView()` merender satu exercise aktif, status set, persen selesai, navigasi slide, serta tombol lanjut/sebelumnya/selesaikan/batalkan.
- `goSlide()` mengubah index exercise `cur`; pada mobile juga ada gesture swipe di container `#app`.

### Data set

Untuk mode beban: `{kg, reps, done, ...}`; untuk bodyweight: `{reps, done, ...}`; untuk waktu: `{value, done, timerSec?, ...}`. RPE disimpan pada properti `rpe`, warm-up ditandai `w`, dan set bisa memiliki metadata timer. Data aktual disusun dari form di `activeView()`.

### Set, warm-up, superset, RPE, catatan

- `data-done` handler di `render()` memvalidasi input, toggle selesai, memajukan exercise bila semua set selesai, menjalankan rest timer, dan menangani pasangan superset.
- `data-w` menandai set warm-up. `data-addw` menghasilkan warm-up otomatis untuk exercise berbeban berdasarkan beban set kerja atau performa sebelumnya.
- `data-ss` mengatur pasangan superset di `a.pair`; handler saling memperbarui pasangan.
- `rpeRow()` menampilkan RPE 6–10 pada mode weight. `21-patch.js` menangani klik `[data-rpe]` dan menulis `ap_active`; `23-patch.js` membuat sheet penjelasan RPE.
- Catatan per exercise ditulis ke `ap_xnotes` oleh listener `input` yang ada pada `00-app-core.js`/handler yang disediakan runtime.
- Riwayat performa exercise sebelumnya diambil dari `prev()` dan ditampilkan dalam kartu aktif.

### Timer dan istirahat

- Timer latihan time-mode memakai `WT`, `wtTargetSeconds()`, `wtElapsed()`, `wtRemaining()`, `wtStart()`, `wtRefresh()`, `wtCommit()`, `wtAutoComplete()`.
- Durasi target diambil dari teks target exercise atau nilai yang dimasukkan; timer memakai `Date.now()` untuk elapsed time. Nilai set disimpan pada `ap_active`.
- Rest timer menggunakan state `R`, `restStart(sec)`, `tick()`, `stopRest()`, `beep()`, `adj()` dan overlay/container `#rest`. Durasi default berasal dari `restFor(exerciseName)`; pengguna dapat pause/resume, menambah/mengurangi, skip, dan memasukkan durasi.
- `workoutStopwatchRefresh()` memperbarui durasi sesi aktif yang ditampilkan.

### Menyelesaikan workout, history, PR, dan volume

Handler `[data-finish]` di `render()`:
1. Mengambil set yang `done` dan bukan warm-up.
2. Membentuk `log` sesuai mode: `weight` menyimpan kg/reps/RPE; `bodyweight` menyimpan reps; `time` menyimpan value/unit.
3. Menghitung volume hanya dari set mode weight (`kg * reps`).
4. Menghitung durasi sesi dari `start`.
5. Menambahkan object `{date, name, minutes, volume, log}` ke `ap_sessions`.
6. Menghentikan rest timer, menghapus `ap_active`, pindah ke tab History, lalu memberi toast. PR dibandingkan dengan best sebelumnya berdasarkan beban tertinggi per exercise.

### Progressive overload dan PR

- `bestKg()` mencari beban tertinggi sebelumnya.
- `prData()` menyusun data per exercise dari `sessions()`, termasuk `best`, estimasi `est` (rumus Epley `kg * (1 + reps/30)`), tanggal dan reps.
- `est1()` ada di `core/utils.js` dan menghitung estimasi 1RM dari daftar set.
- `prHtml()`/`prPanel()` merender PR; `prCount()` menghitung PR pada sesi tertentu.
- `exTarget()`, `overloadSummary()`, `rec()`, `recAct()`, `recTxt()` menghubungkan target program dan performa sebelumnya untuk saran progresi. Saran dapat diterima/ditunda melalui handler data attribute.
- Jangan menyamakan PR dengan estimated 1RM: perhitungan PR utama memakai best load; estimasi 1RM adalah metrik turunan.

## 7. Progress

**File runtime:** `assets/js/00-app-core.js`, terutama fungsi `view()` cabang `progress`. `assets/js/features/progress.js` adalah kandidat salinan, bukan runtime aktif.

| Komponen | Fungsi/sumber | Data |
|---|---|---|
| Filter periode | `rangeChips()`, `range`, `RG`, `cut()` | Pilihan 7/30/90/180/365 hari |
| Ringkasan | `pgSummary()` | `ap_sessions`: sesi, volume, durasi, PR |
| Berat badan | `lineChart()`, `weightForm()`, `last()`, `avg7()`, `tgt()` | `ap_weights`, target `ap_target` |
| BMI/IMT | `bmiCard()` | tinggi `ap_profile.height` dan berat terbaru `ap_weights` |
| Pengukuran tubuh | `bodyCard()` | `ap_body` (tanggal + field ukuran) |
| Foto progres | `photoCard()`, `loadPh()`, `savePh()` | IndexedDB `ap_db` / store `kv`, key `photos`; fallback `ap_photos` |
| Foto before/after | `physiqueProgressCard()` dan state pemilihan foto | `PHOTOS`, selector perbandingan |
| PR | `prPanel()`, `prData()`, `prHtml()` | log sesi `ap_sessions` |
| Progressive overload | `overloadSummary()`, `exTarget()`, `rec()` | `ap_sessions` dan `ap_prog` |
| Muscle/set analysis | `muscleCard()`, `dayMus()`, `musBlock()`/`musBlock2()` | Nama exercise dan mapping otot `EXI` |
| Volume/training stats | `progressCards()`, `barChart()`, `weekCmp()` | `ap_sessions` |
| Konsistensi | `heatCard()`, `streak()` | tanggal dan volume dari `ap_sessions` |
| Weekly Coach | `weeklyCoach()`, `weeklyReview()` | sesi minggu ini dan pembanding minggu sebelumnya |
| Deload prompt | `deloadCard()` | minggu berturut-turut dengan sesi, status `ap_dl` |

### Alur data Progress

```text
Workout completion
  └─ ap_sessions
      ├─ PR / estimated 1RM
      ├─ volume / session statistics / muscle analysis
      ├─ weekly coach / weekly comparison / consistency
      └─ progressive overload suggestions

Body measurements ─ ap_body
Weight entries ─ ap_weights ─ BMI + weight chart
Profile height ─ ap_profile
Progress photos ─ IndexedDB ap_db/kv/photos (fallback ap_photos)
```

Catatan: berat badan dapat dimasukkan melalui form berat, dan pengukuran `kg` pada body measurement juga memperbarui `ap_weights` pada handler `[data-savebody]`.

## 8. History

**File runtime:** `assets/js/00-app-core.js`; editor sesi tambahan ada pada file `assets/js/11-history-editor.js` tetapi file itu tidak dimuat oleh index.

- `historyFiltered()` menyaring sesi menurut kata kunci dan rentang (7 hari, 30 hari, semua), lalu membalik urutan.
- `historyStats()` menghitung jumlah sesi, set, volume, dan durasi dari daftar hasil.
- `histItem()` membuat kartu detail sesi; menampilkan exercise, set, RPE, durasi, volume, catatan, serta aksi gambar/bagikan/edit/hapus.
- `ap_sessions` adalah sumber riwayat utama.
- `data-dels` menghapus satu sesi dengan undo toast; `data-delall` menghapus seluruh riwayat dengan undo.
- Tombol gambar/bagikan/edit bergantung pada handler patch atau listener lain. File terpisah `17-photo-modal.js` dan `11-history-editor.js` ada tetapi tidak dimuat; verifikasi handler runtime di core sebelum mengubah aksi tersebut.

## 9. Profile

**File runtime:** `assets/js/00-app-core.js` dan `assets/js/24-patch.js`.

Bagian Profil yang dirender:
- Akun & Sinkronisasi: container `#sb-account-card`, `#sb-account-content`, dirender/diperbarui oleh `24-patch.js`.
- Profil pribadi: `profileCard()` dan handler `data-ep`, `data-pc`, `data-ps`; field nama, tinggi, berat awal, frekuensi, tujuan.
- Pencapaian: `badges()`/`badgeCard()` (jumlah sesi, streak/target mingguan, volume, foto).
- Tema aksen: `themeCard()`, pilihan biru/hijau/oranye/ungu/merah; menyimpan `ap_theme`.
- Physique: `bodyCard()` dan `photoCard()` untuk pengukuran dan foto.
- Data & perangkat: `backupCard()`, ekspor CSV, backup/restore, dan status offline `offlineNote()`.

## 10. Authentication

Auth berada di `assets/js/24-patch.js` (meskipun namanya `patch`). Script ini dimuat setelah Supabase JS CDN di `index.html`.

- Membuat client Supabase dengan `persistSession: true` dan `autoRefreshToken: true`.
- Login menggunakan `sb.auth.signInWithPassword({email,password})`.
- Signup menggunakan `sb.auth.signUp({email,password})`; jika belum ada session, UI meminta konfirmasi email.
- Session awal diperiksa melalui `sb.auth.getSession()`; `uid` dan `uemail` diambil dari `session.user.id` dan `.email`.
- Logout melalui `sb.auth.signOut()` setelah mencoba `flush()`, kemudian `wipe()` data lokal `ap_*` yang termasuk sync scope, hapus `sbq`, lalu reload.
- `sbskip` menyimpan pilihan untuk melewati dialog akun pada perangkat tersebut.
- UI login, signup, show/hide password, feedback error, login modal, dan logout confirmation dibuat secara dinamis oleh `24-patch.js`.

**Keamanan:** source memuat Supabase project URL dan publishable/anon key di browser, pola umum untuk client-side Supabase. Jangan pernah mengganti key/config tanpa alasan; jangan menaruh `service_role` key atau secret server di frontend. Kebijakan akses tabel harus ditegakkan melalui RLS di Supabase, tetapi konfigurasi RLS tidak dapat diperiksa dari arsip.

## 11. Data & Storage

### localStorage

`ls.get(key, default)` dan `ls.set(key, value)` adalah wrapper utama. Key berikut ditemukan melalui literal storage access, state initialization, backup list, atau sync logic.

| Key | Tipe/isi yang tampak | Fungsi | Digunakan oleh |
|---|---|---|---|
| `ap_prog` | object program per hari | Jadwal/program dan exercise | Workout, Home, Progress target |
| `ap_active` | object sesi aktif | Workout yang sedang berjalan dan dapat dilanjutkan | Workout, Home, sync |
| `ap_sessions` | array sesi selesai | Log set, tanggal, durasi, volume | History, Progress, PR, Weekly Coach, sync |
| `ap_weights` | array `{d, kg}` | Riwayat berat badan | Home, Progress, BMI, backup, sync |
| `ap_profile` | object profil | Nama, tinggi, berat awal, frekuensi, goal | Home, Profile, BMI, rekomendasi program |
| `ap_body` | array pengukuran bertanggal | Pengukuran kg/waist/chest/shoulder/arm/thigh | Progress/Physique |
| `ap_theme` | string tema (`biru` default dan pilihan lain) | Warna aksen | CSS theme, Profile; dikecualikan dari cloud sync |
| `ap_xnotes` | object nama exercise → catatan | Catatan per gerakan | Workout |
| `ap_target` | nilai target berat (format detail tidak sepenuhnya terdefinisi di audit) | Target pada chart/weight insight | Progress |
| `ap_dl` | string tanggal Senin | Menyimpan dismiss untuk prompt deload | Progress |
| `ap_lastbk` | tanggal | Terakhir membuat backup | Profile/backup |
| `ap_lib` | object kategori → daftar exercise custom/favorit | Menyimpan nama exercise custom per kategori; daftar built-in tetap didefinisikan di `08-patch.js` | `08-patch.js`, masuk daftar backup |
| `ap_exercise_meta` | object keyed by normalized exercise name | Metadata opsional: image path, primary/secondary muscle, equipment, default mode, instructions | `assets/js/data/exercise-catalog.js`, `08-patch.js`, `00-app-core.js`, `10-patch.js`; backup `BK`; otomatis masuk cloud sync karena key `ap_*` dan bukan `SKIP` |
| `ap_recv` | object pilihan level, jumlah hari, dan goal | State rekomendasi jadwal latihan | `10-patch.js` (runtime aktif) |
| `ap_onb` | flag onboarding selesai/dilewati | Mencegah onboarding muncul kembali | `10-patch.js` |
| `ap_prog_prev` | snapshot jadwal program sebelumnya + frekuensi | Mengembalikan program sebelum rekomendasi diterapkan | `10-patch.js` |
| `ap_tplv` | string filter level template (default `Semua`) | Filter template workout | `10-patch.js` |
| `ap_wr` | nilai dismissal untuk weekly review | Menyembunyikan insight/review tertentu untuk minggu yang ditandai | `15-patch.js` dan helper `weeklyReview()` |
| `sbq` | array key lokal yang menunggu sync | Antrian dirty key | `24-patch.js` |
| `sbskip` | string flag `'1'` | Jangan tampilkan login prompt otomatis setelah user skip | `24-patch.js` |

Catatan sync: `24-patch.js` menyinkronkan key `ap_*` kecuali `ap_photos` dan `ap_theme`. `ap_photos` adalah fallback legacy untuk foto; foto utama saat IndexedDB tersedia disimpan di IndexedDB.

### IndexedDB

- Database: `ap_db`.
- Versi: `1`.
- Object store: `kv` (dibuat pada `onupgradeneeded`).
- Key yang digunakan untuk foto: `photos`.
- Fungsi runtime: `phOpen()`, `loadPh()`, `savePh()` di `00-app-core.js`.
- Fallback: localStorage `ap_photos` bila IndexedDB gagal; saat migrasi dari localStorage ke IndexedDB, kode menghapus `ap_photos` setelah penyimpanan callback.
- Struktur item foto yang terlihat: `{id, d, img, pose}`; gambar dikompresi ke JPEG data URL dengan batas dimensi maksimum 640 px dan quality 0.7.

### Supabase table

| Table | Kolom yang dipakai | Tujuan |
|---|---|---|
| `user_data` | `user_id`, `key`, `value`, `updated_at` | Penyimpanan key/value per user; `upsert(rows)` untuk push, `select('key,value')` untuk pull |

Tidak ditemukan schema SQL, migration, RLS policy, trigger, atau definisi tabel di arsip. Validasi skema, uniqueness constraint, dan RLS harus diperiksa pada dashboard/project Supabase sebelum perubahan backend.

### Backup

`BK` pada core memuat `ap_weights`, `ap_sessions`, `ap_prog`, `ap_body`, `ap_profile`, `ap_theme`, `ap_xnotes`, `ap_lib`, dan `ap_exercise_meta`. Backup diekspor sebagai JSON teks dengan format `{v:1,d:{...}}`. File gambar yang disimpan sebagai path di `assets/images/exercises/` tidak ikut di dalam backup JSON; file gambar harus ikut di-commit/deploy bersama project. Foto progres IndexedDB juga tidak ikut backup. Restore hanya menerima key yang ada dalam daftar `BK`.

## 12. Supabase / Cloud Sync

**Implementasi aktif:** `assets/js/24-patch.js`. `assets/js/25-supabase-auth-sync.js` adalah file paralel dengan alur yang sangat mirip tetapi tidak dimuat oleh `index.html`; jangan mengedit file itu dengan asumsi ia runtime aktif.

### Push / flush

- `ls.set` di-wrap; jika user login dan key cocok `ap_*` serta bukan `ap_photos`/`ap_theme`, key dimasukkan ke `dirty` (`Set`).
- Daftar dirty disimpan ke localStorage `sbq`.
- `flush()` membentuk rows `{user_id,key,value,updated_at}` dan melakukan `sb.from('user_data').upsert(rows)`.
- Perubahan dijadwalkan dengan debounce 2 detik; juga ada flush ketika browser online, tab menjadi hidden, saat login/session ditemukan, saat user menekan tombol sync, dan sebelum logout.

### Pull

- `pull()` memanggil `sb.from('user_data').select('key,value')`.
- Bila akun cloud belum punya data tetapi perangkat punya `ap_*`, user ditawari upload data lokal atau mulai dari kosong.
- Bila data cloud tersedia, key yang tidak sedang dirty ditulis ke localStorage; bila ada perubahan, halaman reload.
- `wipe()` menghapus key lokal berawalan `ap_` kecuali key yang masuk `SKIP` (`ap_photos`, `ap_theme`), menghapus `sbq`, dan mengosongkan dirty Set.

### Offline dan tanpa akun

- Data utama tetap disimpan lokal melalui `ls.set()`.
- Bila belum login, cloud sync tidak berjalan; user dapat memilih “Lanjut tanpa akun”.
- Event `offline`/`online` memberi toast; sinkronisasi menunggu koneksi kembali.
- Foto disimpan lokal IndexedDB dan tidak masuk cloud-sync key/value.
- Perilaku konflik merge hanya berupa dirty-key skip saat pull; tidak ditemukan version vector atau conflict resolution tingkat field. Jangan mengasumsikan sinkronisasi dua arah yang granular.

## 13. PWA

PWA memiliki file implementasi aktual dalam arsip dan semuanya berada di root project:

| File | Fungsi | Referensi/pemakai |
|---|---|---|
| `manifest.webmanifest` | Metadata instalasi: nama, short name, deskripsi, bahasa, start URL, scope, display, orientation, warna, daftar icon | `index.html` melalui `<link rel="manifest">` |
| `icon-192.png` | Icon 192×192; dipakai sebagai Apple touch icon dan icon UI auth | `index.html`, `assets/js/24-patch.js`, `assets/js/25-supabase-auth-sync.js` (file terakhir tidak dimuat runtime) dan manifest |
| `icon-512.png` | Icon 512×512, termasuk deklarasi `purpose: maskable` | `manifest.webmanifest` |
| `sw.js` | Service worker; precache, lifecycle, navigation fallback, runtime cache, update strategy | Didaftarkan satu kali oleh `assets/js/21-patch.js` |

### Manifest aktual

- `name`: `Athletic Physique`; `short_name`: `Athletic`; `lang`: `id`.
- `start_url` dan `scope`: `./`; `display`: `standalone`; `orientation`: `any`.
- `background_color` dan `theme_color`: `#0B0E14`.
- Icon `icon-192.png` ukuran 192×192 untuk `any`; `icon-512.png` ukuran 512×512 untuk `any` dan `maskable`.
- Semua `src` icon berupa path relatif root. Jangan memindahkan icon ke `assets/icons/` tanpa memperbarui manifest dan semua referensi HTML/JS.

### Service worker aktual (`sw.js`)

- Cache version: `ap-v57`.
- Precache saat install: `./`, `index.html`, `manifest.webmanifest`, `icon-192.png`, `icon-512.png`. Setiap `cache.add()` dibungkus `catch`, sehingga kegagalan satu item tidak menggagalkan keseluruhan precache. Install memanggil `skipWaiting()`.
- Activate menghapus cache lama yang namanya diawali `ap-` selain versi aktif, lalu memanggil `clients.claim()`.
- Request selain GET, selain HTTP(S), dan request ke domain yang mengandung `.supabase.co` tidak ditangani oleh cache strategy worker.
- Navigasi menggunakan network-first dengan timeout fallback sekitar 3,5 detik ke cache request, `./`, atau `index.html`.
- Request GET non-navigation untuk origin aplikasi menggunakan network-first dengan fallback cache agar CSS/JS/asset lokal terbaru segera dipakai saat online. Resource eksternal tetap cache-first agar lebih tahan saat offline.
- Fungsi `keep()` menyimpan response sukses atau opaque ke cache secara asynchronous.
- Registrasi dilakukan dari `assets/js/21-patch.js` saat `load`, hanya jika Service Worker didukung dan protokol halaman HTTP(S). Setelah register, kode menunggu `navigator.serviceWorker.ready` dan memperbarui status elemen `#offst`; `controllerchange` juga memperbarui status tersebut.
- `offlineNote()` berada di `assets/js/00-app-core.js`; teks status membedakan browser tanpa dukungan, akses `file://`, worker belum mengontrol halaman, dan mode offline aktif.

### Update PWA stage19

- Cache version aktif: `ap-v57`.
- `assets/js/21-patch.js` menjadi satu-satunya sumber registrasi Service Worker; `assets/js/21-rpe-controls.js` tidak lagi melakukan registrasi kedua.
- Navigasi dan asset aplikasi lokal memakai network-first dengan fallback cache, sehingga perubahan HTML/CSS/JS lebih cepat diterapkan pada PWA saat online.
- Resource eksternal tetap cache-first untuk mempertahankan dukungan offline.
- Saat strategi cache atau asset PWA berubah secara material, naikkan `V` di `sw.js` agar cache lama dibersihkan.

### Batas verifikasi

- Keberadaan dan isi file sudah diverifikasi secara statis dari arsip. Installability dan perilaku offline belum diuji melalui browser/perangkat.
- `CORE` hanya mem-precache shell HTML, manifest, dan dua icon; CSS/JS/font eksternal tidak dimasukkan ke precache list eksplisit. Aset GET yang diminta saat online dapat masuk runtime cache melalui fetch handler.
- Font Barlow diambil dari Google Fonts; worker tidak menangani request Supabase.
- Jangan menganggap aplikasi sepenuhnya offline-ready hanya dari keberadaan service worker; lakukan pengujian online-install-refresh-offline.

**Aturan maintenance:** pertahankan nama file, lokasi root, cache versioning, dan path relatif kecuali perubahan memang diperlukan. Jika isi strategi cache berubah, naikkan versi cache (`ap-v57` saat audit) dengan sengaja agar cache lama dibersihkan; jangan mengubah strategi tanpa mempertimbangkan update/offline behavior.

## 14. UI / Design System

### Visual direction

- Dark dashboard, aksen biru/cyan, card berlapis, kontras teks terang, panel navy.
- Font Google Fonts: `Barlow` (400/500/600) dan `Barlow Condensed` (600/700). Fallback system sans-serif.
- CSS aktif di-link dalam urutan 01 sampai 06. `index.html` juga memiliki banyak `<style>` inline dengan ID refinement versi. Cascade dan urutan sumber sangat berpengaruh.

### Token yang ditemukan

Nilai root berubah/ditimpa di beberapa blok inline dan stylesheet. Nilai desain yang muncul antara lain:

| Token | Nilai yang ditemukan |
|---|---|
| `--bg` | `#080D17` (juga `#0B0E14` pada stylesheet awal) |
| `--card` | `#111A2A` (awal: `#161B26`) |
| `--navy` | `#17243A` (awal: `#1B2438`) |
| `--line` | `rgba(148,163,184,.16)` (awal: `#26304a`) |
| `--ink` | `#F1F5FC` (awal: `#EEF2FA`) |
| `--mute` | `#94A3B8` (awal: `#8C97B2`) |
| `--blue` | `#397BFF` (awal: `#2F7BFF`) |
| `--blue2` | `#78A9FF` (awal: `#6aa2ff`) |
| `--radius-card` | `20px` |
| `--radius-control` | `13px` (beberapa token lain memakai 14px) |
| `--shadow-card` | `0 12px 30px rgba(0,0,0,.16)` |
| `--ui-page-max` | `1240px` |
| `--ui-desktop-max` | `1440px` |
| `--ui-workout-max` | `1180px` |
| `--ui-sidebar` | `248px` |
| `--ui-gutter` | `32px` |

Token di atas adalah nilai yang teramati, bukan jaminan satu-satunya nilai final. Periksa cascade dan computed style sebelum mengubah warna atau spacing.

### Komponen visual

- `.card`, `.hero`, `.btn`, `.btn.ghost`, `.chip`, `.stat`, `.grid`, `.sheetbg`, `.sheet`, `.toast`, `.bar`, `.hm`, `.ring` dan kelas khusus halaman.
- Modal/sheet memiliki banyak refinement di inline CSS dan patch scroll lock.
- Navigasi `#nav` adalah bottom navigation pada layout kecil; CSS/inline refinements mengatur posisi dan dot status.
- Workout memiliki layout tersendiri melalui `body.wk`, `.wk-session-*`, `.wk-exercise-card`, `.set`, `.slide`, `.rest`.
- Chart dirender melalui SVG/HTML helper di core, bukan library chart eksternal yang terdeteksi.
- Ikon navigasi dan visual muscle dibuat dari inline SVG/string di JS. Tidak ditemukan icon package.

## 15. Responsive Behavior

Responsive rules tersebar di enam CSS aktif dan banyak `<style>` inline di `index.html`.

Breakpoint yang ditemukan termasuk:
- `max-width: 699px` / `min-width: 700px` sebagai pemisah mobile dan desktop yang sering dipakai.
- `max-width: 599px`, `max-width: 600px`, `max-width: 560px` untuk modal/card/komponen.
- `max-width: 380px` atau `379px` untuk layar sangat kecil.
- `min-width: 860px`, `899px`, `900px`, `1024px`, `1200px`, `1280px`, `1440px` untuk layout lebar.
- Kombinasi `min-height: 521px` untuk beberapa layout desktop.

Perilaku khusus:
- Desktop memakai batas lebar konten dan layout grid/kolom; terdapat token sidebar desktop.
- Tablet memiliki aturan antara `700px–1023px`.
- Mobile memakai bottom navigation, card/stacked layout, modal/sheet yang disesuaikan, dan workout input grid khusus.
- Workout mobile mendukung swipe antar exercise, dengan pengecualian saat gesture dimulai dari input/button/modal.
- CSS mengatur safe-area inset dan `interactive-widget=resizes-content` di viewport meta.
- Ada aturan `prefers-reduced-motion: reduce` di stylesheet kandidat/aktif tertentu; pastikan cascade aktif saat mengubah animasi.

Jangan menghapus atau meratakan media query. Perubahan UI harus dites pada desktop, tablet, mobile lebar normal, dan layar sempit sekitar 380px.

## 16. Component & Function Map

| Area | Fungsi penting di runtime core |
|---|---|
| App/render | `view()`, `render()`, `rr()`, `pgAnim()` |
| Program | `days()`, `dayChips()`, `weekRows()`, `dayEdit()`, `editList()`, `exList()`, `saveProg()` |
| Workout | `startWorkout()`, `activeView()`, `SX()`, `goSlide()`, `slideNav()`, `slideBtns()`, `exMode()`, `prev()` |
| Set/timer | `wtTargetSeconds()`, `wtElapsed()`, `wtRemaining()`, `wtCommit()`, `wtAutoComplete()`, `wtRefresh()`, `wtStart()`, `restStart()`, `tick()`, `stopRest()`, `beep()` |
| Workout helpers | `rpeRow()`, `ssRow()`, `swRow()`, `restFor()`, `rec()`, `recAct()`, `recTxt()`, `tipHtml()` |
| History | `historyFiltered()`, `historyStats()`, `histItem()` |
| PR/strength | `bestKg()`, `prData()`, `prCount()`, `prHtml()`, `prPanel()`, `est1()`, `exTarget()`, `overloadSummary()` |
| Weekly insight | `weeklyCoach()`, `weeklyReview()`, `weekCmp()`, `weekStrip()`, `deloadCard()`, `streak()` |
| Physique | `bodyCard()`, `photoCard()`, `physiqueProgressCard()`, `phOpen()`, `loadPh()`, `savePh()` |
| Progress charts | `lineChart()`, `barChart()`, `chart()`, `pgSummary()`, `progressCards()`, `muscleCard()`, `heatCard()` |
| Profile/backup | `prof()`, `profileCard()`, `badgeCard()`, `badges()`, `themeCard()`, `backupCard()`, `bmiCard()` |
| UI utility | `toast()`, `undoToast()`, `arm()`, `esc()`, `fmt()`, `offlineNote()` |
| Auth/cloud | `flush()`, `pull()`, `go()`, `upd()` dalam IIFE `24-patch.js` |

**Patch aktif yang penting (urutan script 01–23):**
- `01-patch.js`: animasi/pop feedback setelah set ditandai selesai.
- `02-patch.js`: animasi angka dashboard dengan menghormati reduced motion.
- `03-patch.js`: interaksi slider foto before/after.
- `04-patch.js`: penggantian tema aksen `ap_theme`.
- `05-patch.js`: haptic feedback.
- `06-patch.js`: menghentikan audio/haptic saat interaksi pointer.
- `07-patch.js`: kalkulator plate/loading bar.
- `08-patch.js`: Exercise Library/custom selection yang memakai `ap_lib`; tombol `Detail` mengelola metadata exercise melalui `window.apExerciseCatalog` dan `ap_exercise_meta`.
- `data/exercise-catalog.js`: API registry aktif `window.apExerciseCatalog.get(name)`, `.save(name, patch)`, `.read()`, `.remove(name)`; metadata tidak mengganti nama/kategori yang disimpan oleh `ap_lib`.
- `10-patch.js`: detail/thumbnail exercise membaca foto, otot, dan peralatan dari registry; tetap memakai fallback gambar/otot/instruksi lama bila metadata custom tidak tersedia.
- `09-patch.js`: keyboard/visual viewport adjustment.
- `10-patch.js`: rekomendasi program, template, onboarding, dan restore jadwal (`ap_recv`, `ap_tplv`, `ap_prog_prev`, `ap_onb`).
- `11-patch.js`: edit detail workout history.
- `12-patch.js`: menyimpan catatan sesi terakhir ke `ap_sessions`.
- `13-patch.js`: refresh stopwatch elapsed workout.
- `14-patch.js`: tooltip.
- `15-patch.js`: dismiss weekly review/deload dan share sesi (`ap_wr`, `ap_dl`).
- `16-patch.js`: set/reset target berat (`ap_target`) dan share handler tambahan.
- `17-patch.js`: modal/kartu gambar history dan aksi share.
- `18-patch.js`: pemilihan pose foto dan pemanggilan `loadPh()`.
- `19-patch.js`: penyimpanan catatan exercise (`ap_xnotes`) dan warm-up set.
- `20-patch.js`: animasi progress dengan reduced-motion handling.
- `21-patch.js`: RPE set, CSV export, service-worker registration, online/offline toast.
- `22-patch.js`: pairing superset dan refinement tombol close modal.
- `23-patch.js`: modal penjelasan RPE.

**Catatan:** beberapa fungsi juga muncul di `features/*.js` sebagai salinan. Saat mencari sumber yang benar, cek apakah file tersebut direferensikan oleh `index.html`; untuk runtime sekarang, core dan patch bernomor yang dimuat adalah sumber utama.

## 17. Where to Edit What

| Permintaan perubahan | Mulai periksa file | Fungsi/selector/area |
|---|---|---|
| Login/signup/logout | `assets/js/24-patch.js` | `go`, `show`, `setMode`, `sb.auth.*`, `data-sb-login/logout/sync` |
| Cloud sync | `assets/js/24-patch.js` | `flush`, `pull`, `saveQ`, `apKeys`, `SKIP`, table `user_data` |
| Home/dashboard | `assets/js/00-app-core.js` | `view()` cabang `home`, `weeklyCoach`, `prHtml`, `chart`, `streak` |
| Workout program | `assets/js/00-app-core.js` | `PROG`, `dayEdit`, `editList`, `exList`, `saveProg`, `customCard` |
| Tambah/pilih exercise | `assets/js/08-patch.js` | `LIB`, `ALL`, `ap_lib`, `data-pg`, `#pka` |
| Foto dan detail exercise | `assets/js/08-patch.js`, `assets/js/data/exercise-catalog.js`, `assets/js/00-app-core.js`, `assets/js/10-patch.js`, `assets/css/06-styles.css` | `editMeta()`, `apExerciseCatalog.get/save()`, `exImg()`, `exInfo()`, `tipHtml()`, `apThumb()`, `apDetail()`, `[data-pvx]` |
| Kartu rekomendasi mingguan bergambar | `assets/js/10-patch.js`, `assets/css/06-styles.css` | `recSheet()`, `plan()`, `apTplCard()`, `apExList()`, `.ap-recommend-day`, `.ap-rec-exercise`, `[data-tg]`, `[data-pvx]` |
| Active workout layout | `assets/js/00-app-core.js` | `activeView`, `.wk-session-*`, `.wk-exercise-card`, `body.wk` |
| Start/resume/finish workout | `assets/js/00-app-core.js` | `startWorkout`, `getA`, handler `[data-finish]`, `ap_active` |
| Set input / reps / kg | `assets/js/00-app-core.js` | `activeView`, `[data-f]`, `[data-done]` |
| Timer exercise | `assets/js/00-app-core.js` | `wtStart`, `wtRefresh`, `wtTargetSeconds`, `.time-timer`; CSS `05-styles.css` + inline workout CSS |
| Rest timer | `assets/js/00-app-core.js` | `restStart`, `tick`, `stopRest`, `restFor`, `#rest` |
| Warm-up / superset / RPE | `assets/js/00-app-core.js`, `assets/js/01-patch.js`, `assets/js/22-patch.js` | `[data-w]`, `[data-addw]`, `[data-ss]`, `[data-rpe]`, `rpeRow` |
| PR / estimated 1RM | `assets/js/00-app-core.js`, `assets/js/core/utils.js` | `prData`, `prPanel`, `prHtml`, `bestKg`, `est1` |
| Progressive overload | `assets/js/00-app-core.js` | `exTarget`, `overloadSummary`, `rec`, `recAct`, `recTxt` |
| Progress layout/charts | `assets/js/00-app-core.js` | `view()` cabang progress, `progressCards`, `lineChart`, `barChart`, `muscleCard` |
| Weight / BMI | `assets/js/00-app-core.js` | `weightForm`, `bmiCard`, `saveKg`, `saveBmiHeight`, `ap_weights`, `ap_profile` |
| Measurements | `assets/js/00-app-core.js` | `bodyCard`, `[data-savebody]`, `ap_body` |
| Progress photos | `assets/js/00-app-core.js` | `photoCard`, `physiqueProgressCard`, `phOpen`, `loadPh`, `savePh`, IndexedDB |
| History search/filter | `assets/js/00-app-core.js` | `historyFiltered`, `historyStats`, `histItem`, `#histQ`, `[data-hr]` |
| Edit/delete history | `assets/js/00-app-core.js` | `[data-dels]`, `[data-delall]`; check handler coverage before relying on standalone `11-history-editor.js` |
| Profile fields | `assets/js/00-app-core.js` | `profileCard`, `[data-ep]`, `[data-pc]`, `[data-ps]` |
| Theme | `assets/js/00-app-core.js` | `themeCard`, `ap_theme`, `document.documentElement.dataset.theme` |
| Backup/restore | `assets/js/00-app-core.js` | `backupCard`, `BK`, `[data-bk]` |
| CSV export | `assets/js/21-patch.js` | `[data-csv]`, `dl()` |
| Toast | `assets/js/00-app-core.js` | `toast`, `undoToast`, `#toast` |
| Modal scroll lock | `assets/js/25-patch.js`, `assets/js/26-patch.js` | `.schedule-recommendation-modal`, `.sheetbg`, `.modal-lock`, `.modal-open` |
| Navigation | `assets/js/00-app-core.js` | `tab`, `IC`, `NAMA`, `render()`, `#nav`, `data-go` |
| Responsive styles | `assets/css/01-styles.css`–`06-styles.css` dan `<style>` di `index.html` | Media queries, page-specific selectors; urutan cascade harus dipertahankan |
| PWA | `index.html`, `assets/js/21-patch.js`, `manifest.webmanifest`, `sw.js`, `icon-192.png`, `icon-512.png` | manifest link, Apple touch icon, `navigator.serviceWorker.register('sw.js')`, precache/fetch handler |

## 18. Development Rules

1. Jangan membuat ulang project dari nol.
2. Jangan mengganti arsitektur vanilla HTML/CSS/JS tanpa alasan kuat dan persetujuan.
3. Jangan menghapus fitur yang sudah ada atau membuat versi duplikat.
4. Jangan memangkas isi file besar hanya agar lebih pendek.
5. Pertahankan fitur lama saat menambah fitur baru.
6. Buat perubahan sekecil mungkin dan patch file yang relevan.
7. Jangan mengubah UI yang tidak berkaitan dengan permintaan.
8. Jangan mengganti nama localStorage key tanpa kebutuhan kuat dan migrasi data.
9. Jangan merusak data existing; jangan mengubah bentuk object session tanpa kompatibilitas/migrasi.
10. Jangan mengganti sistem localStorage/IndexedDB tanpa alasan dan rencana migrasi.
11. Jangan mengubah Supabase URL/key/table/auth settings secara spekulatif.
12. Jangan menaruh secret/service-role key di client-side code.
13. Jangan menghapus integrasi PWA. Keempat file PWA berada di root; pertahankan nama/path dan uji installability serta offline behavior setelah perubahan.
14. Jangan menghapus responsive behavior atau safe-area handling.
15. Jangan menambahkan emoji ke UI aplikasi.
16. Pertahankan typography Barlow/Barlow Condensed, token, spacing, border, radius, warna, dan hierarchy yang ada.
17. Pertahankan urutan stylesheet, inline CSS, dan script kecuali dependency telah diperiksa.
18. Jangan menganggap file `features/`, `data/`, `*-supabase-*`, atau `*-patch.js` yang tidak direferensikan sebagai runtime aktif.
19. Sebelum memindahkan fungsi dari core, periksa global dependency, event binding, closure, dan urutan eksekusi.
20. Jangan membuat fungsi global dengan nama yang sudah ada; cek `00-app-core.js` dan patch yang dimuat.
21. Jangan mengubah perilaku sync, daftar `SKIP`, `BK`, atau key `ap_*` tanpa menilai dampak data lokal/cloud.
22. Exercise Library memakai `ap_lib` untuk daftar nama dan `ap_exercise_meta` untuk metadata. Jangan menggabungkan atau mengganti keduanya tanpa migrasi; jangan mengubah nama exercise yang sudah dipakai `ap_prog`/`ap_sessions` tanpa strategi kompatibilitas.
23. Foto demonstrasi exercise yang dirujuk lewat path harus ikut disimpan/di-commit di `assets/images/exercises/`; backup JSON hanya menyimpan metadata/path, bukan file gambar.
24. Pertahankan fallback gambar/otot/instruksi existing bila metadata custom belum tersedia.
25. Jangan menghapus foto atau mengubah format data foto tanpa migrasi IndexedDB/fallback.
26. Jangan mengklaim bug/perbaikan selesai sebelum file diperiksa dan test yang relevan dijalankan.
27. Periksa desktop dan mobile, termasuk viewport sempit.
28. Jalankan syntax check pada JavaScript yang berubah dan pemeriksaan diff setelah patch.
29. Jika ada ketidakpastian, sebutkan dan minta hanya file/akses yang relevan.


## 19. Bug Fixing Workflow

1. Identifikasi gejala dan langkah reproduksi.
2. Cari file runtime yang benar melalui referensi `index.html`.
3. Cari fungsi, selector, data attribute, dan event handler terkait.
4. Telusuri dependency ke state, storage, CSS, patch, dan backend bila relevan.
5. Tentukan perubahan paling kecil yang dapat memperbaiki masalah.
6. Implementasikan patch lokal; jangan menulis ulang seluruh file jika satu bagian saja bermasalah.
7. Jalankan syntax check pada JavaScript dan validasi referensi file.
8. Periksa kemungkinan regresi pada fitur yang memakai state/fungsi yang sama.
9. Pastikan data existing dan fitur lama tetap berjalan.
10. Periksa desktop dan mobile, lalu laporkan file/fungsi yang berubah dan test yang benar-benar dilakukan.

## 20. Feature Development Workflow

1. Cari apakah fitur tersebut sebenarnya sudah ada di core atau patch aktif.
2. Cari fungsi/data/state yang dapat digunakan kembali.
3. Tentukan sumber runtime; jangan otomatis mengembangkan kandidat modul yang belum dimuat.
4. Integrasikan dengan sistem existing, bukan membuat sistem paralel.
5. Tambahkan UI pada cabang `view()`/helper yang sesuai.
6. Tambahkan logic dan event handler dengan pola existing.
7. Hubungkan ke storage hanya bila perlu; gunakan key dan skema yang kompatibel.
8. Hubungkan ke sync hanya setelah menilai scope `ap_*`, `SKIP`, dan struktur `user_data`.
9. Pastikan responsive dan aksesibilitas dasar.
10. Pastikan fitur lama tetap berjalan, jalankan syntax check, dan laporkan perubahan.

## 21. Dependency Map

```text
index.html
 ├─ CSS 01-styles ... 06-styles (cascade aktif)
 ├─ core/utils.js
 ├─ 00-app-core.js
 │   ├─ state + ls wrapper
 │   ├─ PROG / workout program
 │   ├─ Home
 │   ├─ Workout
 │   │   ├─ ap_active
 │   │   ├─ exercise/set input
 │   │   ├─ timers / rest / RPE / superset
 │   │   └─ finish -> ap_sessions
 │   ├─ History <- ap_sessions
 │   ├─ Progress <- ap_sessions / ap_weights / ap_body / photos
 │   │   ├─ PR / estimated 1RM
 │   │   ├─ progressive overload
 │   │   ├─ weekly coach / volume / muscle analysis
 │   │   └─ consistency / charts
 │   └─ Profile <- ap_profile / ap_theme / backup
 ├─ patches 01..23 (extend/override runtime)
 ├─ Supabase CDN
 ├─ 24-patch.js
 │   ├─ auth session
 │   ├─ ls.set wrapper -> dirty queue sbq
 │   ├─ flush -> user_data upsert
 │   └─ pull <- user_data -> localStorage
 ├─ 25-patch.js -> recommendation modal scroll lock
 └─ 26-patch.js -> sheet modal scroll lock

Exercise Library (`ap_lib`) + metadata (`ap_exercise_meta`) -> exercise picker/detail/thumbnail -> workout program (`ap_prog`) -> active workout (`ap_active`)
Exercise metadata image path -> `assets/images/exercises/` file -> `exImg()` -> `apThumb()` / `apDetail()` / `musBlock2()`
`ap_exercise_meta` -> `exMode()` / `exInfo()` / `tipHtml()` -> mode default / peta otot / instruksi teknik

Workout program (ap_prog) -> Workout session (ap_active)
Workout completion -> ap_sessions
ap_sessions -> History / PR / 1RM / overload / weekly coach / volume / muscle / streak
ap_weights + ap_profile.height -> BMI and weight trend
ap_body -> body measurement progress
IndexedDB ap_db/kv/photos -> progress photo gallery / comparison
ap_profile -> Home greeting / program frequency / Profile
```


## 22. Intelligence Pipeline — Stage 16

Tahap 16 menambahkan audit deterministik untuk memastikan seluruh rantai recommendation tidak menghasilkan keputusan yang saling bertentangan dan tetap aman sebelum masuk ke workout aktif.

### Rantai intelligence aktif

```text
Canonical Training Data (`ap_training_model_v1`)
        ↓
Exercise Progression (`apExerciseProgression`)
        ↓
Session Evaluation
        ↓
Weekly Adaptation / Weekly Coach
        ↓
Adaptive Engine
        ↓
Unified Recommendation (`apUnifiedRecommendation`)
        ↓
Decision Trace (`apRecommendationDecisionTrace`)
        ↓
Safety Guardrails (`apRecommendationGuardrails`)
        ↓
Workout aktif
```

### API utama Stage 13–16
- `window.apUnifiedRecommendation`: satu keputusan final per gerakan.
- `window.apRecommendationDecisionTrace`: penjelasan sumber dan alasan keputusan.
- `window.apRecommendationGuardrails`: validasi dan sanitasi rekomendasi sebelum menjadi input aktif.
- `window.apIntelligenceAudit`: pemeriksaan readiness/audit runtime ringan tanpa mengubah history.

### Aturan prioritas keputusan
- `Deload / Pemulihan` memiliki prioritas tertinggi.
- `Kurangi Volume` berada di bawah deload.
- `Rotasi Gerakan` berada di bawah pengurangan volume.
- `Pertahankan & Progres` berada di atas `Naikkan Progres`.
- Feedback exercise/session yang spesifik dapat mengalahkan rekomendasi mingguan yang bersifat umum.

### Guardrail progression
- Kenaikan beban dibatasi dengan aturan `10% atau 2.5 kg, mana yang lebih ketat` untuk checkpoint progression.
- Repetisi dibatasi pada target maksimum yang tersedia.
- Beban negatif dikoreksi.
- Volume reduction tidak boleh memotong beban lebih dari 25% dari acuan pada checkpoint ini.
- Deload berada pada sekitar 70–90% dari beban acuan bila data beban tersedia.
- Input manual pengguna tidak boleh terus-menerus ditimpa oleh guardrail.

### Audit Stage 16
Skenario konflik dan boundary diuji melalui:

```bash
node tools/stage16-intelligence-audit.js
```

Hasil baseline Stage 16: **12/12 skenario lulus**. Detail berada di `audit/FULL_INTELLIGENCE_AUDIT_STAGE16.md`.

### Maintenance rule
Jika Stage 13–16 diubah, jalankan kembali audit deterministik sebelum membuat ZIP baru. Jangan mengubah completed history untuk memperbaiki recommendation engine.

## 23. Stage 17 — End-to-End Intelligence QA

Stage 17 menambahkan diagnostic-only QA layer untuk memastikan kontrak runtime intelligence Gym dan Home Gym tersambung dari workout flow sampai recommendation pipeline.

### Runtime files
- `assets/js/58-intelligence-e2e-qa.js`
- `assets/css/25-intelligence-e2e-qa.css`

### QA runner
- `tools/stage17-e2e-intelligence-qa.js`
- `audit/END_TO_END_INTELLIGENCE_QA_STAGE17.md`

### Scope
Pipeline yang diperiksa:

`Workout Launch → Active Workout → Logging → Completion → Session Evaluation → Canonical Training Model → Exercise Progression → Weekly Adaptation → Adaptive Engine → Unified Recommendation → Decision Trace → Safety Guardrails → Next Workout`

Stage 17 memeriksa bahwa runtime script Stage 44–58 dimuat tepat satu kali dan API intelligence utama tersedia. Diagnostic layer tidak mengubah completed history atau keputusan recommendation.

### Regression gate
Stage 16 deterministic audit tetap menjadi regression gate dan baseline saat Stage 17 dibuat adalah **12/12 skenario lulus**.

### Browser QA limitation
Static/runtime contract checks bukan pengganti browser interaction test. Pada lingkungan audit ini automated Chromium interaction terhadap halaman lokal tidak stabil, sehingga browser E2E tidak dinyatakan 100% lulus. Pengujian manual tetap diperlukan untuk alur Gym dan Home Gym dari mulai workout sampai sesi berikutnya.

### Perintah QA
```bash
node tools/stage16-intelligence-audit.js
node tools/stage17-e2e-intelligence-qa.js
```

## 24. Known Issues

Temuan berikut adalah fakta pemeriksaan arsip, bukan semuanya bug runtime yang sudah direproduksi:

### PWA (static inspection complete; runtime not tested)
- Keempat file PWA (`manifest.webmanifest`, `sw.js`, `icon-192.png`, `icon-512.png`) tersedia di root dan path relatifnya konsisten dengan referensi HTML/manifest yang diperiksa. Tidak ada missing PWA asset yang terkonfirmasi pada arsip terbaru.
- Installability, update lifecycle, dan offline behavior belum diuji melalui browser/perangkat; ini adalah batas pengujian, bukan bug yang sudah terbukti.
- `sw.js` tidak precache CSS/JS/font secara eksplisit; file GET yang diminta dapat masuk runtime cache. Pastikan ini sesuai kebutuhan offline sebelum mengubahnya.

### Refactor / maintenance risks (confirmed)
- `00-app-core.js` sangat besar dan tetap menjadi runtime utama; fungsi yang sama disalin ke beberapa `features/*.js` dan `standalone-candidates.js`.
- Sebagian besar kandidat feature/data/core belum dimuat oleh `index.html`; pengecualian aktif yang ditambahkan adalah `assets/js/data/exercise-catalog.js`. File kandidat lain tetap tidak memengaruhi runtime jika tidak direferensikan oleh HTML.
- Ada file bernama `24-supabase-cdn.js` yang berisi tag `<script>` sebagai isi file, dan `25-supabase-auth-sync.js` yang menduplikasi auth/sync; keduanya tidak dimuat. Sumber aktif adalah CDN tag di HTML dan `24-patch.js`.
- `PROJECT_MAP.md` dan `Plain_text.md` kosong.
- `TREE.txt` tidak mencerminkan semua file yang ada di arsip; gunakan `find`/tree aktual, bukan file itu sebagai satu-satunya acuan.

- **Kontrak return `exImg()`:** semua override `exImg()` harus mengembalikan array dengan bentuk yang sama dengan versi core, yaitu `['^nama', pathGambar, overlay[], lebar, tinggi]` atau `null`. `exFig()` mengakses `e[2]` dan akan error jika elemen tersebut tidak ada. Override di `28-home-workout.js` (dimuat paling akhir di `index.html`) sudah disesuaikan pada 15 Nov 2026; periksa kembali bentuk ini bila `exImg()` di-override lagi.

### Not verified / unknown
- UI editor metadata Exercise Library dan kartu rekomendasi mingguan bergambar telah melalui syntax-check. Pengujian browser otomatis tidak dapat dijalankan pada lingkungan audit ini; lakukan uji klik di browser target. Pastikan path gambar benar-benar ada. Foto bawaan yang tersedia tetap terbatas; exercise tanpa foto akan menampilkan placeholder sampai file foto ditambahkan.
- Tidak ada browser QA atau test suite otomatis yang disertakan/dijalankan sebagai bagian audit.
- Tidak ada schema database/RLS Supabase dalam arsip; akses/keamanan table `user_data` tidak dapat diverifikasi.
- Tidak ada bukti dari audit statis saja untuk menyimpulkan installability/offline PWA sukses atau gagal; perlu pengujian browser melalui HTTPS.
- Tidak ada bukti cukup untuk menyatakan ada bug pada workout, progress, auth, atau chart selain hal-hal yang secara eksplisit dicatat pada bagian Known Issues.

## 25. Recent Changes

### 15 Nov 2026 — End-to-End Intelligence QA — Stage 17
- Menambahkan `assets/js/58-intelligence-e2e-qa.js` sebagai diagnostic-only runtime contract checker.
- Menambahkan `assets/css/25-intelligence-e2e-qa.css` untuk status diagnostic jika runtime menemukan contract yang belum siap.
- Menambahkan `tools/stage17-e2e-intelligence-qa.js` untuk memeriksa script/API/asset Stage 44–58 dan integrasi runtime yang diperlukan.
- Menambahkan `audit/END_TO_END_INTELLIGENCE_QA_STAGE17.md`.
- Mempertahankan Stage 16 deterministic audit sebagai regression gate: 12/12 skenario lulus.
- Memperbarui `PROJECT_GUIDE.md` dengan pipeline Stage 17, batas pengujian browser, dan perintah QA.


### 15 Nov 2026 — Full Intelligence Audit & Conflict Testing — Stage 16
- Menambahkan `assets/js/57-intelligence-audit.js` sebagai readiness/audit layer runtime yang tidak mengubah history.
- Menambahkan `assets/css/24-intelligence-audit.css` untuk status audit bila diagnostic UI dirender.
- Menambahkan `tools/stage16-intelligence-audit.js` untuk pengujian deterministic Stage 13 + Stage 15.
- Memperbaiki guardrail progression agar menggunakan `min(2.5 kg, 10%)`, bukan batas yang lebih longgar.
- Memperbaiki koreksi beban negatif yang sebelumnya memiliki kondisi mustahil (`> 0` dan `< 0` sekaligus).
- Memperbaiki tag script Stage 14 yang terpotong di `index.html`.
- Hasil audit: 12/12 skenario lulus.



### 15 Nov 2026 — Perbaikan error saat memulai workout
- **Gejala:** menekan tombol mulai workout (`[data-start]`) memicu `TypeError: Cannot read properties of undefined (reading 'length')` dan layar workout aktif tidak tampil. Sesi `ap_active` sempat tersimpan, tetapi `render()` berhenti saat membuat blok otot/foto gerakan.
- **Penyebab:** override `exImg()` di `assets/js/28-home-workout.js` mengembalikan `[null, meta.image]` (dua elemen) untuk gerakan yang punya `image` di metadata katalog. `exFig()` di `assets/js/00-app-core.js` membaca `e[2].length`, sehingga `e[2]` yang tidak ada menyebabkan error melalui rantai `startWorkout()` → `render()` → `activeView()` → `musBlock2()` → `exFig()`. Versi asli `exImg()` di core sudah mengembalikan lima elemen.
- **Perbaikan:** satu baris di `assets/js/28-home-workout.js` diubah menjadi `return [null, meta.image, [], 300, 521];`. Bentuk array kini sama dengan `exImg()` di core: `e[2]` berupa array overlay kosong, sehingga `exFig()` menampilkan foto tanpa overlay otot.
- **Dampak:** hanya file `assets/js/28-home-workout.js` yang berubah. `apThumb()`, `apDetail()`, filter Library, dan pemakai `exImg()` lain hanya membaca `im[1]` (path gambar), jadi perilakunya tidak berubah. Format `PROG`, `ap_active`, riwayat, dan storage key tidak diubah.
- **Pengujian:** dijalankan di Chromium headless melalui `file://` dengan jaringan eksternal diblokir (CDN Supabase tidak dimuat). Program contoh berisi gerakan beban, bodyweight, dan waktu. Sebelum perbaikan error muncul dan layar workout tidak tampil; sesudah perbaikan layar workout aktif tampil, perpindahan antar gerakan berjalan, dan tidak ada page error setelah reload. Login/sync Supabase dan perilaku PWA/service worker tidak diuji.

### 14 Nov 2026 — Kartu rekomendasi mingguan bergambar
- Kartu hari di modal Rekomendasi jadwal mingguan kini menampilkan preview hingga tiga exercise, thumbnail yang tersedia, nama, dan target set/repetisi.
- Mengetuk thumbnail/nama membuka modal detail exercise; tombol Lihat semua menampilkan daftar lengkap untuk hari tersebut.
- Detail exercise menampilkan informasi otot/peralatan, mode pencatatan, instruksi, serta placeholder yang jelas jika foto belum tersedia.
- Styling responsif ditambahkan di `assets/css/06-styles.css`; logic berada di `assets/js/10-patch.js`.
- Tidak mengubah format jadwal, data workout, atau storage key.

### 14 Nov 2026 — Perluasan Exercise Library
- Memperluas daftar exercise bawaan di `assets/js/08-patch.js` pada tujuh kategori yang sudah ada.
- Mempertahankan `ap_lib` untuk custom exercise dan `ap_exercise_meta` untuk metadata; format program dan riwayat workout tidak diubah.
- Menambahkan `assets/images/exercises/README.md` sebagai panduan penyimpanan foto demonstrasi. Panduan folder gambar diperbarui agar mendukung lembar komposit yang dipotong menjadi aset WebP individual.


> Catatan katalog: gambar bawaan saat ini tersedia untuk 10 gerakan kaki/core. Gerakan lain belum otomatis memiliki foto; tambahkan aset WebP per gerakan ke `assets/images/exercises/` dan daftarkan path-nya melalui metadata. Jangan menganggap seluruh 79 gerakan sudah memiliki gambar.

### Validasi pembaruan Library — 14 Nov 2026

- `node --check` berhasil untuk seluruh file JavaScript aplikasi; `assets/js/24-supabase-cdn.js` dikecualikan karena file tersebut berisi tag `<script>` HTML, bukan JavaScript mandiri.
- Pemeriksaan browser otomatis dicoba, tetapi browser di lingkungan kerja memblokir akses ke halaman lokal (`ERR_BLOCKED_BY_ADMINISTRATOR`). Karena itu, interaksi visual akhir tetap perlu diuji di browser pengguna.

## Pembaruan katalog gerakan — 14 November 2026

Katalog bawaan kini dilengkapi metadata awal untuk 79 gerakan dalam tujuh kelompok: Dada, Punggung, Bahu, Lengan, Kaki, Core, dan Kardio. Data bawaan mencakup kelompok otot utama dan pendukung, peralatan, mode pencatatan default, serta instruksi teknik berbahasa Indonesia. Metadata bawaan berada di `assets/js/data/exercise-catalog-defaults.js`; API penyimpanan dan penggabungan perubahan pengguna berada di `assets/js/data/exercise-catalog.js`. File defaults dimuat lebih dahulu di `index.html`.

Perubahan pengguna tetap disimpan pada key local storage `ap_exercise_meta` dan akan menimpa nilai bawaan per field. `window.apExerciseCatalog.get(name)` menggabungkan defaults dan perubahan lokal, sedangkan `list()` mengembalikan katalog gabungan. Gambar bawaan tersedia untuk 10 gerakan kaki/core, dengan file sumber komposit di `assets/images/exercises/source-sheets/`. Field `image` dan `imageStatus` pada 10 entri tersebut sudah menunjuk ke file yang tersedia; entri lain tetap pending sampai gambar yang sesuai ditambahkan.


### 14 Nov 2026 — Gambar gerakan kaki dan core
- Memotong lembar komposit 5×2 menjadi 10 file WebP individual di `assets/images/exercises/`.
- Menghubungkan 10 file ke metadata bawaan agar dapat tampil melalui `exImg()` pada detail/preview latihan.
- Mengarsipkan lembar sumber di `assets/images/exercises/source-sheets/` dan memperbarui README serta panduan proyek.

## Stage 18 — Workout AI Inline Card & Home Workout Responsive Polish

Stage 18 adalah tahap presentasi/UX. `Keputusan Terpadu` dan `Kenapa keputusan ini?` tidak lagi ditempatkan sebagai panel besar di atas workout aktif. Keduanya dipindahkan ke kartu gerakan aktif melalui `assets/js/59-workout-ai-inline-card.js`, sehingga keputusan AI tetap berada dekat dengan gerakan yang sedang dikerjakan.

File Stage 18:
- `assets/js/59-workout-ai-inline-card.js`
- `assets/css/26-workout-ai-inline-card.css`
- `audit/WORKOUT_AI_INLINE_CARD_STAGE18.md`

### Aturan penting Stage 18
- Tidak membuat sumber data baru.
- Tidak mengubah canonical training model.
- Tidak mengubah completed history.
- Tidak mengubah prioritas Unified Recommendation Engine.
- Tidak mengubah Decision Trace.
- Hanya mengubah lokasi/presentasi panel recommendation dan trace.
- Home Workout desktop/tablet menggunakan container terpusat, spacing konsisten, dan program card yang seimbang.

### Urutan intelligence tetap
Canonical Data → Exercise Progression → Session Evaluation → Weekly Adaptation → Adaptive Engine → Unified Recommendation → Decision Trace → Safety Guardrails → Workout.

### Urutan file Stage 18
- CSS `26-workout-ai-inline-card.css` dimuat setelah CSS Stage 25.
- JS `59-workout-ai-inline-card.js` dimuat setelah JS Stage 58.

## Stage 19 — Workout AI Inline Placement & Home Workout Layout Fix

Stage 19 memperbaiki dua masalah presentasi yang ditemukan setelah pengujian visual Stage 18:
- `Keputusan Terpadu` dan `Kenapa keputusan ini?` benar-benar dipindahkan ke kartu gerakan aktif secara independen, tanpa bergantung pada urutan sibling Stage 13/14.
- Header Home Workout, kartu `Program personal aktif`, dan kartu `TUJUAN LATIHAN` pada desktop/tablet tidak lagi mengalami penyempitan kolom akibat aturan global `.btn{width:100%}`.

File Stage 19:
- `assets/js/59-workout-ai-inline-card.js` — diperbaiki menjadi extractor yang menangani panel Stage 13 dan trace Stage 14 secara terpisah.
- `assets/css/27-home-workout-layout-fix.css` — override responsive untuk sizing tombol dan kolom informasi.
- `audit/WORKOUT_AI_INLINE_PLACEMENT_STAGE19.md`.

Aturan:
- Desktop/tablet: tombol aksi pada baris informasi menggunakan lebar konten.
- Mobile: tombol tetap full-width.
- Recommendation logic, canonical data, history, dan decision priority tidak berubah.
