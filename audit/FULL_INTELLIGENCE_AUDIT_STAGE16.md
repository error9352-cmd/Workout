# Athletic Physique — Stage 16
## Full Intelligence Audit & Conflict Testing

### Tujuan
Memvalidasi rantai intelligence Gym dan Home Gym secara deterministik setelah Stage 15, dengan fokus pada konflik antar-engine, fallback data kosong, progression, stagnation, too hard, dan guardrail.

### Skenario yang diuji
1. Target tercapai + weekly progression -> `progression` / **Naikkan Progres**.
2. Session Evaluation `too_hard` + weekly progression -> `volume_reduction` / **Kurangi Volume**.
3. Session Evaluation `stagnant` -> `rotation` / **Rotasi Gerakan**.
4. Exercise Progression `stagnant` + weekly progression -> `rotation`.
5. Data progression dan weekly kosong -> `maintenance` / **Pertahankan & Progres**.
6. Progression ekstrem `60 -> 100 kg` -> dibatasi menjadi `62.5 kg` karena aturan `min(2.5 kg, 10%)`.
7. Repetisi di atas target `15` pada target `8–10` -> dibatasi menjadi `10`.
8. Beban negatif -> dikoreksi menjadi `0`.
9. Deload pada referensi `60 kg` -> dibatasi pada rentang `70–90%`, contoh `42 kg`.

### Temuan dan koreksi
- Ditemukan kondisi pada Stage 15 yang secara logika membuat pemeriksaan beban negatif tidak pernah terpenuhi karena membandingkan `> 0` dan `< 0` dalam kondisi yang sama. Kondisi diperbaiki menjadi pemeriksaan nilai negatif langsung.
- Batas progression sebelumnya menggunakan `Math.max(2.5, 10%)`, yang berarti memilih batas yang lebih longgar. Untuk kontrak Stage 15, aturan yang dimaksud adalah `10% atau 2.5 kg, mana yang lebih ketat`, sehingga diperbaiki menjadi `Math.min(2.5, 10%)` untuk basis beban positif.
- Referensi script Stage 14 di `index.html` memiliki tag yang terpotong. Tag diperbaiki menjadi `<script ... defer></script>` dan Stage 16 ditambahkan sesudahnya.

### Hasil
- **12/12 skenario lulus**.
- Stage 13 Unified Recommendation API tersedia.
- Stage 15 Safety Guardrails API tersedia.
- Tidak ada completed history yang ditulis ulang.
- Tidak ada storage/data source kedua.

### Cara menjalankan audit deterministik
```bash
node tools/stage16-intelligence-audit.js
```
Output yang diharapkan: `passed: 12, total: 12, failed: []`.

### Catatan
Audit ini menguji logika engine secara terisolasi dengan mock context deterministic. Browser QA, interaksi Supabase, PWA lifecycle, dan perilaku perangkat nyata tetap memerlukan pengujian di browser target.
