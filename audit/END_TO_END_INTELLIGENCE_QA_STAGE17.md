# Athletic Physique — Stage 17 End-to-End Intelligence QA

## Tujuan

Stage 17 memeriksa bahwa kontrak runtime yang diperlukan oleh alur intelligence Gym dan Home Gym tersedia dalam satu halaman aplikasi dan dimuat tepat satu kali.

Pipeline yang diverifikasi:

`Workout Launch → Active Workout → Logging → Completion → Session Evaluation → Canonical Training Model → Exercise Progression → Weekly Adaptation → Adaptive Engine → Unified Recommendation → Decision Trace → Safety Guardrails → Next Workout`

## Scope

Stage 17 menambahkan diagnostic-only runtime layer:

- `assets/js/58-intelligence-e2e-qa.js`
- `assets/css/25-intelligence-e2e-qa.css`
- `tools/stage17-e2e-intelligence-qa.js`

Diagnostic layer tidak menulis completed history dan tidak mengubah recommendation decision.

## Contract checks

Runtime checks memverifikasi:

- Stage 44–58 runtime script dimuat tepat satu kali.
- Stage 24–25 diagnostic CSS dimuat tepat satu kali.
- `apDataModel` tersedia.
- `apTraining` tersedia.
- `apUnifiedIntelligence` tersedia.
- `apGymSmartProgram` tersedia.
- `apUnifiedAdaptive` tersedia.
- `apWeeklyCoach` tersedia.
- `apExerciseProgression` tersedia.
- `apProgressionWorkoutBridge` tersedia.
- `apUnifiedRecommendation` tersedia.
- `apRecommendationDecisionTrace` tersedia.
- `apRecommendationGuardrails` tersedia.
- `apIntelligenceAudit` tersedia.
- `apE2EIntelligenceQA` tersedia.
- `startWorkout`, `render`, dan `getA` tersedia.

## Deterministic intelligence regression

Stage 16 audit tetap dijalankan sebagai regression gate.

Baseline saat Stage 17 dibuat:

- **12/12 skenario Stage 16 lulus**
- tidak ada failed scenario
- guardrail progression menggunakan `min(2.5 kg, 10%)`
- negative-weight correction aktif

## Browser limitation

Browser-level interactive automation tidak dianggap lulus hanya dari syntax check atau static inspection. Pada lingkungan audit ini, Chromium tersedia tetapi automated page interaction terhadap aplikasi lokal tidak menghasilkan hasil stabil yang dapat dijadikan bukti E2E penuh.

Karena itu Stage 17 **tidak mengklaim browser E2E 100% lulus**. Yang dibekukan sebagai pass adalah contract/integration readiness dan deterministic intelligence regression.

Uji manual target tetap:

1. pilih Gym → pilih program → Mulai Workout;
2. catat set sampai selesai;
3. Selesaikan Workout;
4. buka evaluasi sesi;
5. verifikasi sesi muncul di Riwayat;
6. verifikasi angka yang sama muncul di Progres;
7. buka Weekly Coach;
8. mulai sesi berikutnya;
9. ulangi seluruh alur untuk Home Gym.

## Maintenance

Jika Stage 44–58 diubah:

```bash
node tools/stage16-intelligence-audit.js
node tools/stage17-e2e-intelligence-qa.js
```

Jangan memperbaiki bug recommendation dengan mengubah completed history.
