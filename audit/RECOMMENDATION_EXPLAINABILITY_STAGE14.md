# Athletic Physique — Stage 14 Recommendation Explainability & Decision Trace

## Tujuan
Membuat keputusan dari Unified Recommendation Engine dapat dipahami pengguna dan diaudit tanpa mengubah hasil keputusan atau menulis ulang history.

## Prinsip
- Read-only explainability layer.
- `ap_training_model_v1` tetap menjadi sumber canonical.
- Stage 14 tidak membuat database/history baru.
- Stage 13 tetap menjadi authority untuk keputusan final.
- Tidak ada perubahan pada sesi selesai.

## Decision Trace
`window.apRecommendationDecisionTrace.explain(mode, name, target)` mengembalikan:
- konteks goal, level, frequency
- sumber input yang tersedia
- action dari Progress per Gerakan
- sinyal Evaluasi Sesi
- sinyal Adaptasi Mingguan
- keputusan final
- prioritas keputusan yang memilih hasil final
- status konflik antar sumber
- langkah berikutnya
- versi resolver yang digunakan

## UI
Panel `Kenapa keputusan ini?` ditambahkan ke workout aktif sebagai disclosure native `<details>`. Panel menampilkan:
- aturan yang dipakai
- dasar keputusan per sumber
- keputusan final
- langkah berikutnya
- informasi bila terjadi konflik sumber

Panel tidak menggantikan `KEPUTUSAN TERPADU` Stage 13.

## API
- `window.apRecommendationDecisionTrace.explain(mode, name, target)`
- `window.apRecommendationDecisionTrace.forExercise(name, mode)`
- `window.apRecommendationDecisionTrace.render(trace)`
- `window.apRecommendationDecisionTrace.audit()`

## Verifikasi
- Syntax check seluruh JS runtime yang dimuat `index.html`.
- Stage 14 JS/CSS masing-masing dimuat satu kali.
- ZIP diuji dengan `unzip -t`.
- History canonical tidak diubah.
