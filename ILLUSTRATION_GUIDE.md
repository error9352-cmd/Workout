# ATHLETIC PHYSIQUE — ILLUSTRATION GUIDE
**Versi:** 1.0  
**Tanggal:** 15 November 2026  
**Tujuan:** Standar produksi ilustrasi gerakan baru agar seluruh aset baru konsisten dengan ilustrasi yang sudah digunakan di aplikasi Athletic Physique.

---

## 1. Tujuan dan aturan utama

Dokumen ini adalah spesifikasi visual dan teknis untuk AI image generator maupun ilustrator.

Saat diminta membuat ilustrasi gerakan baru:
1. Buat ilustrasi baru yang mengikuti standar pada dokumen ini.
2. Jangan mengubah, menggambar ulang, atau mengganti ilustrasi lama.
3. Jangan membuat lembar kontak/grid kecuali diminta secara eksplisit. Default-nya adalah **satu gambar final untuk satu gerakan**.
4. Jangan menambahkan nomor urut, nama gerakan, label, teks, watermark, logo, bingkai, atau dekorasi.
5. Jangan mengorbankan bentuk gerakan, alat, anatomi, atau arah gerak demi estetika.
6. Jika referensi gerakan tidak cukup jelas, minta referensi atau klarifikasi. Jangan mengarang detail teknik yang berisiko salah.

## 2. Identitas visual yang harus dipertahankan

Amati aset yang sudah ada di `assets/images/exercises/*.webp`. Contoh visual yang representatif antara lain `push-up-home.webp`, `bench-press.webp`, dan `dumbbell-shoulder-press.webp`.

### Karakter dan rendering
- Ilustrasi anatomi fitness 3D yang realistis dan premium.
- Subjek utama berupa figur manusia atletis dengan anatomi otot yang jelas.
- Kulit/permukaan tubuh bergaya model anatomi 3D monokrom abu-abu keperakan, dengan highlight lembut.
- Otot sasaran diberi warna merah/coral yang jelas namun tetap menyatu dengan model anatomi.
- Otot non-target tetap abu-abu/perak; jangan mewarnai seluruh tubuh merah.
- Proporsi manusia harus masuk akal, simetris bila pose menuntut simetri, dan sendi tidak terdistorsi.
- Rendering bersih, detail tinggi, pencahayaan studio lembut, tepi objek tajam, tanpa tampilan kartun atau sketsa.

### Background dan palet
- Background polos biru navy sangat gelap, mendekati `#0F1626`.
- Background bersih dan seragam; tidak memakai gym ramai, ruangan, tekstur, pola, atau gradient mencolok.
- Figur dan peralatan harus memiliki kontras yang cukup terhadap background.
- Merah/coral hanya untuk menandai kelompok otot utama yang aktif.
- Panah gerakan berwarna putih.

### Panah gerakan
- Tambahkan panah putih yang bersih, jelas, dan mudah dibaca untuk menunjukkan arah/fase gerak.
- Panah dapat melengkung bila gerakan memiliki lintasan rotasi atau lengkung.
- Ujung panah harus jelas dan mengarah ke arah gerakan yang benar.
- Panah tidak boleh menutupi wajah, sendi penting, otot target, atau bagian alat yang menentukan teknik.
- Untuk gerakan statis/isometrik, gunakan panah hanya jika membantu menjelaskan posisi atau arah gaya; jangan memaksakan panah yang menyesatkan.
- Jika gerakan memiliki dua fase penting, satu panah yang ringkas boleh menunjukkan transisi utama. Jangan membuat banyak panah yang membingungkan.

## 3. Komposisi dan format output

| Properti | Standar |
|---|---|
| Jumlah output | 1 gambar per gerakan |
| Kanvas | Persegi 1:1 |
| Ukuran kerja | 1024 × 1024 px atau lebih tinggi; ekspor final aplikasi 512 × 512 px |
| Format final | WebP |
| Background | Solid dark navy, mendekati `#0F1626` |
| Posisi subjek | Fokus di tengah, seimbang, tidak terpotong |
| Skala subjek | Besar dan mudah dibaca pada kartu aplikasi mobile |
| Margin | Sisakan ruang aman di semua sisi, terutama untuk panah |
| Teks | Tidak ada |
| Nomor | Tidak ada |
| Watermark/logo | Tidak ada |

### Framing
- Tampilkan bagian tubuh dan alat yang diperlukan untuk mengenali gerakan.
- Jangan memotong kepala, tangan, kaki, beban, pegangan, kabel, bangku, atau mesin yang penting.
- Untuk gerakan seluruh tubuh, usahakan seluruh tubuh terlihat.
- Untuk gerakan isolasi, gunakan crop yang cukup dekat agar otot target terlihat, tetapi tetap tampilkan alat dan posisi sendi yang diperlukan.
- Jangan membuat subjek terlalu kecil atau terlalu banyak ruang kosong.
- Jaga ukuran visual subjek relatif konsisten dengan aset yang sudah ada.
- Panah harus tetap berada di dalam kanvas dan tidak terpotong.

