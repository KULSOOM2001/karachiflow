// Global Auth Check + Auto Logout
(function() {
  const TIMEOUT = 1 * 60 * 1000; // 1 minute
  const PUBLIC_PAGES = ['/', '/index.html'];

  // Check inactivity
  const lastActive = localStorage.getItem('kf_last_active');
  if (lastActive && Date.now() - parseInt(lastActive) > TIMEOUT) {
    sessionStorage.removeItem('kf_role');
    sessionStorage.removeItem('kf_admin_auth');
    localStorage.removeItem('kf_last_active');
  }

  // Update last active on any interaction
  ['click', 'keypress', 'scroll', 'mousemove'].forEach(evt => {
    window.addEventListener(evt, () => localStorage.setItem('kf_last_active', Date.now()), { passive: true });
  });

  // Set on login
  if (sessionStorage.getItem('kf_role')) {
    localStorage.setItem('kf_last_active', Date.now());
  }

  // Check if this is a page refresh (not navigation click)
  const isRefresh = performance.navigation.type === 1 || 
                    performance.getEntriesByType('navigation')[0]?.type === 'reload';
  
  const role = sessionStorage.getItem('kf_role');
  const path = window.location.pathname;
  
  // If it's a refresh, CLEAR SESSION and redirect to login
  if (isRefresh) {
    sessionStorage.clear();
    if (!PUBLIC_PAGES.includes(path)) {
      window.location.replace('/');
      return;
    }
    return;
  }
  
  // Allow public pages
  if (PUBLIC_PAGES.includes(path)) return;

  // Allow zone selection flow
  if (sessionStorage.getItem('kf_zone_selecting') === 'true') return;
  
  // Redirect to home if no role
  if (!role) {
    window.location.replace('/');
    return;
  }
  
  // Admin route protection
  if (role === 'admin' && path === '/admin') return;
  if (role === 'user' && path === '/admin') {
    window.location.replace('/');
    return;
  }
  
})();

// Handle browser back/forward buttons
window.addEventListener('popstate', function() {
  const path = window.location.pathname;
  // Clear session on back navigation
  sessionStorage.clear();
  if (path !== '/' && path !== '/index.html') {
    window.location.replace('/');
  }
});

// KarachiFlow shared utilities

const ZONES = [
  'Clifton', 'Defence (DHA)', 'Gulshan-e-Iqbal', 'PECHS', 'Nazimabad',
  'North Nazimabad', 'Malir', 'Korangi', 'Landhi', 'Lyari',
  'Orangi Town', 'Baldia', 'Saddar', 'Garden', 'FB Area',
  'Gulberg', 'Shah Faisal', 'Keamari', 'Surjani Town', 'New Karachi'
];

const ISSUE_TYPES = {
  load_shedding: { label: 'Load Shedding', icon: '⚡', color: 'yellow' },
  water_shortage: { label: 'Water Shortage', icon: '💧', color: 'blue' },
  tanker_unavailable: { label: 'Tanker Unavailable', icon: '🚛', color: 'green' }
};

const PRIORITY_LABELS = {
  critical: { label: 'Critical', class: 'badge-critical' },
  high: { label: 'High', class: 'badge-high' },
  medium: { label: 'Medium', class: 'badge-medium' },
  low: { label: 'Low', class: 'badge-low' }
};

const STATUS_LABELS = {
  active: { label: 'Active', class: 'badge-active' },
  verified: { label: 'Verified', class: 'badge-verified' },
  escalated: { label: 'Escalated', class: 'badge-escalated' },
  resolved: { label: 'Resolved', class: 'badge-resolved' }
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr);
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function getVoterId() {
  let id = sessionStorage.getItem('kf_voter_id');
  if (!id) {
    id = 'v_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('kf_voter_id', id);
  }
  return id;
}

function hasVoted(reportId) {
  const voted = JSON.parse(sessionStorage.getItem('kf_voted') || '[]');
  return voted.includes(reportId);
}

function markVoted(reportId) {
  const voted = JSON.parse(sessionStorage.getItem('kf_voted') || '[]');
  voted.push(reportId);
  sessionStorage.setItem('kf_voted', JSON.stringify(voted));
}

function showToast(msg, type = 'info') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

function severityClass(votes) {
  if (votes >= 20) return 'critical';
  if (votes >= 10) return 'high';
  if (votes >= 5) return 'medium';
  return 'low';
}

function initLangToggle() {
  // Urdu feature removed - kept empty for compatibility
}

