import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "models", "two_iot.db")


def init_db():
    """Initialize database and create tables if not exists."""
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()

    c.execute('''
        CREATE TABLE IF NOT EXISTS students (
            id           INTEGER PRIMARY KEY AUTOINCREMENT,
            nama         TEXT    NOT NULL,
            nim          TEXT    UNIQUE NOT NULL,
            kode_kelas   TEXT    NOT NULL,
            face_encoding BLOB,
            foto_path    TEXT,
            created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    c.execute('''
        CREATE TABLE IF NOT EXISTS attendance (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id  INTEGER NOT NULL,
            tanggal     DATE    NOT NULL,
            waktu       TIME    NOT NULL,
            FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
            UNIQUE(student_id, tanggal)
        )
    ''')

    conn.commit()
    conn.close()
    print("[DB] Database initialized.")


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


# ── Students ──────────────────────────────────────────────────────────────────

def get_all_students():
    conn = get_db()
    rows = conn.execute(
        "SELECT id, nama, nim, kode_kelas, foto_path, created_at FROM students ORDER BY nama"
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def get_student_by_id(student_id):
    conn = get_db()
    row = conn.execute(
        "SELECT * FROM students WHERE id = ?", (student_id,)
    ).fetchone()
    conn.close()
    return dict(row) if row else None


def create_student(nama, nim, kode_kelas, face_encoding_bytes, foto_path):
    conn = get_db()
    try:
        conn.execute(
            "INSERT INTO students (nama, nim, kode_kelas, face_encoding, foto_path) VALUES (?,?,?,?,?)",
            (nama, nim, kode_kelas, face_encoding_bytes, foto_path)
        )
        conn.commit()
        return True, "Mahasiswa berhasil didaftarkan"
    except sqlite3.IntegrityError:
        return False, f"NIM '{nim}' sudah terdaftar"
    finally:
        conn.close()


def delete_student(student_id):
    conn = get_db()
    conn.execute("DELETE FROM students WHERE id = ?", (student_id,))
    conn.commit()
    conn.close()


def get_all_face_encodings():
    """Return list of (student_id, nama, nim, encoding_bytes) for all students."""
    conn = get_db()
    rows = conn.execute(
        "SELECT id, nama, nim, face_encoding FROM students WHERE face_encoding IS NOT NULL"
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


# ── Attendance ─────────────────────────────────────────────────────────────────

def get_attendance(tanggal=None, kode_kelas=None):
    conn = get_db()
    query = '''
        SELECT a.id, s.nama, s.nim, s.kode_kelas, a.tanggal, a.waktu
        FROM attendance a
        JOIN students s ON a.student_id = s.id
        WHERE 1=1
    '''
    params = []
    if tanggal:
        query += " AND a.tanggal = ?"
        params.append(tanggal)
    if kode_kelas:
        query += " AND s.kode_kelas = ?"
        params.append(kode_kelas)
    query += " ORDER BY a.tanggal DESC, a.waktu DESC"
    rows = conn.execute(query, params).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def record_attendance(student_id, tanggal, waktu):
    """Insert attendance. Returns (success, message)."""
    conn = get_db()
    try:
        conn.execute(
            "INSERT INTO attendance (student_id, tanggal, waktu) VALUES (?,?,?)",
            (student_id, tanggal, waktu)
        )
        conn.commit()
        return True, "Absensi berhasil dicatat"
    except sqlite3.IntegrityError:
        return False, "Sudah absen hari ini"
    finally:
        conn.close()


def get_dashboard_stats():
    today = __import__('datetime').date.today().isoformat()
    conn = get_db()
    total_students = conn.execute("SELECT COUNT(*) FROM students").fetchone()[0]
    hadir_today   = conn.execute(
        "SELECT COUNT(*) FROM attendance WHERE tanggal = ?", (today,)
    ).fetchone()[0]
    conn.close()
    return {
        "total_students": total_students,
        "hadir_today":    hadir_today,
        "belum_hadir":    total_students - hadir_today,
        "tanggal":        today,
    }