## 4. Akurasi gerakan

Setiap ilustrasi harus menggambarkan gerakan yang disebutkan, bukan sekadar pose fitness yang mirip.

Sebelum menghasilkan gambar, AI harus menentukan:
1. Posisi tubuh dan orientasi kamera yang paling jelas.
2. Peralatan yang benar dan cara pengguna memegang/menggunakannya.
3. Fase gerakan yang paling informatif (awal, tengah, atau akhir).
4. Kelompok otot utama yang perlu ditandai merah.
5. Arah gerakan yang benar untuk panah.
6. Detail pembeda dari gerakan lain yang namanya mirip.

### Contoh pembeda yang wajib diperhatikan
- **Arnold Press:** posisi awal dumbbell di depan bahu dan rotasi lengan keluar saat menekan ke atas; jangan diganti shoulder press biasa.
- **Incline Bench Press vs Incline Chest Press:** tunjukkan perbedaan bangku/barbell dengan mesin chest press secara jelas.
- **Walking Lunge:** harus menunjukkan langkah maju/berpindah, bukan hanya pose lunge statis.
- **Single-Leg Leg Press:** satu kaki yang bekerja harus terlihat jelas.
- **Cable movement:** kabel, pulley, dan titik tarikan harus terlihat bila menjadi bagian penting gerakan.
- **Resistance band movement:** band harus terlihat terpasang dan memiliki ketegangan/arah tarikan yang masuk akal.

Daftar ini adalah contoh dari catatan audit visual aplikasi; terapkan prinsip pembeda yang sama pada gerakan lain.

## 5. Prompt utama AI — salin dan gunakan

Ganti semua bagian dalam tanda kurung siku. Jangan menghapus standar visual inti.

> Create ONE premium 3D anatomical fitness exercise illustration for the Athletic Physique workout app.
>
> **Exercise:** [EXERCISE NAME]  
> **Equipment:** [EQUIPMENT OR BODYWEIGHT]  
> **Body position and camera view:** [CLEAR BODY POSITION AND BEST VIEW]  
> **Movement phase:** [MOST INFORMATIVE PHASE]  
> **Movement direction:** [DIRECTION / PATH FOR THE ARROW]  
> **Target muscles to highlight in red:** [PRIMARY TARGET MUSCLES]  
> **Important distinguishing details:** [DETAILS THAT MAKE THIS EXERCISE DIFFERENT]
>
> Match the established Athletic Physique visual identity: a highly detailed, realistic premium 3D anatomical muscular human figure, silver-gray monochrome body surface, clearly defined anatomy, and only the primary working muscle groups highlighted in vivid restrained red/coral. Use a clean solid very dark navy background close to #0F1626. Use soft professional studio lighting, crisp edges, realistic proportions, and a polished high-end fitness app illustration finish.
>
> Show the exercise with biomechanically plausible posture, correct joint alignment, correct equipment setup, and a clear readable silhouette. Include one clean white directional movement arrow with an accurate arrowhead; curve it when the movement path requires it. Keep the arrow away from important anatomy and equipment details.
>
> Square 1:1 composition, subject large and centered, consistent scale with the existing Athletic Physique exercise illustrations, all important body parts and equipment fully inside the frame, with safe margins.
>
> **No text, no exercise name, no labels, no numbers, no badges, no UI, no border, no watermark, no logo, no extra people, no collage, no grid, no multiple panels. Output exactly one image.**

## 6. Negative prompt / hal yang dilarang

Gunakan sebagai negative prompt jika generator mendukungnya:

- numbers, numbering, text, typography, labels, captions
- watermark, signature, logo, brand mark
- grid, contact sheet, collage, multiple panels, split screen
- bright/white/gradient/background scenery, gym interior, clutter
- cartoon, anime, comic, flat vector, sketch, low-poly
- fully red body, incorrect muscle highlighting
- incorrect anatomy, extra limbs, extra fingers, fused joints
- broken or floating equipment, impossible grip, incorrect cable path
- cropped head, cropped hands, cropped feet, cropped weights
- tiny subject, excessive empty space, blurry edges
- multiple arrows, confusing arrows, arrow covering the body

## 7. Workflow menambahkan satu gerakan baru ke aplikasi

### A. Buat aset gambar
1. Pastikan nama gerakan dan variasinya benar.
2. Tentukan alat, posisi tubuh, otot target, fase gerakan, dan arah panah.
3. Gunakan prompt utama pada Bagian 5.
4. Periksa anatomi, alat, arah panah, otot merah, dan kemiripan gaya dengan aset lama.
5. Jika belum sesuai, revisi gambar yang sama. Jangan mengganti gaya visual.
6. Simpan gambar final sebagai WebP persegi, idealnya 512 × 512 px.

