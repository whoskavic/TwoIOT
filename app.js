'use strict';

// ─── Icon path data (from design prototype icons.jsx) ─────────
const ICON_PATHS = {
  dashboard:  '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
  userplus:   '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/>',
  users:      '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  scanface:   '<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01"/><path d="M15 9h.01"/>',
  trash:      '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',
  search:     '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  check:      '<path d="M20 6 9 17l-5-5"/>',
  x:          '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  camera:     '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
  menu:       '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
  checkcircle:'<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>',
  xcircle:    '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>',
  cap:        '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
  calendar:   '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
  clock:      '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  usercheck:  '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/>',
  userx:      '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="17" x2="22" y1="8" y2="13"/><line x1="22" x2="17" y1="8" y2="13"/>',
  refresh:    '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/>',
  chevright:  '<path d="m9 18 6-6-6-6"/>',
  idcard:     '<rect width="18" height="14" x="3" y="5" rx="2"/><path d="M7 15h0M2 9.5h20"/><circle cx="9" cy="11" r="1.5"/><path d="M14 10h4M14 13h2"/>',
  cpu:        '<rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2M9 2v2M15 20v2M9 20v2M2 15h2M2 9h2M20 15h2M20 9h2"/>',
};

function icon(name, size = 20, stroke = 2, extraClass = '') {
  const cls = 'ico' + (extraClass ? ' ' + extraClass : '');
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round" class="${cls}" aria-hidden="true">${ICON_PATHS[name] || ''}</svg>`;
}

// ─── Helpers ──────────────────────────────────────────────────
function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function nowTime() {
  return new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

function todayStr() {
  return new Date().toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
}

function initials(name) {
  const p = name.trim().split(/\s+/);
  return ((p[0]?.[0] || '') + (p[1]?.[0] || '')).toUpperCase();
}

function tint(name) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 360;
  return h;
}

function avatarHtml(name, size = 38) {
  const h = tint(name);
  const fs = Math.round(size * 0.36);
  return `<div class="avatar" style="width:${size}px;height:${size}px;font-size:${fs}px;background:oklch(0.92 0.05 ${h});color:oklch(0.42 0.13 ${h})">${esc(initials(name))}</div>`;
}

// ─── Seed data ─────────────────────────────────────────────────
const SEED_STUDENTS = [
  { id: 1, nama: 'Adelia Putri Maharani', nim: '2110511001', kelas: 'IF-3A' },
  { id: 2, nama: 'Bagas Dwi Saputra',     nim: '2110511014', kelas: 'IF-3A' },
  { id: 3, nama: 'Citra Ayu Lestari',     nim: '2110511022', kelas: 'IF-3B' },
  { id: 4, nama: 'Dimas Rizky Pratama',   nim: '2110511037', kelas: 'SI-2A' },
  { id: 5, nama: 'Eka Nur Wulandari',     nim: '2110511045', kelas: 'IF-3B' },
  { id: 6, nama: 'Fajar Hidayat',         nim: '2110511052', kelas: 'TI-1C' },
  { id: 7, nama: 'Gita Salsabila',        nim: '2110511068', kelas: 'IF-3A' },
  { id: 8, nama: 'Hafiz Ramadhan',        nim: '2110511071', kelas: 'SI-2A' },
];

const KELAS = ['IF-3A', 'IF-3B', 'SI-2A', 'TI-1C'];

// ─── App State ─────────────────────────────────────────────────
let nextId = 9;

const state = {
  students:    SEED_STUDENTS.map(s => ({ ...s })),
  log:         [],
  page:        'dashboard',
  drawerOpen:  false,

  reg: {
    nama:         '',
    nim:          '',
    kelas:        '',
    captured:     false,
    captureState: 'idle', // idle | scanning | success
    timer:        null,
  },

  abs: {
    scanState:  'idle', // idle | scanning | success | fail
    person:     null,
    scanTimer:  null,
    idleTimer:  null,
  },

  data: {
    query:         '',
    confirmTarget: null,
  },
};

