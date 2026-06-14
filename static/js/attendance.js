let scanning = false;

const SVG_SCAN = `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01"/><path d="M15 9h.01"/></svg>`;

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function avatarHtml(name) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 360;
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return `<div class="avatar" style="width:36px;height:36px;background:oklch(82% .16 ${h});color:oklch(32% .16 ${h});font-size:13px;flex-shrink:0;">${escHtml(initials)}</div>`;
}

async function scanAbsensi() {
  if (scanning) return;
  scanning = true;

  const btn        = document.getElementById('btn-scan');
  const resultCard = document.getElementById('scan-result');
  const absStatus  = document.getElementById('abs-status');

  btn.disabled     = true;
  btn.innerHTML    = '<span class="spinner"></span> Memindai...';
  resultCard.className = 'result-card';
  if (absStatus) absStatus.textContent = 'Memindai wajah...';

  try {
    const res  = await fetch('/api/scan', { method: 'POST' });
    const data = await res.json();

    resultCard.classList.add('show');

    if (!data.success) {
      resultCard.classList.add('err');
      resultCard.innerHTML = escHtml(data.message);
    } else if (data.saved) {
      resultCard.classList.add('ok');
      resultCard.innerHTML =
        `<strong>${escHtml(data.student.nama)}</strong>&nbsp;` +
        `(${escHtml(data.student.nim)}) — ` +
        `Absensi dicatat pukul <strong>${escHtml(data.waktu)}</strong>`;
      loadAttendanceLog();
    } else {
      resultCard.classList.add('warn');
      resultCard.innerHTML =
        `<strong>${escHtml(data.student.nama)}</strong> sudah absen hari ini.`;
    }
  } catch (e) {
    resultCard.classList.add('show', 'err');
    resultCard.innerHTML = 'Tidak dapat terhubung ke server.';
  } finally {
    btn.disabled  = false;
    btn.innerHTML = `${SVG_SCAN} Pindai Wajah`;
    scanning      = false;
    if (absStatus) absStatus.textContent = 'Arahkan wajah ke kamera, lalu tekan Pindai Wajah';
  }
}

async function loadAttendanceLog() {
  const list     = document.getElementById('attendance-log-list');
  const countEl  = document.getElementById('log-count');
  try {
    const res  = await fetch('/api/attendance/today');
    const rows = await res.json();

    if (countEl) countEl.textContent = `${rows.length} hadir`;

    if (rows.length === 0) {
      list.innerHTML = '<p class="log-empty">Belum ada absensi hari ini.</p>';
      return;
    }

    list.innerHTML = rows.map(r => `
      <div class="log-item">
        ${avatarHtml(r.nama)}
        <div class="log-info">
          <div class="log-name">${escHtml(r.nama)}</div>
          <div class="log-meta">${escHtml(r.nim)} &middot; ${escHtml(r.kode_kelas)}</div>
        </div>
        <div class="log-time">${escHtml(r.waktu)}</div>
      </div>
    `).join('');
  } catch (e) {
    console.error('Failed to load attendance log:', e);
  }
}

loadAttendanceLog();
setInterval(loadAttendanceLog, 10000);
