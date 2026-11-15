# Unified Training Data Integration — V4

## Tujuan
Memastikan data latihan selesai menggunakan satu sumber data kanonik: `ap_training_model_v1`.

## Jalur data kanonik
- `36-training-data-model.js` — normalisasi, migrasi, dan kompatibilitas `ap_sessions`.
- `38-unified-integration-v3.js` — kontrak CRUD/analytics `window.apTraining`.
- Modul Workout, History Editor, Session Note, Home Gym Adaptive, Session Evaluator, dan Weekly Adaptation kini menggunakan API kanonik ketika tersedia.
- Modul legacy yang masih membaca `sessions()` tetap kompatibel karena `ls.get('ap_sessions')` menghasilkan projection dari model kanonik.

## API utama
- `apTraining.all()`
- `apTraining.get(id)`
- `apTraining.save(session)`
- `apTraining.update(id, patch)`
- `apTraining.remove(id)`
- `apTraining.replaceAll(rows)`
- `apTraining.clear()`
- `apTraining.stats(start, end)`
- `apTraining.weekly()`
- `apTraining.records()`
- `apTraining.muscles(start, end)`
- `apTraining.exercises()`
- `apTraining.program()`
- `apTraining.audit()`

## Konsistensi yang diaudit
`apTraining.audit()` sekarang memeriksa:
1. jumlah sesi kanonik vs projection;
2. total volume kanonik vs projection;
3. jumlah working sets kanonik vs projection;
4. semua exercise row memiliki session + exercise;
5. semua sesi memiliki program context;
6. ID sesi kanonik unik.

## Perubahan penting
### Workout
Penyelesaian sesi Gym menggunakan `apTraining.replaceAll()` untuk menyimpan hasil melalui jalur kanonik.

### History
Penghapusan satu sesi, penghapusan seluruh riwayat, dan undo menggunakan `apTraining.replaceAll()` / `clear()`.

### History Editor
Edit sesi menggunakan `apTraining.update(id, patch)` agar perubahan kembali ke model kanonik.

### Session Note
Catatan sesi terakhir menggunakan `apTraining.update()`.

### Home Gym
Adaptive Engine, Session Evaluation, dan Weekly Adaptation membaca sesi dari `apTraining.all()`.
Home Gym Session Evaluation menyimpan sesi baru melalui `apTraining.save()`.

## Backward compatibility
`ap_sessions` tidak dihapus. Storage tersebut tetap menjadi projection kompatibilitas yang diturunkan dari model kanonik. Ini menjaga modul lama tetap berfungsi tanpa membuat sumber data kedua.

## Verifikasi statis
File JavaScript yang diubah telah lolos `node --check`:
- `00-app-core.js`
- `11-history-editor.js`
- `12-session-note.js`
- `33-home-gym-adaptive.js`
- `34-home-gym-session-evaluator.js`
- `35-home-gym-weekly-adaptation.js`
- `38-unified-integration-v3.js`

## Verifikasi runtime yang disarankan
Di browser setelah membuka aplikasi:
```js
apTraining.audit()
```

Semua properti di `checks` idealnya bernilai `true`.

Untuk inspeksi ringkas:
```js
apUnifiedDashboard()
```

Untuk melihat seluruh sesi kanonik:
```js
apTraining.all()
```