// ─── Camera feed HTML ──────────────────────────────────────────
function camFeedHtml(st, person, large = false) {
  const cls = `camfeed${large ? ' camfeed--lg' : ''} is-${st}`;

  let hint = '';
  if (st === 'idle') {
    hint = `<div class="camfeed__hint">
      ${icon('camera', large ? 40 : 28, 1.6)}
      <span>${large ? 'Posisikan wajah di dalam bingkai' : 'Kamera Raspberry Pi'}</span>
      <code class="camfeed__code">picamera2 · 1280×720</code>
    </div>`;
  } else if (st === 'scanning') {
    hint = `<div class="camfeed__hint camfeed__hint--live">
      <span class="live-dot"></span> Memindai wajah…
    </div>`;
  }

  let badge = '';
  if (st === 'success' && person) {
    badge = `<div class="camfeed__badge is-ok">${icon('checkcircle', 18)} ${esc(person.nama)}</div>`;
  } else if (st === 'fail') {
    badge = `<div class="camfeed__badge is-bad">${icon('xcircle', 18)} Tidak dikenali</div>`;
  }

  return `<div class="${cls}">
    <div class="camfeed__noise"></div>
    <div class="camfeed__grid"></div>
    <div class="camfeed__bracket">
      <span class="br br--tl"></span><span class="br br--tr"></span>
      <span class="br br--bl"></span><span class="br br--br"></span>
      ${st === 'scanning' ? '<span class="camfeed__scan"></span>' : ''}
    </div>
    ${hint}${badge}
  </div>`;
}

