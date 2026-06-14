function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatTanggal(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
}

async function loadDashboard() {
  try {
    const res  = await fetch('/api/dashboard');
    const data = await res.json();
    document.getElementById('tanggal').textContent       = formatTanggal(data.tanggal);
    document.getElementById('total-students').textContent = data.total_students;
    document.getElementById('hadir-today').textContent    = data.hadir_today;
    document.getElementById('belum-hadir').textContent    = data.belum_hadir;
  } catch (e) {
    console.error('Dashboard load error:', e);
  }
}

async function loadAttendanceToday() {
  const tbody = document.getElementById('attendance-tbody');
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
    tbody.innerHTML = '<tr class="empty-row"><td colspan="5" style="color:var(--color-danger);">Gagal memuat data.</td></tr>';
  }
}

loadDashboard();
loadAttendanceToday();
