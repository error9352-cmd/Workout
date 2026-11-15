# Stage 18 — Workout AI Inline Card & Home Workout Responsive Polish

## Tujuan
- Memindahkan `Keputusan Terpadu` dan `Kenapa keputusan ini?` dari area atas workout aktif ke kartu gerakan yang sedang dikerjakan.
- Mengurangi gangguan visual saat logging set.
- Merapikan Home Workout pada desktop dan tablet tanpa mengubah data atau engine intelligence.

## Perubahan
- `assets/js/59-workout-ai-inline-card.js`
  - Presentation-only wrapper.
  - Mengambil panel Stage 13 dan trace Stage 14 yang sudah dirender.
  - Menempatkannya di dalam `.wk-exercise-card` setelah `.wk-target-line`.
  - Tidak menghitung ulang recommendation dan tidak menulis history.
- `assets/css/26-workout-ai-inline-card.css`
  - AI card lebih compact.
  - Home Workout memakai container terpusat dan width stabil.
  - Desktop/tablet program cards dibuat seimbang dan tidak offset.
  - Tablet 700–1023px menggunakan dua kolom selama ruang cukup.
  - Mobile tetap satu kolom.

## Data / Intelligence
Tidak ada perubahan pada canonical training model, recommendation engine, decision trace, safety guardrails, adaptive engine, atau history.

## Validation
- Stage 18 JS harus lolos `node --check`.
- Stage 18 CSS dan JS harus direferensikan tepat satu kali di `index.html`.
- ZIP harus lolos `unzip -t`.
