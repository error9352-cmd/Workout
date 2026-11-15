# Unified Decision Language v1

Weekly Coach, Gym Intelligence, dan Home Gym Weekly Adaptation tetap menggunakan enum internal yang stabil untuk logika mesin:

- `progression`
- `maintenance`
- `volume_reduction`
- `rotation`
- `deload`

Istilah tersebut tidak lagi ditampilkan sebagai label teknis kepada pengguna.

| Internal | User-facing |
|---|---|
| progression | Naikkan Progres |
| maintenance | Pertahankan & Progres |
| volume_reduction | Kurangi Volume |
| rotation | Rotasi Gerakan |
| deload | Deload / Pemulihan |

Tujuan: engine tetap deterministik dan kompatibel dengan logika adaptasi yang sudah ada, sementara Weekly Coach dan panel intelligence menggunakan bahasa yang konsisten dan actionable.

## Aturan penting

- `maintenance` tidak dihapus dari engine.
- `maintenance` berarti struktur program dipertahankan sambil tetap membuka ruang untuk progres kecil ketika kondisi siap.
- `progression` digunakan ketika sinyal performa mendukung peningkatan.
- `volume_reduction` dan `deload` tetap dibedakan: yang pertama mengurangi volume karena fatigue/performa, yang kedua adalah fase pemulihan yang lebih disengaja.
