let scanning = false;

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function scanAbsensi() {
  if (scanning) return;
  scanning = true;

  const btn        = document.getElementById('btn-scan');
  const resultCard = document.getElementById('scan-result');

  btn.disabled     = true;
  btn.innerHTML    = '<span class="spinner"></span> Scanning...';
  resultCard.className = 'result-card';

  try {
    const res  = await fetch('/api/scan', { method: 'POST' });
    const data = await res.json();

    resultCard.classList.add('show');

    if (!data.success) {
      resultCard.classList.add('err');
      resultCard.innerHTML = `❌ ${escHtml(data.message)}`;
    } else if (data.saved) {
      resultCard.classList.add('ok');
      resultCard.innerHTML =
        `✅ <strong>${escHtml(data.student.nama)}</strong> ` +
        `(${escHtml(data.student.nim)}) — ` +
        `Absensi berhasil dicatat pukul <strong>${escHtml(data.waktu)}</strong>`;
      loadAttendanceLog();
    } else {
      resultCard.classList.add('warn');
      resultCard.innerHTML =
        `ℹ️ <strong>${escHtml(data.student.nama)}</strong> sudah absen hari ini.`;
    }
  } catch (e) {
    resultCard.classList.add('show', 'err');
    resultCard.innerHTML = '❌ Tidak dapat terhubung ke server.';
  } finally {
    btn.disabled  = false;
    btn.innerHTML = '🔍 SCAN ABSENSI';
    scanning      = false;
  }
}

async function loadAttendanceLog() {
  const tbody = document.getElementById('attendance-log-tbody');
  try {
    const res  = await fetch('/api/attendance/today');
    const rows = await res.json();

    if (rows.length === 0) {
      tbody.innerHTML = '<tr class="empty-row"><td colspan="5">Belum ada absensi hari ini.</td></tr>';
      return;
    }

    tbody.innerHTML = rows.map((r, i) => `
      <tr>
        <td>${i + 1}</td>
        <td><strong>${escHtml(r.nama)}</strong></td>
        <td>${escHtml(r.nim)}</td>
        <td>${escHtml(r.kode_kelas)}</td>
        <td>${escHtml(r.waktu)}</td>
      </tr>
    `).join('');
  } catch (e) {
    console.error('Failed to load attendance log:', e);
  }
}

loadAttendanceLog();
setInterval(loadAttendanceLog, 10000);