### B. Nama file
Gunakan nama file lowercase kebab-case yang stabil dan deskriptif.

Contoh:
- `incline-dumbbell-curl.webp`
- `single-arm-cable-row.webp`
- `resistance-band-chest-press-home.webp`

Jangan memakai nama seperti `image1.webp`, `new-final.webp`, atau nama yang berubah-ubah.

### C. Lokasi file
Simpan file final di:

`assets/images/exercises/<exercise-slug>.webp`

Lembar sumber, jika memang dibuat, disimpan terpisah di:

`assets/images/exercises/source-sheets/`

Lembar sumber bukan aset yang langsung dipakai kartu aplikasi.

### D. Hubungkan ke katalog
- Periksa metadata gerakan di `assets/js/data/exercise-catalog-defaults.js`.
- Isi properti `image` dengan path relatif yang sesuai dengan pola aset yang sudah ada.
- Ikuti pola katalog yang sudah ada; jangan membuat struktur metadata baru tanpa alasan.
- Untuk perubahan lokal melalui UI, dokumentasi proyek menyebut tombol `Detail` pada Exercise Library dan penyimpanan `ap_exercise_meta`.
- Jangan mengubah logika workout, timer, progress, profile, login, database, atau file lain jika tugasnya hanya menambahkan ilustrasi.

### E. Verifikasi
- Pastikan file WebP benar-benar ada pada path yang didaftarkan.
- Pastikan gambar tampil pada kartu dan detail gerakan.
- Pastikan tidak ada nomor/tulisan yang tertinggal.
- Periksa crop pada ukuran mobile.
- Periksa bahwa panah tidak terpotong dan alat tidak hilang.
- Pastikan gambar gerakan lain tidak berubah.
- Jalankan pemeriksaan sintaks yang relevan jika metadata JavaScript diubah.
- Jangan menghapus aset atau kode lama.

## 8. Prompt untuk AI coding assistant saat memasang aset

Gunakan prompt ini setelah gambar final tersedia:

> Tambahkan satu ilustrasi latihan baru ke aplikasi Athletic Physique menggunakan file gambar yang saya berikan. Pertahankan seluruh kode, fitur, struktur folder, data, dan perilaku aplikasi yang sudah ada.
>
> 1. Salin gambar ke `assets/images/exercises/<exercise-slug>.webp`.
> 2. Daftarkan path gambar pada metadata gerakan yang tepat di `assets/js/data/exercise-catalog-defaults.js`, mengikuti pola entri yang sudah ada.
> 3. Jangan mengubah gambar gerakan lain.
> 4. Jangan menghapus, menulis ulang, memindahkan, atau memformat ulang file yang tidak diperlukan.
> 5. Jangan mengubah workout logic, timer, progress, profile, login/logout, Supabase, localStorage, service worker, atau UI lain.
> 6. Verifikasi path file, tampilan gambar, dan sintaks JavaScript.
> 7. Laporkan file yang benar-benar berubah. Perubahan harus terbatas pada file gambar baru dan metadata minimum yang diperlukan.

## 9. Checklist persetujuan ilustrasi

Sebelum gambar dianggap final, pastikan semua poin berikut:

- [ ] Gerakan benar dan mudah dikenali.
- [ ] Peralatan dan cara penggunaannya benar.
- [ ] Anatomi serta posisi sendi masuk akal.
- [ ] Otot utama yang bekerja ditandai merah.
- [ ] Otot non-target tetap silver-gray.
- [ ] Background navy gelap konsisten.
- [ ] Panah putih menunjukkan arah gerak yang benar.
- [ ] Panah tidak menutupi detail penting.
- [ ] Tidak ada nomor, tulisan, logo, atau watermark.
- [ ] Subjek cukup besar dan tidak terpotong.
- [ ] Kanvas persegi dan file final WebP.
- [ ] Tampilan konsisten dengan aset Athletic Physique yang sudah ada.

## 10. Referensi dan batasan

Panduan ini disusun dari struktur aset dan dokumentasi proyek Athletic Physique yang tersedia pada ZIP:
- `assets/images/exercises/README.md`
- `EXERCISE_VISUAL_AUDIT.md`
- Aset ilustrasi WebP yang sudah ada di `assets/images/exercises/`
- `README.md`

Dokumentasi proyek menyatakan bahwa gambar final yang dipakai aplikasi adalah file WebP per gerakan; source sheet hanya arsip/sumber pemotongan. Audit visual mencatat katalog Gym memiliki 79 gerakan bergambar pada batch audit dan penambahan Home Workout menambah variasi aset berikutnya. Angka katalog dapat berubah seiring pengembangan.

**Prinsip paling penting:** ilustrasi baru harus terasa berasal dari satu keluarga visual yang sama dengan ilustrasi Athletic Physique sekarang, tetapi tetap akurat terhadap gerakan spesifik yang digambarkan.
