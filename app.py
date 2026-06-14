"""
app.py — Two IOT: Face Recognition Attendance System
FastAPI backend with REST API + MJPEG camera stream.

Endpoints:
  GET  /                          → Dashboard
  GET  /mahasiswa                 → Student list page
  GET  /register                  → Register student page
  GET  /absensi                   → Attendance page

  GET  /video_feed                → MJPEG live stream
  GET  /video_feed_annotated      → MJPEG with face boxes

  GET  /api/dashboard             → Dashboard stats (JSON)
  GET  /api/students              → All students (JSON)
  POST /api/students              → Register new student
  DELETE /api/students/<id>       → Delete student

  POST /api/capture               → Capture frame & encode face
  POST /api/scan                  → Scan face → record attendance

  GET  /api/attendance            → All attendance (JSON) ?tanggal=&kode_kelas=
  GET  /api/attendance/today      → Today's attendance
"""

import base64
import datetime
from contextlib import asynccontextmanager
from typing import Optional

from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel

from database import (
    init_db, get_all_students, get_student_by_id,
    create_student, delete_student, get_all_face_encodings,
    get_attendance, record_attendance, get_dashboard_stats
)
from face_utils import (
    encode_face_from_frame, recognize_face,
    draw_face_boxes, save_face_photo
)
from camera import camera


# ─────────────────────────────────────────────────────────────────────────────
# Lifespan
# ─────────────────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    camera.start()
    print("[APP] Two IOT started.")
    yield
    camera.stop()


app = FastAPI(lifespan=lifespan)
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")


# ─────────────────────────────────────────────────────────────────────────────
# Request models
# ─────────────────────────────────────────────────────────────────────────────

class StudentCreate(BaseModel):
    nama: str
    nim: str
    kode_kelas: str
    face_encoding_b64: str


# ─────────────────────────────────────────────────────────────────────────────
# Page routes
# ─────────────────────────────────────────────────────────────────────────────

@app.get("/")
def index(request: Request):
    return templates.TemplateResponse(request=request, name="dashboard.html")


@app.get("/mahasiswa")
def mahasiswa(request: Request):
    return templates.TemplateResponse(request=request, name="students.html")


@app.get("/register")
def register(request: Request):
    return templates.TemplateResponse(request=request, name="register.html")


@app.get("/absensi")
def absensi(request: Request):
    return templates.TemplateResponse(request=request, name="attendance.html")


# ─────────────────────────────────────────────────────────────────────────────
# Camera streams
# ─────────────────────────────────────────────────────────────────────────────

@app.get("/video_feed")
def video_feed():
    return StreamingResponse(
        camera.generate_mjpeg(),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )


@app.get("/video_feed_annotated")
def video_feed_annotated():
    def annotate(frame):
        students = get_all_face_encodings()
        return draw_face_boxes(frame, students)

    return StreamingResponse(
        camera.generate_mjpeg(annotate_fn=annotate),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )


# ─────────────────────────────────────────────────────────────────────────────
# API — Dashboard
# ─────────────────────────────────────────────────────────────────────────────

@app.get("/api/dashboard")
def api_dashboard():
    return get_dashboard_stats()


# ─────────────────────────────────────────────────────────────────────────────
# API — Students
# ─────────────────────────────────────────────────────────────────────────────

@app.get("/api/students")
def api_get_students():
    return get_all_students()


@app.post("/api/students", status_code=201)
def api_create_student(data: StudentCreate):
    nama       = data.nama.strip()
    nim        = data.nim.strip()
    kode_kelas = data.kode_kelas.strip()

    if not all([nama, nim, kode_kelas]):
        return JSONResponse(status_code=400, content={
            "success": False, "message": "Nama, NIM, dan Kode Kelas wajib diisi."
        })

    face_encoding_bytes = base64.b64decode(data.face_encoding_b64)

    frame = camera.capture_snapshot()
    foto_path = None
    if frame is not None:
        foto_path = save_face_photo(frame, nim)

    success, message = create_student(nama, nim, kode_kelas, face_encoding_bytes, foto_path)
    status = 201 if success else 409
    return JSONResponse(status_code=status, content={"success": success, "message": message})


@app.delete("/api/students/{student_id}")
def api_delete_student(student_id: int):
    student = get_student_by_id(student_id)
    if not student:
        return JSONResponse(status_code=404, content={
            "success": False, "message": "Mahasiswa tidak ditemukan."
        })
    delete_student(student_id)
    return {"success": True, "message": "Mahasiswa berhasil dihapus."}


# ─────────────────────────────────────────────────────────────────────────────
# API — Face Capture (for registration)
# ─────────────────────────────────────────────────────────────────────────────

@app.post("/api/capture")
def api_capture():
    frame = camera.capture_snapshot()
    if frame is None:
        return JSONResponse(status_code=500, content={
            "success": False, "message": "Kamera tidak tersedia."
        })

    encoding_bytes, message = encode_face_from_frame(frame)
    if encoding_bytes is None:
        return JSONResponse(status_code=400, content={"success": False, "message": message})

    return {
        "success": True,
        "message": message,
        "face_encoding_b64": base64.b64encode(encoding_bytes).decode("utf-8")
    }


# ─────────────────────────────────────────────────────────────────────────────
# API — Attendance Scan
# ─────────────────────────────────────────────────────────────────────────────

@app.post("/api/scan")
def api_scan():
    frame = camera.capture_snapshot()
    if frame is None:
        return JSONResponse(status_code=500, content={
            "success": False, "message": "Kamera tidak tersedia."
        })

    known_students = get_all_face_encodings()
    if not known_students:
        return JSONResponse(status_code=400, content={
            "success": False, "message": "Belum ada mahasiswa terdaftar."
        })

    matches = recognize_face(frame, known_students)

    if not matches:
        return {"success": False, "message": "Wajah tidak dikenali. Coba lagi."}

    match    = matches[0]
    today    = datetime.date.today().isoformat()
    now_time = datetime.datetime.now().strftime("%H:%M:%S")

    saved, msg = record_attendance(match["student_id"], today, now_time)

    return {
        "success": True,
        "saved":   saved,
        "message": msg,
        "student": {
            "nama":       match["nama"],
            "nim":        match["nim"],
            "confidence": match["confidence"],
        },
        "waktu":   now_time,
        "tanggal": today,
    }


# ─────────────────────────────────────────────────────────────────────────────
# API — Attendance Records
# ─────────────────────────────────────────────────────────────────────────────

@app.get("/api/attendance")
def api_attendance(tanggal: Optional[str] = None, kode_kelas: Optional[str] = None):
    return get_attendance(tanggal=tanggal, kode_kelas=kode_kelas)


@app.get("/api/attendance/today")
def api_attendance_today():
    today = datetime.date.today().isoformat()
    return get_attendance(tanggal=today)


# ─────────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
