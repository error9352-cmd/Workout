# Athletic Physique — Stage 12
## Progression → Workout + Adaptive Bridge

### Tujuan
Menghubungkan Exercise-Level Progression Stage 11 ke sesi workout berikutnya dan ke Adaptive Engine tanpa membuat sumber data baru.

### Sumber canonical
- `ap_training_model_v1`
- `window.apDataModel`
- `window.apExerciseProgression`

### Alur
`Completed Workout → Canonical Training Model → Exercise Progression → Recommendation → Start Workout → Active Set Defaults`

Adaptive tetap memakai engine Stage 3/4/5. Stage 12 menambahkan konteks progression dan memanggil Adaptive Engine yang sudah ada sebelum sesi baru dimulai.

### Perilaku
- Beban/repetisi yang direkomendasikan diterapkan hanya ke `ap_active` yang baru dimulai.
- Set yang sudah selesai, warm-up, dan history lama tidak diubah.
- Gym dan Home Gym memakai bridge yang sama.
- Jika progression tidak memiliki data, sistem mempertahankan perilaku existing.
- Stagnasi, tren turun, tren naik, dan stabil tersedia melalui `apProgressionWorkoutBridge`.
- Active workout menampilkan status progression gerakan yang sedang dilatih.

### API
`window.apProgressionWorkoutBridge`
- `progression(name)`
- `recommendation(q, exercise)`
- `applyToActive(a)`
- `adaptiveContext(mode)`
- `progressionAwareDecision(name)`
- `runAdaptive(mode)`
- `buildBridge(mode, dow)`
- `audit()`

### Integrity
- Completed sessions tetap immutable.
- Tidak membuat storage/database kedua.
- `ap_sessions` tetap compatibility projection.
- Existing Gym/Home Gym evaluators dan Adaptive Engine tetap dipakai.
