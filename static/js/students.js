let allStudents = [];

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
  setTimeout(() => el.remove(), 3200);
}

function avatarHtml(name) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 360;
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return `<div class="avatar" style="width:36px;height:36px;background:oklch(82% .16 ${h});color:oklch(32% .16 ${h});font-size:13px;">${escHtml(initials)}</div>`;
}

const SVG_TRASH = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`;

function renderTable(students) {
  const tbody = document.getElementById('students-tbody');
  if (students.length === 0) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="5">Belum ada mahasiswa terdaftar.</td></tr>';
    return;
  }
  tbody.innerHTML = students.map((s, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>
        <div class="student-cell">
          ${avatarHtml(s.nama)}
          <strong>${escHtml(s.nama)}</strong>
        </div>
      </td>
      <td style="font-family:var(--mono);font-size:13px;">${escHtml(s.nim)}</td>
      <td><span class="kelas-chip">${escHtml(s.kode_kelas)}</span></td>
      <td>
        <button class="btn btn-danger" style="padding:8px 12px;"
          onclick="hapusMahasiswa(${s.id}, ${JSON.stringify(s.nama)})"
          title="Hapus mahasiswa">
          ${SVG_TRASH}
        </button>
      </td>
    </tr>
  `).join('');
}

async function loadStudents() {
  try {
    const res    = await fetch('/api/students');
    allStudents  = await res.json();
    renderTable(allStudents);
  } catch (e) {
    document.getElementById('students-tbody').innerHTML =
      '<tr class="empty-row"><td colspan="5" style="color:var(--color-danger);">Gagal memuat data.</td></tr>';
  }
}

async function hapusMahasiswa(id, nama) {
  if (!confirm(`Yakin hapus mahasiswa "${nama}"?`)) return;
  try {
    const res  = await fetch(`/api/students/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      showToast('Mahasiswa berhasil dihapus.', 'success');
      loadStudents();
    } else {
      showToast(data.message || 'Gagal menghapus.', 'error');
    }
  } catch (e) {
    showToast('Terjadi kesalahan koneksi.', 'error');
  }
}

document.getElementById('search-input').addEventListener('input', function () {
  const q        = this.value.toLowerCase();
  const filtered = allStudents.filter(s =>
    s.nama.toLowerCase().includes(q) || s.nim.toLowerCase().includes(q)
  );
  renderTable(filtered);
});

loadStudents();
