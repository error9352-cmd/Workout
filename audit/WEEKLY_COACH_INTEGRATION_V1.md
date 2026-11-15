# Weekly Coach Integration v1

## Tujuan

Weekly Coach menjadi presentation layer di atas Weekly Adaptation Engine. Ia tidak membuat storage latihan baru dan tidak menggantikan engine adaptasi.

## Integrasi

- `35-home-gym-weekly-adaptation.js` sekarang mengekspos:
  - `window.apHomeGymWeeklyAdaptation.collect()`
  - `window.apHomeGymWeeklyAdaptation.decide()`
  - `window.apHomeGymWeeklyAdaptation.applyDecision()`
  - `window.apHomeGymWeeklyAdaptation.weeklyWindow()`
- `39-weekly-coach-integration.js` membuat:
  - `window.apWeeklyAdaptationEngine.evaluate()`
  - `window.apWeeklyAdaptationEngine.decide()`
  - `window.apWeeklyCoach.evaluate()`
  - `window.apWeeklyCoach.render()`
  - `window.apWeeklyCoach.review()`
- Beranda memakai Weekly Coach baru melalui fungsi `weeklyCoach()` yang sudah ada.
- Progres menampilkan Weekly Review sebelum analytics training yang sudah ada.
- Semua metrik latihan diambil dari `window.apTraining` bila tersedia.

## Sumber keputusan

Jika minggu berjalan memiliki sesi Home Gym, Weekly Coach menggunakan keputusan dari Home Gym Weekly Adaptation Engine yang sudah ada.

Untuk sesi non-Home-Gym, unified facade menggunakan aturan adaptasi yang sama secara konseptual dengan keputusan: progression, maintenance, volume reduction, atau deload.

## Prinsip

1. Tidak ada storage Weekly Coach baru.
2. Tidak ada duplikasi session data.
3. Weekly Coach menjelaskan keputusan, bukan membuat statistik terpisah.
4. Weekly Review menjelaskan alasan dan tindakan minggu berikutnya.
5. Existing UI dan legacy data tetap dipertahankan.
