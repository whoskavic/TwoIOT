let faceEncodingB64 = null;

const SVG_CAMERA = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>`;
const SVG_CHECK  = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>`;

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function showToast(msg, type = 'success') {
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

async function captureWajah() {
  const btn    = document.getElementById('btn-capture');
  const status = document.getElementById('capture-status');

  btn.disabled   = true;
  btn.innerHTML  = '<span class="spinner"></span> Capturing...';
  status.innerHTML = '';

  try {
    const res  = await fetch('/api/capture', { method: 'POST' });
    const data = await res.json();

    if (data.success) {
      faceEncodingB64 = data.face_encoding_b64;
      status.innerHTML = '<div class="alert alert-success">Wajah berhasil di-capture</div>';
      document.getElementById('btn-save').disabled = false;
    } else {
      faceEncodingB64 = null;
      document.getElementById('btn-save').disabled = true;
      status.innerHTML = `<div class="alert alert-danger">${escHtml(data.message)}</div>`;
    }
  } catch (e) {
    status.innerHTML = '<div class="alert alert-danger">Tidak dapat terhubung ke server.</div>';
  } finally {
    btn.disabled  = false;
    btn.innerHTML = `${SVG_CAMERA} Capture Wajah`;
  }
}

async function simpanMahasiswa() {
  const nama       = document.getElementById('nama').value.trim();
  const nim        = document.getElementById('nim').value.trim();
  const kode_kelas = document.getElementById('kode_kelas').value.trim();
  const formStatus = document.getElementById('form-status');

  formStatus.innerHTML = '';

  if (!nama || !nim || !kode_kelas) {
    formStatus.innerHTML = '<div class="alert alert-warning">Semua field wajib diisi.</div>';
    return;
  }
  if (!faceEncodingB64) {
    formStatus.innerHTML = '<div class="alert alert-warning">Lakukan capture wajah terlebih dahulu.</div>';
    return;
  }

  const btn        = document.getElementById('btn-save');
  btn.disabled     = true;
  btn.innerHTML    = '<span class="spinner"></span> Menyimpan...';

  try {
    const res  = await fetch('/api/students', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ nama, nim, kode_kelas, face_encoding_b64: faceEncodingB64 }),
    });
    const data = await res.json();

    if (data.success) {
      showToast('Mahasiswa berhasil didaftarkan!', 'success');
      resetForm();
    } else {
      formStatus.innerHTML = `<div class="alert alert-danger">${escHtml(data.message)}</div>`;
      btn.disabled         = false;
      btn.innerHTML        = `${SVG_CHECK} Simpan Mahasiswa`;
    }
  } catch (e) {
    formStatus.innerHTML = '<div class="alert alert-danger">Tidak dapat terhubung ke server.</div>';
    btn.disabled         = false;
    btn.innerHTML        = `${SVG_CHECK} Simpan Mahasiswa`;
  }
}

function resetForm() {
  document.getElementById('nama').value        = '';
  document.getElementById('nim').value         = '';
  document.getElementById('kode_kelas').value  = '';
  document.getElementById('capture-status').innerHTML = '';
  document.getElementById('form-status').innerHTML    = '';
  const saveBtn = document.getElementById('btn-save');
  saveBtn.disabled  = true;
  saveBtn.innerHTML = `${SVG_CHECK} Simpan Mahasiswa`;
  faceEncodingB64 = null;
}
