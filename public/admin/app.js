/* ═══════════════════════════════════════════════════════════════════════════
   SpaceBook Admin Dashboard — App Logic
   ═══════════════════════════════════════════════════════════════════════════ */

const API = '/api';
let token = localStorage.getItem('admin_token');
let currentPage = 'overview';
let rejectSpaceId = null;

// ── Helpers ──────────────────────────────────────────────────────────────────
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

async function apiFetch(url, opts = {}) {
  const res = await fetch(`${API}${url}`, {
    ...opts,
    headers: { ...authHeaders(), ...(opts.headers || {}) },
  });
  if (res.status === 401 || res.status === 403) {
    logout();
    throw new Error('Unauthorized');
  }
  return res.json();
}

function showToast(message, type = 'success') {
  const toast = $('#toast');
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  setTimeout(() => toast.classList.remove('show'), 3000);
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatCurrency(val) {
  return `₹${Number(val || 0).toLocaleString('en-IN')}`;
}

function bookingStatusBadge(booking) {
  if (booking.status === 'CANCELLED') {
    return '<span class="badge cancelled">Cancelled</span>';
  }
  if (booking.is_confirmed) {
    return '<span class="badge accepted">Confirmed</span>';
  }
  return '<span class="badge pending">Unconfirmed</span>';
}

function approvalBadge(status) {
  const map = {
    'PENDING':  { cls: 'pending',  label: 'Pending Review' },
    'APPROVED': { cls: 'accepted', label: 'Approved' },
    'REJECTED': { cls: 'rejected', label: 'Rejected' },
  };
  const m = map[status] || { cls: 'cancelled', label: status };
  return `<span class="badge ${m.cls}">${m.label}</span>`;
}

function accountBadge(type) {
  const cls = type === 'admin' ? 'admin' : type === 'seller' ? 'seller' : 'buyer';
  return `<span class="badge ${cls}">${type.charAt(0).toUpperCase() + type.slice(1)}</span>`;
}

// ── Auth ─────────────────────────────────────────────────────────────────────
function showLogin() {
  $('#login-screen').style.display = 'flex';
  $('#dashboard').style.display = 'none';
}

function showDashboard() {
  $('#login-screen').style.display = 'none';
  $('#dashboard').style.display = 'flex';
  loadPage('overview');
}

function logout() {
  token = null;
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_name');
  showLogin();
}

$('#login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = $('#login-email').value.trim();
  const password = $('#login-password').value;
  const errorEl = $('#login-error');
  const btn = $('#login-btn');
  const btnText = btn.querySelector('.btn-text');
  const btnLoader = btn.querySelector('.btn-loader');

  errorEl.textContent = '';
  btnText.style.display = 'none';
  btnLoader.style.display = 'inline-block';
  btn.disabled = true;

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }

    if (data.user.account_type !== 'admin') {
      throw new Error('Access denied — admin accounts only.');
    }

    token = data.token;
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_name', data.user.name);
    $('#admin-name').textContent = data.user.name;
    $('.admin-avatar').textContent = data.user.name.charAt(0).toUpperCase();
    showDashboard();
  } catch (err) {
    errorEl.textContent = err.message;
  } finally {
    btnText.style.display = 'inline';
    btnLoader.style.display = 'none';
    btn.disabled = false;
  }
});

$('#logout-btn').addEventListener('click', logout);

// ── Navigation ───────────────────────────────────────────────────────────────
function navigateTo(page) {
  currentPage = page;

  $$('.nav-item[data-page]').forEach(n => n.classList.remove('active'));
  const navEl = $(`.nav-item[data-page="${page}"]`);
  if (navEl) navEl.classList.add('active');

  $$('.page').forEach(p => p.classList.remove('active'));
  const pageEl = $(`#page-${page}`);
  if (pageEl) {
    pageEl.classList.add('active');
    pageEl.style.animation = 'none';
    pageEl.offsetHeight;
    pageEl.style.animation = '';
  }

  const titles = { overview: 'Overview', spaces: 'Space Approvals', bookings: 'Bookings', users: 'Users' };
  $('#page-title').textContent = titles[page] || page;

  $('#sidebar').classList.remove('open');
  loadPage(page);
}

$$('.nav-item[data-page]').forEach(nav => {
  nav.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo(nav.dataset.page);
  });
});

$('#hamburger-btn').addEventListener('click', () => {
  $('#sidebar').classList.toggle('open');
});

// ── Load Pages ───────────────────────────────────────────────────────────────
async function loadPage(page) {
  switch (page) {
    case 'overview':  await loadOverview(); break;
    case 'spaces':    await loadSpaces(); break;
    case 'bookings':  await loadBookings(); break;
    case 'users':     await loadUsers(); break;
  }
}

