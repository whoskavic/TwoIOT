"""
camera.py — Manages Raspberry Pi Camera via picamera2.
Provides:
  - MJPEG stream for live preview in browser
  - Single frame capture for face operations
"""

import cv2
import time
import threading
import numpy as np

try:
    from picamera2 import Picamera2
    USING_PICAMERA2 = True
except ImportError:
    USING_PICAMERA2 = False
    print("[CAMERA] picamera2 not found — falling back to OpenCV (USB webcam / dev)")


class CameraManager:
    def __init__(self, width=640, height=480):
        self.width   = width
        self.height  = height
        self._lock   = threading.Lock()
        self._frame  = None
        self._running = False
        self._thread  = None
        self._cam     = None

    # ── Lifecycle ──────────────────────────────────────────────────────────────

    def start(self):
        if self._running:
            return
        self._running = True

        if USING_PICAMERA2:
            self._cam = Picamera2()
            config = self._cam.create_video_configuration(
                main={"size": (self.width, self.height), "format": "BGR888"}
            )
            self._cam.configure(config)
            self._cam.start()
            time.sleep(0.5)   # warm-up
            print("[CAMERA] picamera2 started.")
        else:
            self._cam = cv2.VideoCapture(0)
            self._cam.set(cv2.CAP_PROP_FRAME_WIDTH,  self.width)
            self._cam.set(cv2.CAP_PROP_FRAME_HEIGHT, self.height)
            print("[CAMERA] OpenCV VideoCapture started.")

        self._thread = threading.Thread(target=self._capture_loop, daemon=True)
        self._thread.start()

    def stop(self):
        self._running = False
        if self._thread:
            self._thread.join(timeout=3)
        if self._cam:
            if USING_PICAMERA2:
                self._cam.stop()
                self._cam.close()
            else:
                self._cam.release()
        print("[CAMERA] Camera stopped.")

    # ── Internal capture loop ──────────────────────────────────────────────────

    def _capture_loop(self):
        while self._running:
            frame = self._read_frame()
            if frame is not None:
                with self._lock:
                    self._frame = frame
            time.sleep(0.03)   # ~30 fps

    def _read_frame(self):
        try:
            if USING_PICAMERA2:
                return self._cam.capture_array()
            else:
                ret, frame = self._cam.read()
                return frame if ret else None
        except Exception as e:
            print(f"[CAMERA] Frame read error: {e}")
            return None

    # ── Public API ─────────────────────────────────────────────────────────────

    def get_frame(self):
        """Return latest BGR frame or None."""
        with self._lock:
            return self._frame.copy() if self._frame is not None else None

    def capture_snapshot(self):
        """Return a single BGR frame for face capture."""
        frame = self.get_frame()
        if frame is None:
            time.sleep(0.5)
            frame = self.get_frame()
        return frame

    def generate_mjpeg(self, annotate_fn=None):
        """
        Generator that yields MJPEG frames for Flask Response.
        annotate_fn: optional callable(frame_bgr) -> frame_bgr
        """
        while True:
            frame = self.get_frame()
            if frame is None:
                time.sleep(0.05)
                continue

            if annotate_fn:
                try:
                    frame = annotate_fn(frame)
                except Exception:
                    pass

            _, jpeg = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 80])
            yield (
                b'--frame\r\n'
                b'Content-Type: image/jpeg\r\n\r\n'
                + jpeg.tobytes() +
                b'\r\n'
            )
            time.sleep(0.04)   # ~25 fps


# Singleton instance
camera = CameraManager(width=640, height=480)