// ─── Dashboard ─────────────────────────────────────────────────
function renderDashboard() {
  const present = state.log.length;
  const total   = state.students.length;
  const absent  = Math.max(total - present, 0);

  const cards = [
    { icon: 'cap',       label: 'Total Mahasiswa', value: total,   klass: 'c-neutral' },
    { icon: 'usercheck', label: 'Hadir Hari Ini',  value: present, klass: 'c-green'   },
    { icon: 'userx',     label: 'Belum Absen',     value: absent,  klass: 'c-red'     },
  ];

  const statsHtml = cards.map(c => `
    <div class="statcard ${c.klass}">
      <div class="statcard__ico">${icon(c.icon, 22)}</div>
      <div class="statcard__num">${c.value}</div>
      <div class="statcard__lbl">${c.label}</div>
    </div>`).join('');

  let tableHtml;
  if (state.log.length === 0) {
    tableHtml = `<div class="empty">
      <div class="empty__ico">${icon('scanface', 28, 1.6)}</div>
      <p>Belum ada mahasiswa yang absen hari ini.</p>
    </div>`;
  } else {
    const rows = state.log.map(r => `<tr>
      <td><div class="cellname">${avatarHtml(r.nama, 32)}<span>${esc(r.nama)}</span></div></td>
      <td class="mono">${esc(r.nim)}</td>
      <td><span class="chip">${esc(r.kelas)}</span></td>
      <td class="mono">${esc(r.time)}</td>
      <td><span class="badge badge--ok">${icon('check', 13)} Hadir</span></td>
    </tr>`).join('');
    tableHtml = `<div class="tablewrap">
      <table class="table">
        <thead><tr><th>Mahasiswa</th><th>NIM</th><th>Kelas</th><th>Waktu</th><th>Status</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
  }

  return `<div class="page">
    <div class="pagehead">
      <h2>Dashboard</h2>
      <p>${esc(todayStr())}</p>
    </div>

    <div class="statgrid">${statsHtml}</div>

    <div class="cta">
      <div class="cta__txt">
        <h3>Mulai sesi absensi hari ini</h3>
        <p>Kamera Raspberry Pi siap mengenali wajah mahasiswa secara real-time.</p>
      </div>
      <button class="btn btn--primary btn--lg" id="cta-absensi">
        ${icon('scanface', 20)} MULAI ABSENSI
      </button>
    </div>

    <div class="card">
      <div class="card__head">
        <h4>${icon('clock', 18)} Kehadiran Hari Ini</h4>
        <span class="muted">${present} dari ${total} mahasiswa</span>
      </div>
      ${tableHtml}
    </div>
  </div>`;
}

// ─── Register Mahasiswa ────────────────────────────────────────
function renderRegister() {
  const r     = state.reg;
  const valid = r.nama.trim() && r.nim.trim() && r.kelas && r.captured;
  const st    = r.captureState;

  const segHtml = KELAS.map(k =>
    `<button class="seg__opt${r.kelas === k ? ' active' : ''}" data-kelas="${esc(k)}">${esc(k)}</button>`
  ).join('');

  const captureLabel = st === 'scanning' ? 'Memindai…'
                     : r.captured        ? 'Ambil Ulang'
                     :                     'Capture Wajah';
  const captureIconName = r.captured ? 'refresh' : 'camera';

  return `<div class="page">
    <div class="pagehead">
      <h2>Register Mahasiswa</h2>
      <p>Daftarkan mahasiswa baru beserta data wajahnya</p>
    </div>

    <div class="reggrid">
      <div class="card">
        <div class="card__head">
          <h4>${icon('idcard', 18)} Data Mahasiswa</h4>
        </div>
        <div class="form">
          <label class="field">
            <span class="field__lbl">Nama Lengkap</span>
            <input class="input" id="reg-nama" type="text" value="${esc(r.nama)}" placeholder="cth. Adelia Putri Maharani" autocomplete="off">
          </label>
          <label class="field">
            <span class="field__lbl">NIM</span>
            <input class="input mono" id="reg-nim" type="text" inputmode="numeric" value="${esc(r.nim)}" placeholder="cth. 2110511001" autocomplete="off">
          </label>
          <div class="field">
            <span class="field__lbl">Kode Kelas</span>
            <div class="seg" id="seg-kelas">${segHtml}</div>
          </div>
        </div>
      </div>

      <div class="card" id="cam-card">
        <div class="card__head">
          <h4>${icon('camera', 18)} Capture Wajah</h4>
          ${r.captured ? `<span class="badge badge--ok">${icon('check', 13)} Tersimpan</span>` : ''}
        </div>
        ${camFeedHtml(st, { nama: r.nama || 'Mahasiswa' })}
        <button class="btn btn--ghost btn--block" id="btn-capture" ${st === 'scanning' ? 'disabled' : ''} style="margin-top:14px">
          ${icon(st === 'scanning' ? 'camera' : captureIconName, 18)}
          ${captureLabel}
        </button>
        <p class="hint">Sistem akan menyimpan 128-dim face embedding ke dataset lokal.</p>
      </div>
    </div>

    <div class="formbar">
      <button class="btn btn--text" id="btn-reg-reset">Reset</button>
      <button class="btn btn--accent btn--lg${valid ? '' : ' is-disabled'}" id="btn-reg-save" ${valid ? '' : 'disabled'}>
        ${icon('check', 18)} Simpan Mahasiswa
      </button>
    </div>
  </div>`;
}

// ─── Data Mahasiswa ────────────────────────────────────────────
function renderData() {
  const q        = state.data.query.trim().toLowerCase();
  const filtered = q
    ? state.students.filter(m =>
        m.nama.toLowerCase().includes(q) ||
        m.nim.includes(q) ||
        m.kelas.toLowerCase().includes(q))
    : state.students;

  let bodyHtml;
  if (filtered.length === 0) {
    bodyHtml = `<div class="empty">
      <div class="empty__ico">${icon('search', 28, 1.6)}</div>
      <p>${q ? 'Tidak ada mahasiswa yang cocok.' : 'Belum ada data mahasiswa.'}</p>
    </div>`;
  } else {
    const rows = filtered.map((m, i) => `<tr>
      <td class="mono muted col-no">${String(i + 1).padStart(2, '0')}</td>
      <td><div class="cellname">${avatarHtml(m.nama, 32)}<span>${esc(m.nama)}</span></div></td>
      <td class="mono">${esc(m.nim)}</td>
      <td><span class="chip">${esc(m.kelas)}</span></td>
      <td class="col-act">
        <button class="iconbtn iconbtn--danger" data-del="${m.id}" title="Hapus ${esc(m.nama)}">
          ${icon('trash', 16)}
        </button>
      </td>
    </tr>`).join('');
    bodyHtml = `<div class="tablewrap">
      <table class="table">
        <thead><tr><th class="col-no">No</th><th>Nama</th><th>NIM</th><th>Kelas</th><th class="col-act">Aksi</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
  }

  const modal = state.data.confirmTarget ? renderDeleteModal(state.data.confirmTarget) : '';

  return `<div class="page">
    <div class="pagehead">
      <h2>Data Mahasiswa</h2>
      <p>${state.students.length} mahasiswa terdaftar</p>
    </div>

    <div class="card">
      <div class="searchbar">
        ${icon('search', 18, 2, 'searchbar__ico')}
        <input class="searchbar__input" id="search-input" type="text"
          value="${esc(state.data.query)}" placeholder="Cari nama, NIM, atau kelas…" autocomplete="off">
        ${state.data.query
          ? `<button class="searchbar__clear" id="search-clear" title="Hapus pencarian">${icon('x', 16)}</button>`
          : ''}
      </div>
      ${bodyHtml}
    </div>

    ${modal}
  </div>`;
}