// ── Overview ─────────────────────────────────────────────────────────────────
async function loadOverview() {
  try {
    const stats = await apiFetch('/admin/dashboard');

    // Safely extract values with defaults
    const totalBookings     = stats.total_bookings      || 0;
    const confirmedBookings = stats.confirmed_bookings   || 0;
    const unconfirmedBookings = stats.unconfirmed_bookings || 0;
    const totalRevenue      = stats.total_revenue        || 0;
    const totalUsers        = stats.total_users          || 0;
    const approvedSpaces    = stats.approved_spaces      || 0;
    const pendingSpaces     = stats.pending_spaces       || 0;

    // Update pending badge in sidebar
    const badge = $('#pending-spaces-badge');
    if (pendingSpaces > 0) {
      badge.textContent = pendingSpaces;
      badge.style.display = 'inline-flex';
    } else {
      badge.style.display = 'none';
    }

    // Pending alert
    const alert = $('#pending-alert');
    if (pendingSpaces > 0) {
      $('#pending-alert-count').textContent = pendingSpaces;
      alert.style.display = 'flex';
    } else {
      alert.style.display = 'none';
    }

    const statsHTML = `
      <div class="stat-card total">
        <div class="stat-icon">📋</div>
        <div class="stat-value">${totalBookings}</div>
        <div class="stat-label">Total Bookings</div>
      </div>
      <div class="stat-card accepted">
        <div class="stat-icon">✅</div>
        <div class="stat-value">${confirmedBookings}</div>
        <div class="stat-label">Confirmed by Owners</div>
      </div>
      <div class="stat-card pending">
        <div class="stat-icon">⏳</div>
        <div class="stat-value">${unconfirmedBookings}</div>
        <div class="stat-label">Unconfirmed</div>
      </div>
      <div class="stat-card revenue">
        <div class="stat-icon">💰</div>
        <div class="stat-value">${formatCurrency(totalRevenue)}</div>
        <div class="stat-label">Revenue (Confirmed)</div>
      </div>
      <div class="stat-card users">
        <div class="stat-icon">👥</div>
        <div class="stat-value">${totalUsers}</div>
        <div class="stat-label">Total Users</div>
      </div>
      <div class="stat-card spaces">
        <div class="stat-icon">🏢</div>
        <div class="stat-value">${approvedSpaces}</div>
        <div class="stat-label">Approved Spaces</div>
      </div>
      <div class="stat-card rejected">
        <div class="stat-icon">🚫</div>
        <div class="stat-value">${pendingSpaces}</div>
        <div class="stat-label">Pending Approval</div>
      </div>
    `;
    $('#stats-grid').innerHTML = statsHTML;

    // Recent bookings (read-only, last 5)
    const bookings = await apiFetch('/admin/bookings');
    const recent = bookings.slice(0, 5);
    renderRecentBookings(recent);
  } catch (err) {
    console.error('Load overview error:', err);
  }
}

function renderRecentBookings(bookings) {
  const body = $('#recent-bookings-body');
  if (bookings.length === 0) {
    body.innerHTML = '<tr><td colspan="6" class="empty-state"><p>No bookings yet</p></td></tr>';
    return;
  }
  body.innerHTML = bookings.map(b => `
    <tr>
      <td>#${b.id}</td>
      <td style="color:var(--text-primary);font-weight:500;">${b.space_title || '—'}</td>
      <td>${b.booker_name || '—'}</td>
      <td>${formatDate(b.booking_date)}</td>
      <td style="font-weight:600;">${formatCurrency(b.total_price)}</td>
      <td>${bookingStatusBadge(b)}</td>
    </tr>
  `).join('');
}

