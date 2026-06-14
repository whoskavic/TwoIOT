let allStudents = [];

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatDate(str) {
  if (!str) return '—';
  return new Date(str).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
}

function showToast(msg, type = 'success') {
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

function renderTable(students) {
  const tbody = document.getElementById('students-tbody');
  if (students.length === 0) {
    tbody.innerHTML = '<tr class="empty-row"><td colspan="6">Belum ada mahasiswa terdaftar.</td></tr>';
    return;
  }
  tbody.innerHTML = students.map((s, i) => `
    <tr>
      <td>${i + 1}</td>
      <td><strong>${escHtml(s.nama)}</strong></td>
      <td>${escHtml(s.nim)}</td>
      <td>${escHtml(s.kode_kelas)}</td>
      <td>${formatDate(s.created_at)}</td>
      <td>
        <button class="btn btn-danger"
          onclick="hapusMahasiswa(${s.id}, ${JSON.stringify(s.nama)})">
          🗑️ Hapus
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
      '<tr class="empty-row"><td colspan="6" style="color:var(--color-danger);">Gagal memuat data.</td></tr>';
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