function renderDeleteModal(student) {
  return `<div class="modal" id="del-modal">
    <div class="modal__box" id="del-box">
      <div class="modal__ico">${icon('trash', 22)}</div>
      <h4>Hapus mahasiswa?</h4>
      <p>Data <b>${esc(student.nama)}</b> (${esc(student.nim)}) dan face embedding-nya akan dihapus permanen.</p>
      <div class="modal__act">
        <button class="btn btn--text" id="btn-cancel">Batal</button>
        <button class="btn btn--danger" id="btn-del-confirm" data-del="${student.id}">Hapus</button>
      </div>
    </div>
  </div>`;
}

// ─── Absensi ───────────────────────────────────────────────────
function renderAbsensi() {
  const a  = state.abs;
  const st = a.scanState;

  let statusHtml = '';
  if (st === 'idle') {
    statusHtml = `<div class="absstatus__idle">Tekan tombol untuk memulai pemindaian wajah.</div>`;
  } else if (st === 'scanning') {
    statusHtml = `<div class="absstatus__scan"><span class="live-dot"></span> Mengenali wajah…</div>`;
  } else if (st === 'success' && a.person) {
    statusHtml = `<div class="result result--ok">
      ${avatarHtml(a.person.nama, 46)}
      <div class="result__info">
        <div class="result__name">${esc(a.person.nama)}</div>
        <div class="result__nim mono">${esc(a.person.nim)} · ${esc(a.person.kelas)}</div>
      </div>
      <div class="result__tag">${icon('checkcircle', 18)} Berhasil Absen</div>
    </div>`;
  } else if (st === 'fail') {
    statusHtml = `<div class="result result--bad">
      <div class="result__failico">${icon('userx', 24)}</div>
      <div class="result__info">
        <div class="result__name">Wajah Tidak Dikenali</div>
        <div class="result__nim">Pastikan wajah sudah terdaftar &amp; pencahayaan cukup.</div>
      </div>
      <div class="result__tag result__tag--bad">${icon('xcircle', 18)} Gagal</div>
    </div>`;
  }

  const logItems = [...state.log].reverse().map(r => `
    <li class="logitem">
      ${avatarHtml(r.nama, 36)}
      <div class="logitem__info">
        <div class="logitem__name">${esc(r.nama)}</div>
        <div class="logitem__meta mono">${esc(r.nim)}</div>
      </div>
      <div class="logitem__time mono">${esc(r.time)}</div>
    </li>`).join('');

  const emptyLog = `<div class="empty empty--sm">
    <div class="empty__ico">${icon('clock', 22, 1.6)}</div>
    <p>Belum ada yang absen.</p>
  </div>`;

  return `<div class="page">
    <div class="pagehead">
      <h2>Absensi</h2>
      <p>Pengenalan wajah real-time</p>
    </div>

    <div class="absgrid">
      <div class="card abscam">
        ${camFeedHtml(st, a.person, true)}
        <div class="absstatus">${statusHtml}</div>
        <button class="btn btn--primary btn--lg btn--block" id="btn-scan" ${st === 'scanning' ? 'disabled' : ''}>
          ${icon('scanface', 20)} ${st === 'scanning' ? 'Memindai…' : 'Pindai Wajah'}
        </button>
      </div>

      <div class="card abslog">
        <div class="card__head">
          <h4>${icon('clock', 18)} Log Hari Ini</h4>
          <span class="chip chip--count">${state.log.length}</span>
        </div>
        ${state.log.length === 0 ? emptyLog : `<ul class="loglist">${logItems}</ul>`}
      </div>
    </div>
  </div>`;
}

