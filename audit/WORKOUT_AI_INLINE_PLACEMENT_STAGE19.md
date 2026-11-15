# Stage 19 — Workout AI Inline Placement & Home Workout Layout Fix

## Tujuan
1. Memastikan `KEPUTUSAN TERPADU` dan `Kenapa keputusan ini?` tidak lagi berada di atas workout aktif.
2. Memastikan kedua komponen berada di dalam `.wk-exercise-card` gerakan aktif.
3. Memperbaiki penyempitan teks Home Workout pada desktop/tablet yang disebabkan oleh aturan global `.btn{width:100%}`.
4. Memastikan `Program personal aktif` dan `TUJUAN LATIHAN` tetap horizontal pada desktop/tablet.

## Perubahan
- Stage 13 panel dan Stage 14 trace diekstrak secara independen dari HTML hasil render.
- Keduanya ditempatkan setelah `.wk-target-line` pada kartu gerakan aktif.
- Desktop/tablet action button pada `.home-workout-head`, `.home-gym-personal-note`, dan `.hg-goal-card` menggunakan `width:auto`.
- Mobile mempertahankan tombol full-width.

## Data / Intelligence
Tidak ada perubahan pada canonical training model, recommendation engine, decision trace logic, adaptive engine, safety guardrails, atau history.

## Validation
- `59-workout-ai-inline-card.js` harus lolos `node --check`.
- CSS Stage 19 direferensikan tepat satu kali.
- ZIP harus lolos `unzip -t`.
- Verifikasi visual browser: desktop dan tablet Home Workout, serta workout aktif Gym/Home Gym.
