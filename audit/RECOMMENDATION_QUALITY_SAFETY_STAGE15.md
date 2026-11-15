# Athletic Physique — Stage 15
## Recommendation Quality & Safety Guardrails

### Tujuan
Menambahkan checkpoint sebelum rekomendasi final menjadi input workout aktif. Layer ini bersifat additive dan tidak mengubah completed history atau membuat sumber data baru.

### Guardrails
- keputusan harus salah satu dari lima action canonical.
- kenaikan beban progression dibatasi maksimum 10% atau 2,5 kg per sesi, mana yang lebih ketat dari batas yang dihitung.
- repetisi tidak boleh melewati batas atas target yang tersedia.
- beban negatif/NaN tidak diterima.
- volume reduction tidak boleh memangkas beban lebih dari 25% dari beban acuan pada checkpoint ini.
- deload menjaga rentang beban sekitar 70–90% dari beban acuan jika data beban tersedia.
- durasi time-based tidak melewati batas target jika target tersedia.
- perubahan hanya diterapkan pada active workout yang belum selesai; history tetap immutable.

### Integrasi
- `window.apRecommendationGuardrails`
- checkpoint setelah `startWorkout()`.
- checkpoint juga membungkus `apUnifiedRecommendation.applyToActive()` bila dipanggil secara eksplisit.
- canonical source tetap `ap_training_model_v1` / `window.apDataModel`.

### Verifikasi
- Stage 15 JS/CSS dimuat sekali.
- Runtime JavaScript harus lulus `node --check`.
- ZIP harus lulus `unzip -t`.
