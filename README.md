# Two IOT — Sistem Absensi Wajah

Aplikasi web absensi berbasis pengenalan wajah (*face recognition*) yang dirancang berjalan di **Raspberry Pi**. Kamera menangkap wajah mahasiswa secara *real-time*, mencocokkannya dengan embedding yang tersimpan, lalu mencatat kehadiran ke database lokal secara otomatis.

---

## Daftar Isi

1. [Fitur](#fitur)
2. [Arsitektur](#arsitektur)
3. [Struktur File](#struktur-file)
4. [Persyaratan](#persyaratan)
5. [Instalasi](#instalasi)
6. [Menjalankan Aplikasi](#menjalankan-aplikasi)
7. [API Reference](#api-reference)
8. [Database](#database)
9. [Konfigurasi](#konfigurasi)
10. [Menghubungkan UI Prototype ke Backend](#menghubungkan-ui-prototype-ke-backend)

---

## Fitur

- **Dashboard** — ringkasan total mahasiswa, jumlah hadir hari ini, dan belum absen; daftar kehadiran hari ini.
- **Register Mahasiswa** — formulir pendaftaran mahasiswa baru dengan capture wajah langsung dari kamera.
- **Data Mahasiswa** — tabel dengan pencarian *live* (nama / NIM / kelas) dan hapus data beserta face embedding-nya.
- **Absensi** — pemindaian wajah *real-time*; mengenali mahasiswa, mencatat waktu, dan menampilkan log kehadiran hari ini.
- **Kamera dual-mode** — mendukung `picamera2` (kamera resmi Raspberry Pi) dan fallback ke OpenCV (webcam USB / pengembangan di laptop).
- **UI Prototype standalone** — antarmuka `index.html` + `styles.css` + `app.js` dapat dibuka langsung di browser tanpa server, lengkap dengan data seed dan simulasi interaksi.

---

## Arsitektur

```
┌──────────────────────────────────────────────────────────┐
│                       Browser                            │
│                                                          │
│   index.html  ←→  app.js          (UI Prototype)        │
│   (standalone, mock data, tanpa server)                  │
│                                                          │
│   templates/  ←→  static/js/      (FastAPI Templates)    │
│   (dirender server, data nyata dari API)                 │
└──────────────┬───────────────────────────────────────────┘
               │  HTTP / JSON  /  MJPEG stream
┌──────────────▼───────────────────────────────────────────┐
│               FastAPI Backend  (app.py)                  │
│                                                          │
│   camera.py        → picamera2 / OpenCV                  │
│   face_utils.py    → face_recognition (dlib)             │
│   database.py      → SQLite  (models/two_iot.db)         │
└──────────────────────────────────────────────────────────┘
```

Proyek ini memiliki **dua lapisan frontend**:

| Lapisan | File | Data | Kapan dipakai |
|---|---|---|---|
| **UI Prototype** | `index.html`, `styles.css`, `app.js` | Seed (mock) | Demo / desain tanpa Pi |
| **FastAPI Templates** | `templates/*.html`, `static/` | API nyata | Produksi di Raspberry Pi |

---

## Struktur File

```
TwoIOT/
├── index.html              # UI Prototype — buka langsung di browser
├── styles.css              # Design-system CSS (framework-agnostic)
├── app.js                  # SPA vanilla JS: 4 halaman + interaksi
│
├── app.py                  # FastAPI app — routes halaman & REST API
├── camera.py               # CameraManager: picamera2 / OpenCV fallback
├── database.py             # SQLite helper: students & attendance
├── face_utils.py           # Encode, recognize, annotate wajah (dlib)
├── requirements.txt        # Python dependencies
│
├── models/
│   └── two_iot.db          # SQLite database (dibuat otomatis)
│
├── static/
│   ├── css/style.css       # CSS untuk Flask templates
│   ├── fonts/fonts.css     # Deklarasi font lokal (Plus Jakarta Sans, JetBrains Mono)
│   ├── js/
│   │   ├── dashboard.js
│   │   ├── students.js
│   │   ├── register.js
│   │   └── attendance.js
│   └── images/faces/       # Foto wajah mahasiswa (NIM.jpg)
│
└── templates/
    ├── base.html           # Layout Jinja2 (sidebar, nav)
    ├── dashboard.html
    ├── students.html
    ├── register.html
    └── attendance.html
```

---

## Persyaratan

### Hardware
- Raspberry Pi 4B (2 GB RAM minimum, 4 GB direkomendasikan)
- Raspberry Pi Camera Module v2 / v3, atau webcam USB
- Penyimpanan ≥ 16 GB (microSD / SSD)

### Software
- Raspberry Pi OS (64-bit, Bullseye atau Bookworm)
- Python 3.10+
- CMake & build tools (untuk kompilasi dlib)

### Library Python
```
fastapi>=0.110.0
uvicorn>=0.29.0
python-multipart>=0.0.9
jinja2>=3.1.0
aiofiles>=23.0.0
face-recognition>=1.3.0
dlib>=19.24.0
numpy>=1.24.0
opencv-python>=4.8.0
picamera2>=0.3.18
```

---

## Instalasi

### 1. Siapkan sistem (Raspberry Pi)

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3-pip cmake build-essential \
    libatlas-base-dev libboost-all-dev libopenblas-dev \
    python3-picamera2
```

### 2. Clone / salin proyek

```bash
git clone <url-repo> TwoIOT
cd TwoIOT
```

### 3. Install Python dependencies

> **Catatan:** `dlib` perlu dikompilasi dari source di Raspberry Pi. Proses ini memakan waktu 15–30 menit.

```bash
pip install cmake
pip install dlib
pip install -r requirements.txt
```

Alternatif jika kompilasi gagal — gunakan wheel pre-built dari repo komunitas:

```bash
pip install https://github.com/Malesio/dlib-rpi/releases/download/19.24.0/dlib-19.24.0-cp310-cp310-linux_aarch64.whl
pip install face-recognition fastapi uvicorn python-multipart jinja2 aiofiles numpy pandas opencv-python picamera2
```

### 4. Aktifkan kamera Raspberry Pi

```bash
sudo raspi-config
# → Interface Options → Camera → Enable
sudo reboot
```

---

## Menjalankan Aplikasi

### Mode Produksi (FastAPI + kamera nyata)

```bash
python app.py
```

Akses di browser: `http://<IP-Raspberry-Pi>:5000`

Server berjalan di semua interface (`0.0.0.0:5000`) sehingga bisa diakses dari laptop dalam jaringan yang sama.

Dokumentasi API interaktif tersedia otomatis di `http://<IP-Raspberry-Pi>:5000/docs`.

### Mode UI Prototype (tanpa server)

Buka `index.html` langsung di browser:

```
file:///path/to/TwoIOT/index.html
```

Data menggunakan 8 mahasiswa seed bawaan. Capture dan scan disimulasikan dengan timer. Cocok untuk demo desain atau pengembangan UI tanpa Raspberry Pi.

---

## API Reference

Base URL: `http://<host>:5000`

### Dashboard

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/dashboard` | Statistik: total, hadir hari ini, belum hadir |

**Response:**
```json
{
  "total_students": 8,
  "hadir_today": 3,
  "belum_hadir": 5,
  "tanggal": "2026-06-14"
}
```

---

### Mahasiswa

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/api/students` | Daftar semua mahasiswa |
| `POST` | `/api/students` | Daftarkan mahasiswa baru |
| `DELETE` | `/api/students/{id}` | Hapus mahasiswa |

**POST `/api/students`** — body JSON:
```json
{
  "nama": "Bruce Wayne",
  "nim": "2110511001",
  "kode_kelas": "IF-3A",
  "face_encoding_b64": "<base64 dari /api/capture>"
}
```

**Response sukses (201):**
```json
{ "success": true, "message": "Mahasiswa berhasil didaftarkan" }
```

**Response duplikat NIM (409):**
```json
{ "success": false, "message": "NIM '2110511001' sudah terdaftar" }
```

---

### Face Capture (untuk registrasi)

| Method | Endpoint | Deskripsi |
|---|---|---|
| `POST` | `/api/capture` | Ambil frame dari kamera, encode wajah |

**Response sukses:**
```json
{
  "success": true,
  "message": "Wajah berhasil di-encode",
  "face_encoding_b64": "<base64 string>"
}
```

Gunakan nilai `face_encoding_b64` ini di body POST `/api/students`.

---

### Absensi

| Method | Endpoint | Deskripsi |
|---|---|---|
| `POST` | `/api/scan` | Scan wajah, kenali, catat kehadiran |
| `GET` | `/api/attendance` | Semua rekap (filter opsional: `?tanggal=&kode_kelas=`) |
| `GET` | `/api/attendance/today` | Kehadiran hari ini |

**POST `/api/scan`** — Response sukses:
```json
{
  "success": true,
  "saved": true,
  "message": "Absensi berhasil dicatat",
  "student": {
    "nama": "Bruce Wayne",
    "nim": "2110511001",
    "confidence": 87.4
  },
  "waktu": "08:35:22",
  "tanggal": "2026-06-14"
}
```

`saved: false` berarti wajah dikenali tapi mahasiswa sudah absen hari ini.

### Stream Kamera (MJPEG)

| Endpoint | Deskripsi |
|---|---|
| `/video_feed` | Stream polos — untuk halaman Register |
| `/video_feed_annotated` | Stream dengan kotak wajah & nama — untuk halaman Absensi |

Gunakan sebagai `src` pada elemen `<img>`:
```html
<img src="/video_feed_annotated">
```

---

## Database

SQLite, tersimpan otomatis di `models/two_iot.db` saat pertama kali server dijalankan.

### Tabel `students`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | INTEGER PK | Auto-increment |
| `nama` | TEXT | Nama lengkap |
| `nim` | TEXT UNIQUE | Nomor Induk Mahasiswa |
| `kode_kelas` | TEXT | IF-3A / IF-3B / SI-2A / TI-1C |
| `face_encoding` | BLOB | 128-d numpy array (pickle) |
| `foto_path` | TEXT | Path relatif foto wajah |
| `created_at` | DATETIME | Waktu pendaftaran |

### Tabel `attendance`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | INTEGER PK | Auto-increment |
| `student_id` | INTEGER FK | Referensi `students.id` (CASCADE DELETE) |
| `tanggal` | DATE | Format `YYYY-MM-DD` |
| `waktu` | TIME | Format `HH:MM:SS` |

Constraint `UNIQUE(student_id, tanggal)` mencegah double absen dalam satu hari.

---

## Konfigurasi

### Toleransi pengenalan wajah

Di `face_utils.py` baris 10:

```python
TOLERANCE = 0.5   # 0.4 = ketat, 0.6 = longgar
```

Nilai lebih kecil → lebih sulit dikenali (false negative lebih banyak).  
Nilai lebih besar → lebih mudah dikenali (false positive lebih mungkin).  
Rentang yang disarankan: **0.45 – 0.55**.

### Resolusi kamera

Di `camera.py` baris 132:

```python
camera = CameraManager(width=640, height=480)
```

Tingkatkan ke `1280×720` untuk akurasi lebih baik (butuh CPU lebih).

### Port server

Di `app.py` baris terakhir:

```python
uvicorn.run(app, host="0.0.0.0", port=5000)
```

---

## Menghubungkan UI Prototype ke Backend

`app.js` saat ini menggunakan data seed (in-memory). Untuk menghubungkannya ke FastAPI nyata, ganti fungsi `saveStudent`, `doCapture`, `doScan`, dan load awal dengan `fetch()` ke endpoint yang sesuai.

Contoh — load mahasiswa dari API saat init:

```javascript
async function init() {
  const res  = await fetch('/api/students');
  const data = await res.json();
  state.students = data;
  // ... lanjutkan init
}
```

Contoh — scan wajah nyata (ganti timer di `doScan`):

```javascript
async function doScan() {
  state.abs.scanState = 'scanning';
  refreshAbsensi();

  const res    = await fetch('/api/scan', { method: 'POST' });
  const result = await res.json();

  if (result.success && result.saved) {
    state.abs.person    = result.student;
    state.abs.scanState = 'success';
    state.log.push({ ...result.student, time: result.waktu.slice(0, 5) });
  } else {
    state.abs.scanState = 'fail';
  }
  refreshAbsensi();

  setTimeout(() => { state.abs.scanState = 'idle'; refreshAbsensi(); }, 2600);
}
```

---

## Catatan Pengembangan

- **Kamera tidak tersedia di laptop** — `camera.py` otomatis fallback ke webcam USB via OpenCV. Tidak perlu mengubah kode apapun.
- **Dlib lambat di Pi** — model HOG digunakan (bukan CNN) agar bisa berjalan *real-time* di Pi 4B. Jika menggunakan Pi 5, pertimbangkan model CNN untuk akurasi lebih tinggi.
- **Data absensi per hari** — semua data tersimpan permanen di SQLite. Tidak ada reset otomatis; filter berdasarkan `tanggal` di `/api/attendance`.

---

*Two IOT — Kelompok 2 · Sistem Absensi Wajah*