// ─── Sidebar ───────────────────────────────────────────────────
const NAV = [
  { key: 'dashboard', label: 'Dashboard',          icon: 'dashboard' },
  { key: 'register',  label: 'Register Mahasiswa', icon: 'userplus'  },
  { key: 'data',      label: 'Data Mahasiswa',     icon: 'users'     },
  { key: 'absensi',   label: 'Absensi',            icon: 'scanface'  },
];

function renderSidebar() {
  const navItems = NAV.map(n => `
    <button class="nav__item${state.page === n.key ? ' active' : ''}" data-page="${n.key}">
      ${icon(n.icon, 20)}
      <span>${n.label}</span>
      ${icon('chevright', 16, 2, 'nav__chev')}
    </button>`).join('');

  return `<div class="brand">
      <div class="brand__logo">
        <svg viewBox="0 0 40 40" width="26" height="26" aria-hidden="true">
          <g fill="#fff">
            <circle cx="20" cy="9"  r="4.4"/>
            <circle cx="13.5" cy="14" r="4.4"/>
            <circle cx="26.5" cy="14" r="4.4"/>
            <circle cx="11" cy="21" r="4.4"/>
            <circle cx="29" cy="21" r="4.4"/>
            <circle cx="16" cy="26" r="4.4"/>
            <circle cx="24" cy="26" r="4.4"/>
            <circle cx="20" cy="20" r="4.4"/>
          </g>
        </svg>
      </div>
      <div class="brand__txt">
        <div class="brand__name">Two <span>IOT</span></div>
        <div class="brand__sub">Face Attendance</div>
      </div>
    </div>

    <nav class="nav" id="main-nav">${navItems}</nav>

    <div class="sidefoot">
      <div class="device">
        ${icon('cpu', 16)}
        <div>
          <div class="device__name">Raspberry Pi 4B</div>
          <div class="device__stat"><span class="live-dot"></span> Online · 38°C</div>
        </div>
      </div>
    </div>

    <svg class="circuit" viewBox="0 0 240 240" aria-hidden="true">
      <g fill="none" stroke="currentColor" stroke-width="1.4">
        <path d="M20 200 H80 V150 H140"/>
        <path d="M0 170 H50 V120"/>
        <path d="M200 240 V190 H150"/>
        <path d="M120 220 H180 V160"/>
      </g>
      <g fill="currentColor">
        <circle cx="140" cy="150" r="3.5"/>
        <circle cx="50"  cy="120" r="3.5"/>
        <circle cx="150" cy="190" r="3.5"/>
        <circle cx="180" cy="160" r="3.5"/>
        <circle cx="80"  cy="150" r="3.5"/>
      </g>
    </svg>`;
}

function updateSidebarActive() {
  document.querySelectorAll('.nav__item[data-page]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.page === state.page);
  });
}

// ─── Navigation ────────────────────────────────────────────────
function navigate(page) {
  // Cancel running absensi timers so they don't overwrite the new page
  clearTimeout(state.abs.scanTimer);
  clearTimeout(state.abs.idleTimer);
  if (page !== 'absensi') {
    state.abs.scanState = 'idle';
    state.abs.person    = null;
  }

  state.page       = page;
  state.drawerOpen = false;
  closeMobileDrawer();
  updateSidebarActive();
  renderPage();
}

function closeMobileDrawer() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('scrim').classList.remove('show');
  state.drawerOpen = false;
}

