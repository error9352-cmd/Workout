# Athletic Physique — Stage 13 Unified Recommendation Engine

## Tujuan
Menyatukan Exercise-Level Progression, Session Evaluation, Weekly Adaptation, Adaptive Rotation, dan konteks profil/program menjadi satu keputusan final per gerakan.

## Prioritas keputusan
1. Deload / Pemulihan
2. Kurangi Volume
3. Rotasi Gerakan
4. Pertahankan & Progres
5. Naikkan Progres

Keputusan exercise-level yang eksplisit (terutama terlalu berat, stagnasi, atau progres) diprioritaskan atas rekomendasi mingguan generik.

## Sumber
- `ap_training_model_v1`
- `window.apExerciseProgression`
- `window.apUnifiedIntelligence`
- `window.apGymIntelligence`
- `window.apHomeGymWeeklyAdaptation`
- `window.apUnifiedAdaptive`

Tidak dibuat database atau history kedua.

## API
- `window.apUnifiedRecommendation.choose(mode, name, target)`
- `window.apUnifiedRecommendation.forExercise(name, mode)`
- `window.apUnifiedRecommendation.all(mode)`
- `window.apUnifiedRecommendation.applyToActive(active)`
- `window.apUnifiedRecommendation.audit()`

## Integrasi
- Final recommendation dijalankan setelah chain `startWorkout` yang sudah ada.
- Nilai hanya diterapkan ke sesi aktif baru.
- Sesi selesai dan history lama tidak ditulis ulang.
- UI workout Stage 12 diganti menjadi satu panel `KEPUTUSAN TERPADU`, sehingga pengguna tidak menerima dua rekomendasi yang berbeda.

## Konflik
Jika sumber berbeda memberikan action berbeda, engine menyimpan `conflicts: true` dan menggunakan prioritas yang ditentukan oleh engine. UI memberi tahu bahwa sumber telah diselaraskan.

## Verifikasi
- Syntax check seluruh JS runtime yang dimuat `index.html`.
- Stage 13 JS/CSS masing-masing hanya dimuat sekali.
- ZIP diuji dengan `unzip -t`.
