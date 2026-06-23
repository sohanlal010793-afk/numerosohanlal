// public/ui_visitor.js
// ════════════════════════════════════════════════════════════════════════════
// UI — VISITOR MODE (no login, no local storage, consent-gated logging)
// ════════════════════════════════════════════════════════════════════════════

function renderConsentBanner() {
  return `
    <div class="consent-banner" id="consent-banner">
      <span class="consent-icon">ℹ</span>
      <span class="consent-text">This site can optionally note your approximate location and visit time to help the owner see who's stopping by. Nothing is stored on your device.</span>
      <div class="consent-actions">
        <button class="btn-sm" onclick="VisitorUI.respondConsent(true)">Allow</button>
        <button class="btn-secondary" onclick="VisitorUI.respondConsent(false)">No thanks</button>
      </div>
    </div>`;
}

function renderVisitorBrowse(persons) {
  return `
    <div class="visitor-page">
      <div class="visitor-header">
        <h2>Browse Kundalis</h2>
        <p class="hint">Viewing as a guest — read only. <button class="btn-sm" onclick="App.go('book')">📞 Request a call / session</button></p>
      </div>
      <div class="db-filters">
        <input id="vis-search" type="text" placeholder="🔍 Search name…" oninput="VisitorUI.filter(this.value)" />
      </div>
      <div id="visitor-grid" class="person-cards">
        ${persons.map(p => renderVisitorMiniCard(p)).join('')}
      </div>
    </div>`;
}

function renderVisitorMiniCard(p) {
  const k = calcKundali(p.dob);
  return `
    <div class="mini-card" onclick="VisitorUI.openPerson('${p.id}')">
      <div class="mc-avatar">${avatarHtml(p, 'sm')}</div>
      <div class="mc-body">
        <div class="mc-top">${p.verified ? '<span class="badge-verified">✔ Verified</span>' : ''}</div>
        <div class="mc-name">${p.name}</div>
        <div class="mc-dob">${p.dob || '–'}</div>
        ${k ? `<div class="mc-nums"><span class="b-badge">B:${k.basic}</span><span class="d-badge">D:${k.destiny}</span></div>` : ''}
      </div>
    </div>`;
}

function renderVisitorPersonView(p) {
  const k = calcKundali(p.dob);
  return `
    <div class="person-view">
      <div class="pv-header">
        <div class="pv-avatar-col">${avatarHtml(p, 'lg')}</div>
        <div class="pv-info">
          <div class="pv-name-row"><h2>${p.name}</h2>${p.verified ? '<span class="badge-verified">✔ Verified</span>' : ''}</div>
          <div class="pv-meta">
            <span>DOB: <strong>${p.dob}</strong></span>
            ${p.placeOfBirth ? `<span>📍 ${p.placeOfBirth}</span>` : ''}
            ${p.occupation ? `<span>💼 ${p.occupation}</span>` : ''}
            ${p.jerseyNumber ? `<span>#${p.jerseyNumber}</span>` : ''}
          </div>
        </div>
      </div>
      <div class="pv-body">
        <div class="pv-kundali-section">
          <h3>Kundali Chart</h3>
          ${k ? renderKundaliGrid(k) : '<p>Invalid DOB</p>'}
        </div>
        <div class="pv-dasha-section">
          <h3>Current Dasha</h3>
          ${k ? renderDashaSnapshot(getFullDashaSnapshot(k, p.dob, new Date())) : ''}
        </div>
      </div>
    </div>`;
}

function renderBookingPage() {
  return `
    <div class="booking-page">
      <h2>📞 Request a Call or Session</h2>
      <p class="hint" style="margin-bottom:16px">Fill this in and the owner will get back to you.</p>
      <form id="booking-form" class="person-form" onsubmit="VisitorUI.submitBooking(event)">
        <div class="form-group"><label>Your Name *</label><input name="name" type="text" required /></div>
        <div class="form-group"><label>Contact (email or phone) *</label><input name="contact" type="text" required /></div>
        <div class="form-group"><label>Preferred Time</label><input name="preferredTime" type="text" placeholder="e.g. Weekday evenings" /></div>
        <div class="form-group"><label>Message</label><textarea name="message" rows="3" placeholder="What would you like to discuss?"></textarea></div>
        <div id="booking-result"></div>
        <button class="btn-primary" type="submit">Send Request</button>
      </form>
    </div>`;
}

const VisitorUI = {
  allPersons: [],

  async respondConsent(consent) {
    document.getElementById('consent-banner')?.remove();
    let extra = {};
    if (consent) {
      extra.device = { ua: navigator.userAgent, platform: navigator.platform, screen: `${screen.width}x${screen.height}` };
      // Try browser geolocation (separate permission prompt); fall back gracefully if denied
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => { VisitorAPI.logVisit(true, { ...extra, location: { lat: pos.coords.latitude, lng: pos.coords.longitude }, page: location.pathname }); },
          () => { VisitorAPI.logVisit(true, { ...extra, location: null, page: location.pathname }); },
          { timeout: 4000 }
        );
        return;
      }
    }
    VisitorAPI.logVisit(consent, extra);
  },

  async filter(q) {
    const grid = document.getElementById('visitor-grid');
    if (!grid) return;
    const filtered = this.allPersons.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));
    grid.innerHTML = filtered.map(p => renderVisitorMiniCard(p)).join('');
  },

  openPerson(id) {
    const p = this.allPersons.find(x => x.id === id);
    if (!p) return;
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `<div class="modal-box"><button class="modal-close" onclick="this.closest('.modal-overlay').remove()">✕</button>${renderVisitorPersonView(p)}</div>`;
    document.body.appendChild(modal);
  },

  async submitBooking(e) {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    const resultEl = document.getElementById('booking-result');
    try {
      await VisitorAPI.bookSession({
        name: data.get('name'), contact: data.get('contact'),
        preferredTime: data.get('preferredTime'), message: data.get('message')
      });
      resultEl.innerHTML = `<div class="verified-notice"><span>✔ Request sent! The owner will reach out to you.</span></div>`;
      form.reset();
    } catch (err) {
      resultEl.innerHTML = `<div class="dup-alert"><span class="dup-icon">⚠</span><span>${err.message}</span></div>`;
    }
  }
};