// ─── Page render ───────────────────────────────────────────────
function renderPage() {
  const content = document.getElementById('content');
  switch (state.page) {
    case 'dashboard': content.innerHTML = renderDashboard(); bindDashboardEvents(); break;
    case 'register':  content.innerHTML = renderRegister();  bindRegisterEvents();  break;
    case 'data':      content.innerHTML = renderData();      bindDataEvents();      break;
    case 'absensi':   content.innerHTML = renderAbsensi();   bindAbsensiEvents();   break;
  }
}

// ─── Dashboard events ──────────────────────────────────────────
function bindDashboardEvents() {
  document.getElementById('cta-absensi')?.addEventListener('click', () => navigate('absensi'));
}

// ─── Register events ───────────────────────────────────────────
function bindRegisterEvents() {
  document.getElementById('reg-nama')?.addEventListener('input', e => {
    state.reg.nama = e.target.value;
    refreshSaveBtn();
  });

  document.getElementById('reg-nim')?.addEventListener('input', e => {
    const clean = e.target.value.replace(/\D/g, '');
    e.target.value = clean;
    state.reg.nim = clean;
    refreshSaveBtn();
  });

  document.getElementById('seg-kelas')?.addEventListener('click', e => {
    const btn = e.target.closest('.seg__opt');
    if (!btn) return;
    state.reg.kelas = btn.dataset.kelas;
    document.querySelectorAll('.seg__opt').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    refreshSaveBtn();
  });

  document.getElementById('btn-capture')?.addEventListener('click', doCapture);
  document.getElementById('btn-reg-reset')?.addEventListener('click', resetRegister);
  document.getElementById('btn-reg-save')?.addEventListener('click', saveStudent);
}

function refreshSaveBtn() {
  const r     = state.reg;
  const valid = r.nama.trim() && r.nim.trim() && r.kelas && r.captured;
  const btn   = document.getElementById('btn-reg-save');
  if (!btn) return;
  btn.disabled = !valid;
  btn.classList.toggle('is-disabled', !valid);
}

function doCapture() {
  if (state.reg.captureState === 'scanning') return;

  // Snapshot current input values before re-render
  state.reg.nama = document.getElementById('reg-nama')?.value ?? state.reg.nama;
  state.reg.nim  = document.getElementById('reg-nim')?.value  ?? state.reg.nim;

  state.reg.captureState = 'scanning';
  state.reg.captured     = false;
  renderPage();

  clearTimeout(state.reg.timer);
  state.reg.timer = setTimeout(() => {
    // Snapshot again in case user typed during the 1.6s window
    const namaEl = document.getElementById('reg-nama');
    const nimEl  = document.getElementById('reg-nim');
    if (namaEl) state.reg.nama = namaEl.value;
    if (nimEl)  state.reg.nim  = nimEl.value;

    state.reg.captureState = 'success';
    state.reg.captured     = true;
    renderPage();
  }, 1600);
}

function resetRegister() {
  clearTimeout(state.reg.timer);
  state.reg = { nama: '', nim: '', kelas: '', captured: false, captureState: 'idle', timer: null };
  renderPage();
}

function saveStudent() {
  const r = state.reg;
  if (!r.nama.trim() || !r.nim.trim() || !r.kelas || !r.captured) return;

  state.students.push({ id: nextId++, nama: r.nama.trim(), nim: r.nim.trim(), kelas: r.kelas });
  clearTimeout(r.timer);
  state.reg = { nama: '', nim: '', kelas: '', captured: false, captureState: 'idle', timer: null };

  showToast('Mahasiswa berhasil didaftarkan');
  renderPage();
}

