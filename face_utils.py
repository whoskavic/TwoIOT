import numpy as np
import pickle
import cv2
import os

def _face_recognition():
    import face_recognition
    return face_recognition

TOLERANCE = 0.5          # Lower = stricter match (0.4–0.6 recommended)
FACE_IMAGES_DIR = os.path.join(os.path.dirname(__file__), "static", "images", "faces")


# ── Encoding ───────────────────────────────────────────────────────────────────

def encode_face_from_frame(frame_bgr):
    """
    Given a BGR frame (numpy array from OpenCV/picamera2),
    detect ONE face and return its 128-d encoding.
    Returns (encoding_bytes, message).
    """
    fr = _face_recognition()
    rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
    locations = fr.face_locations(rgb, model="hog")

    if len(locations) == 0:
        return None, "Tidak ada wajah terdeteksi. Pastikan wajah terlihat jelas."
    if len(locations) > 1:
        return None, "Terdeteksi lebih dari 1 wajah. Pastikan hanya 1 orang di depan kamera."

    encodings = fr.face_encodings(rgb, locations)
    encoding_bytes = pickle.dumps(encodings[0])
    return encoding_bytes, "Wajah berhasil di-encode"


def bytes_to_encoding(encoding_bytes):
    """Deserialize encoding bytes back to numpy array."""
    return pickle.loads(encoding_bytes)


# ── Recognition ────────────────────────────────────────────────────────────────

def recognize_face(frame_bgr, known_students):
    """
    Scan frame for faces and compare against known_students.
    known_students: list of dicts with keys: id, nama, nim, face_encoding (bytes)

    Returns list of matches:
        [{"student_id": ..., "nama": ..., "nim": ..., "confidence": ...}]
    Returns empty list if no match.
    """
    fr = _face_recognition()
    rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
    locations = fr.face_locations(rgb, model="hog")

    if not locations:
        return []

    unknown_encodings = fr.face_encodings(rgb, locations)

    known_encodings = []
    known_meta = []
    for s in known_students:
        if s["face_encoding"]:
            known_encodings.append(bytes_to_encoding(s["face_encoding"]))
            known_meta.append(s)

    if not known_encodings:
        return []

    results = []
    for unknown_enc in unknown_encodings:
        distances = fr.face_distance(known_encodings, unknown_enc)
        best_idx  = int(np.argmin(distances))
        best_dist = distances[best_idx]

        if best_dist <= TOLERANCE:
            confidence = round((1 - best_dist) * 100, 1)
            results.append({
                "student_id": known_meta[best_idx]["id"],
                "nama":       known_meta[best_idx]["nama"],
                "nim":        known_meta[best_idx]["nim"],
                "confidence": confidence,
            })

    return results


# ── Frame Annotation ───────────────────────────────────────────────────────────

def draw_face_boxes(frame_bgr, known_students):
    """
    Draw bounding boxes and labels on frame.
    Returns annotated frame (BGR).
    """
    fr = _face_recognition()
    rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
    locations   = fr.face_locations(rgb, model="hog")
    unknown_enc = fr.face_encodings(rgb, locations)

    known_encodings = [bytes_to_encoding(s["face_encoding"]) for s in known_students if s["face_encoding"]]
    known_meta      = [s for s in known_students if s["face_encoding"]]

    for (top, right, bottom, left), enc in zip(locations, unknown_enc):
        label = "Tidak Dikenal"
        color = (0, 0, 200)   # Red (BGR)

        if known_encodings:
            distances = fr.face_distance(known_encodings, enc)
            best_idx  = int(np.argmin(distances))
            if distances[best_idx] <= TOLERANCE:
                label = known_meta[best_idx]["nama"]
                color = (50, 180, 50)   # Green (BGR)

        cv2.rectangle(frame_bgr, (left, top), (right, bottom), color, 2)
        cv2.rectangle(frame_bgr, (left, bottom - 28), (right, bottom), color, cv2.FILLED)
        cv2.putText(frame_bgr, label, (left + 6, bottom - 8),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1)

    return frame_bgr


# ── Save Face Photo ─────────────────────────────────────────────────────────────

def save_face_photo(frame_bgr, nim):
    """Save face image as JPEG. Returns relative path."""
    os.makedirs(FACE_IMAGES_DIR, exist_ok=True)
    filename  = f"{nim}.jpg"
    full_path = os.path.join(FACE_IMAGES_DIR, filename)
    cv2.imwrite(full_path, frame_bgr)
    return f"images/faces/{filename}"