function buildNav(active) {
  const zone = sessionStorage.getItem('kf_citizen_zone');
  const zoneBadge = zone ? `<span style="background:rgba(61,220,132,0.1);color:#3ddc84;padding:4px 10px;border-radius:12px;font-size:11px;margin-left:8px">📍 ${zone}</span>` : '';
  
  return `
    <nav>
      <a href="/" class="nav-logo">
        <span class="dot"></span>
        KarachiFlow
      </a>
      <ul class="nav-links">
        <li><a href="/" ${active==='home'?'class="active"':''}>🏠 Home</a></li>
        <li><a href="/feed" ${active==='feed'?'class="active"':''}>📡 Live Feed</a>${zoneBadge}</li>
        <li><a href="/zones" ${active==='zones'?'class="active"':''}>🗺️ Zones</a></li>
        <li><a href="/report" ${active==='report'?'class="active"':''}>➕ Report</a></li>
        ${active==='admin' ? `<li><a href="/admin" class="active">⚙️ Admin</a></li>` : ''}
      </ul>
      <button onclick="logout()" style="background:transparent;border:1px solid #333;border-radius:6px;color:#666;padding:6px 12px;cursor:pointer;font-size:12px">🚪 Logout</button>
    </nav>`;
}

function logout() {
  sessionStorage.clear();
  window.location.href = '/';
}

function renderReportCard(r, showAdminControls = false) {
  const type = ISSUE_TYPES[r.type] || ISSUE_TYPES.load_shedding;
  const priority = PRIORITY_LABELS[r.priority] || PRIORITY_LABELS.low;
  const status = STATUS_LABELS[r.status] || STATUS_LABELS.active;
  const voted = hasVoted(r._id);
  const sev = severityClass(r.votes);

  return `
    <div class="report-card ${sev}" data-id="${r._id}">
      <div class="report-header">
        <div style="display:flex;gap:12px;align-items:flex-start;flex:1">
          <div class="report-type-icon type-${r.type.split('_')[0]}">
            ${type.icon}
          </div>
          <div>
            <div class="report-title">${type.label}</div>
            <div class="report-zone">📍 ${r.zone} · ${timeAgo(r.createdAt)}</div>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">
          <span class="badge ${priority.class}">${priority.label}</span>
          <span class="badge ${status.class}">${status.label}</span>
        </div>
      </div>
      ${r.description ? `<div class="report-desc">${r.description}</div>` : ''}
      ${r.officialUpdate ? `<div class="official-update">🏛️ Official: ${r.officialUpdate}</div>` : ''}
      ${r.estimatedResolution ? `<div class="official-update" style="margin-top:6px">⏱️ ETA: ${r.estimatedResolution}</div>` : ''}
      <div class="report-footer">
        <div class="report-meta">
          <span>👤 ${r.reporterName || 'Anonymous'}</span>
          <span>🔥 ${r.votes} confirmed</span>
        </div>
        ${r.status !== 'resolved' ? `
          <button class="vote-btn ${voted ? 'voted' : ''}" onclick="vote('${r._id}', this)" ${voted ? 'disabled' : ''}>
            ${voted ? '✅' : '👆'} ${voted ? 'Confirmed' : 'I\'m affected'}
          </button>
        ` : `<span class="badge badge-resolved">✅ Resolved</span>`}
      </div>
      ${showAdminControls ? `
        <div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border);display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn btn-sm btn-success" onclick="updateStatus('${r._id}', 'resolved')">✅ Resolve</button>
          <button class="btn btn-sm btn-danger" onclick="updateStatus('${r._id}', 'escalated')">🚨 Escalate</button>
          <button class="btn btn-sm btn-secondary" onclick="addOfficialUpdate('${r._id}')">📢 Add Update</button>
        </div>
      ` : ''}
    </div>`;
}

async function vote(reportId, btn) {
  if (hasVoted(reportId)) return;
  try {
    const res = await fetch(`/api/reports/${reportId}/vote`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ voterId: getVoterId() })
    });
    const data = await res.json();
    if (data.success) {
      markVoted(reportId);
      btn.classList.add('voted');
      btn.disabled = true;
      btn.innerHTML = '✅ Confirmed';
      const card = btn.closest('.report-card');
      const voteCount = card.querySelector('.report-meta span:nth-child(2)');
      if (voteCount) voteCount.textContent = `🔥 ${data.votes} confirmed`;
      showToast('Issue confirmed! Thank you.', 'success');
    }
  } catch (e) {
    const queue = JSON.parse(sessionStorage.getItem('kf_vote_queue') || '[]');
    queue.push({ reportId, ts: Date.now() });
    sessionStorage.setItem('kf_vote_queue', JSON.stringify(queue));
    showToast('Saved offline — will sync when connected', 'info');
  }
}

function saveDraft(formData) {
  sessionStorage.setItem('kf_draft', JSON.stringify({ ...formData, savedAt: Date.now() }));
}

function loadDraft() {
  const d = sessionStorage.getItem('kf_draft');
  return d ? JSON.parse(d) : null;
}

function clearDraft() { sessionStorage.removeItem('kf_draft'); }