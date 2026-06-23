// public/ui_visitorlog.js
// ════════════════════════════════════════════════════════════════════════════
// UI — OWNER VIEW: who visited, and booking requests received
// ════════════════════════════════════════════════════════════════════════════

async function renderVisitorLogPage() {
  const [visitors, requests] = await Promise.all([fetchVisitors(), fetchBookingRequests()]);

  return `
    <div class="visitorlog-page">
      <h2>👁 Visitors &amp; Requests</h2>

      <div class="vl-section">
        <h3>📞 Booking Requests <span class="count-badge">${requests.length}</span></h3>
        ${requests.length ? `
        <div class="vl-requests">
          ${requests.map(r => `
            <div class="vl-request-card ${r.status === 'done' ? 'vl-done' : ''}">
              <div class="vl-req-top">
                <span class="vl-req-name">${r.name}</span>
                <span class="vl-req-status status-${r.status}">${r.status}</span>
              </div>
              <div class="vl-req-contact">${r.contact}</div>
              ${r.preferredTime ? `<div class="vl-req-time">🕐 ${r.preferredTime}</div>` : ''}
              ${r.message ? `<div class="vl-req-msg">${r.message}</div>` : ''}
              <div class="vl-req-date">${new Date(r.at).toLocaleString()}</div>
              <div class="vl-req-actions">
                ${r.status !== 'done' ? `<button class="btn-sm" onclick="VisitorLogUI.markDone('${r.id}')">Mark Done</button>` : ''}
              </div>
            </div>`).join('')}
        </div>` : '<p class="hint">No requests yet.</p>'}
      </div>

      <div class="vl-section">
        <h3>👣 Recent Visitors <span class="count-badge">${visitors.length}</span></h3>
        ${visitors.length ? `
        <table class="db-table">
          <thead><tr><th>Time</th><th>Page</th><th>Location</th><th>Device</th><th>IP</th></tr></thead>
          <tbody>
            ${visitors.slice(0, 100).map(v => `
              <tr>
                <td>${new Date(v.at).toLocaleString()}</td>
                <td>${v.page || '/'}</td>
                <td>${v.location ? (v.location.city ? `${v.location.city}, ${v.location.country || ''}` : `${v.location.lat?.toFixed(2)}, ${v.location.lng?.toFixed(2)}`) : '–'}</td>
                <td>${v.device?.platform || '–'}</td>
                <td>${v.ip}</td>
              </tr>`).join('')}
          </tbody>
        </table>` : '<p class="hint">No visitor data yet — visitors must allow location/device sharing for this to populate.</p>'}
      </div>
    </div>`;
}

async function fetchVisitors() {
  try {
    const res = await fetch('/api/owner/visitors', { headers: authHeaders() });
    if (!res.ok) return [];
    const d = await res.json();
    return d.visitors || [];
  } catch { return []; }
}
async function fetchBookingRequests() {
  try {
    const res = await fetch('/api/owner/booking-requests', { headers: authHeaders() });
    if (!res.ok) return [];
    const d = await res.json();
    return d.requests || [];
  } catch { return []; }
}

const VisitorLogUI = {
  async markDone(id) {
    try {
      await fetch(`/api/owner/booking-requests/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify({ status: 'done' }) });
      App.go('visitorlog');
    } catch { App.toast('Could not update — check connection'); }
  }
};