// ── Bookings (read-only) ─────────────────────────────────────────────────────
async function loadBookings(statusFilter) {
  try {
    const url = statusFilter && statusFilter !== 'all'
      ? `/admin/bookings?status=${statusFilter}`
      : '/admin/bookings';
    const bookings = await apiFetch(url);
    const body = $('#bookings-body');

    if (bookings.length === 0) {
      body.innerHTML = '<tr><td colspan="8" class="empty-state"><p>No bookings found</p></td></tr>';
      return;
    }

    body.innerHTML = bookings.map(b => `
      <tr>
        <td>#${b.id}</td>
        <td style="color:var(--text-primary);font-weight:500;">${b.space_title || '—'}</td>
        <td>${b.booker_name || '—'}</td>
        <td>${b.owner_name || '—'}</td>
        <td>${formatDate(b.booking_date)}</td>
        <td>${b.time_slot || '—'}</td>
        <td style="font-weight:600;">${formatCurrency(b.total_price)}</td>
        <td>${bookingStatusBadge(b)}</td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('Load bookings error:', err);
  }
}

// Booking filter buttons
$$('.filter-btn[data-status]').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('.filter-btn[data-status]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    loadBookings(btn.dataset.status);
  });
});

// ── Spaces (admin approves/rejects) ──────────────────────────────────────────
async function loadSpaces(approvalFilter) {
  try {
    const url = approvalFilter && approvalFilter !== 'all'
      ? `/admin/spaces?approval=${approvalFilter}`
      : '/admin/spaces';
    const spaces = await apiFetch(url);
    const body = $('#spaces-body');

    if (spaces.length === 0) {
      body.innerHTML = '<tr><td colspan="9" class="empty-state"><p>No spaces found</p></td></tr>';
      return;
    }

    body.innerHTML = spaces.map(s => {
      const isPending = s.approval_status === 'PENDING';
      const imgCell = s.image_url
        ? `<img src="${s.image_url}" class="space-thumb" alt="${s.title}" onerror="this.outerHTML='<div class=\\'space-thumb-placeholder\\'>🏢</div>'">`
        : '<div class="space-thumb-placeholder">🏢</div>';

      const actions = isPending
        ? `<div class="action-btns">
             <button class="btn-accept" onclick="approveSpace(${s.id})" title="Approve">✓ Approve</button>
             <button class="btn-reject" onclick="openRejectModal(${s.id})" title="Reject">✕ Reject</button>
           </div>`
        : s.approval_status === 'REJECTED'
          ? `<span style="color:var(--text-muted);font-size:12px;" title="${s.admin_rejection_reason || ''}">${s.admin_rejection_reason ? '📝 ' + s.admin_rejection_reason.substring(0, 30) + '...' : '—'}</span>`
          : `<span style="color:var(--text-muted);font-size:12px;">—</span>`;

      return `<tr>
        <td>#${s.id}</td>
        <td>${imgCell}</td>
        <td style="color:var(--text-primary);font-weight:500;">${s.title}</td>
        <td>${s.category || '—'}</td>
        <td>${s.area || '—'}</td>
        <td style="font-weight:600;">${formatCurrency(s.price_per_hr)}/hr</td>
        <td>${s.owner_name || '—'}</td>
        <td>${approvalBadge(s.approval_status || 'APPROVED')}</td>
        <td>${actions}</td>
      </tr>`;
    }).join('');
  } catch (err) {
    console.error('Load spaces error:', err);
  }
}

// Space filter buttons
$$('.filter-btn[data-approval]').forEach(btn => {
  btn.addEventListener('click', () => {
    $$('.filter-btn[data-approval]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    loadSpaces(btn.dataset.approval);
  });
});

// ── Approve / Reject Space ───────────────────────────────────────────────────
async function approveSpace(id) {
  try {
    await apiFetch(`/admin/spaces/${id}/approve`, { method: 'PATCH' });
    showToast('Space approved! It is now visible to buyers.', 'success');
    loadPage(currentPage);
  } catch (err) {
    showToast('Failed to approve space', 'error');
  }
}

function openRejectModal(id) {
  rejectSpaceId = id;
  $('#reject-reason').value = '';
  $('#reject-modal').style.display = 'flex';
}

function closeRejectModal() {
  rejectSpaceId = null;
  $('#reject-modal').style.display = 'none';
}

$('#confirm-reject-btn').addEventListener('click', async () => {
  if (!rejectSpaceId) return;
  const reason = $('#reject-reason').value.trim();

  try {
    await apiFetch(`/admin/spaces/${rejectSpaceId}/reject`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    });
    showToast('Space rejected. The seller has been notified.', 'success');
    closeRejectModal();
    loadPage(currentPage);
  } catch (err) {
    showToast('Failed to reject space', 'error');
  }
});

// ── Users ────────────────────────────────────────────────────────────────────
async function loadUsers() {
  try {
    const users = await apiFetch('/admin/users');
    const body = $('#users-body');

    if (users.length === 0) {
      body.innerHTML = '<tr><td colspan="5" class="empty-state"><p>No users found</p></td></tr>';
      return;
    }

    body.innerHTML = users.map(u => `
      <tr>
        <td>#${u.id}</td>
        <td style="color:var(--text-primary);font-weight:500;">${u.name}</td>
        <td>${u.email}</td>
        <td>${accountBadge(u.account_type)}</td>
        <td>${formatDate(u.created_at)}</td>
      </tr>
    `).join('');
  } catch (err) {
    console.error('Load users error:', err);
  }
}

// ── Init ─────────────────────────────────────────────────────────────────────
(function init() {
  if (token) {
    const name = localStorage.getItem('admin_name') || 'Admin';
    $('#admin-name').textContent = name;
    $('.admin-avatar').textContent = name.charAt(0).toUpperCase();
    showDashboard();
  } else {
    showLogin();
  }
})();

// Make functions globally accessible for inline onclick
window.approveSpace = approveSpace;
window.openRejectModal = openRejectModal;
window.closeRejectModal = closeRejectModal;
window.navigateTo = navigateTo;