// ─── Data events ───────────────────────────────────────────────
function bindDataEvents() {
  const searchInput = document.getElementById('search-input');

  searchInput?.addEventListener('input', e => {
    state.data.query = e.target.value;
    renderPage();
    // Restore focus after re-render
    const ni = document.getElementById('search-input');
    if (ni) ni.focus();
  });

  document.getElementById('search-clear')?.addEventListener('click', () => {
    state.data.query = '';
    renderPage();
    document.getElementById('search-input')?.focus();
  });

  // Delete button clicks (delegated via data-del attribute)
  document.querySelectorAll('[data-del]').forEach(btn => {
    if (btn.id === 'btn-del-confirm') return; // handled separately
    btn.addEventListener('click', () => {
      const id      = parseInt(btn.dataset.del, 10);
      const student = state.students.find(s => s.id === id);
      if (student) { state.data.confirmTarget = student; renderPage(); }
    });
  });

  // Modal backdrop click → cancel
  document.getElementById('del-modal')?.addEventListener('click', e => {
    if (e.target === document.getElementById('del-modal')) {
      state.data.confirmTarget = null;
      renderPage();
    }
  });

  document.getElementById('btn-cancel')?.addEventListener('click', () => {
    state.data.confirmTarget = null;
    renderPage();
  });

  document.getElementById('btn-del-confirm')?.addEventListener('click', e => {
    const id         = parseInt(e.currentTarget.dataset.del, 10);
    const deletedNim = state.students.find(s => s.id === id)?.nim;
    state.students   = state.students.filter(s => s.id !== id);
    if (deletedNim) state.log = state.log.filter(l => l.nim !== deletedNim);
    state.data.confirmTarget = null;
    renderPage();
  });
}

// ─── Absensi events ────────────────────────────────────────────
function bindAbsensiEvents() {
  document.getElementById('btn-scan')?.addEventListener('click', doScan);
}

function doScan() {
  const a = state.abs;
  if (a.scanState === 'scanning') return;

  clearTimeout(a.scanTimer);
  clearTimeout(a.idleTimer);
  a.scanState = 'scanning';
  a.person    = null;
  refreshAbsensi();

  a.scanTimer = setTimeout(() => {
    const pending = state.students.filter(s => !state.log.some(l => l.nim === s.nim));
    const pool    = pending.length ? pending : state.students;
    const hit     = Math.random() < 0.82 && pool.length > 0;

    if (hit) {
      const p  = pool[Math.floor(Math.random() * pool.length)];
      a.person = p;
      a.scanState = 'success';
      if (!state.log.some(l => l.nim === p.nim)) {
        state.log.push({ nama: p.nama, nim: p.nim, kelas: p.kelas, time: nowTime() });
      }
    } else {
      a.scanState = 'fail';
    }
    refreshAbsensi();

    a.idleTimer = setTimeout(() => {
      a.scanState = 'idle';
      refreshAbsensi();
    }, 2600);
  }, 2100);
}

function refreshAbsensi() {
  if (state.page !== 'absensi') return;
  const content = document.getElementById('content');
  content.innerHTML = renderAbsensi();
  bindAbsensiEvents();
}

// ─── Toast ─────────────────────────────────────────────────────
let toastTimer;

function showToast(msg) {
  document.getElementById('app-toast')?.remove();
  clearTimeout(toastTimer);

  const el = document.createElement('div');
  el.id        = 'app-toast';
  el.className = 'toast';
  el.innerHTML = `${icon('checkcircle', 18)} ${esc(msg)}`;
  document.body.appendChild(el);

  toastTimer = setTimeout(() => el.remove(), 2600);
}

// ─── Init ──────────────────────────────────────────────────────
function init() {
  const sidebar = document.getElementById('sidebar');
  sidebar.innerHTML = renderSidebar();

  // Sidebar nav clicks
  sidebar.addEventListener('click', e => {
    const btn = e.target.closest('[data-page]');
    if (btn) navigate(btn.dataset.page);
  });

  // Mobile hamburger
  document.getElementById('hamb-btn')?.addEventListener('click', () => {
    state.drawerOpen = !state.drawerOpen;
    sidebar.classList.toggle('open', state.drawerOpen);
    document.getElementById('scrim').classList.toggle('show', state.drawerOpen);
  });

  // Scrim tap → close drawer
  document.getElementById('scrim')?.addEventListener('click', closeMobileDrawer);

  renderPage();
}

document.addEventListener('DOMContentLoaded', init);
