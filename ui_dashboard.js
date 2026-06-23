// public/data.js
// ════════════════════════════════════════════════════════════════════════════
// DATA LAYER — talks to the server. Two modes:
//   OWNER MODE  (logged in): local-first cache + syncs to server when online.
//   VISITOR MODE (not logged in): nothing stored locally at all; every read
//     goes straight to the public API, and there is no local persistence.
// ════════════════════════════════════════════════════════════════════════════

const API_BASE = '/api';
const OWNER_TOKEN_KEY = 'kg_owner_token'; // only thing ever stored locally, and only for the owner
const OWNER_CACHE_KEY = 'kg_owner_cache'; // offline-first cache of the owner's own data

const Auth = {
  getToken() { return localStorage.getItem(OWNER_TOKEN_KEY); },
  setToken(t) { localStorage.setItem(OWNER_TOKEN_KEY, t); },
  clearToken() { localStorage.removeItem(OWNER_TOKEN_KEY); localStorage.removeItem(OWNER_CACHE_KEY); },
  isOwner() { return !!this.getToken(); },

  async signup(email, password, name) {
    const res = await fetch(`${API_BASE}/auth/signup`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, name }) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Signup failed');
    this.setToken(data.token);
    return data.owner;
  },
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    this.setToken(data.token);
    return data.owner;
  },
  async whoami() {
    const token = this.getToken();
    if (!token) return null;
    try {
      const res = await fetch(`${API_BASE}/auth/whoami`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) { this.clearToken(); return null; }
      const data = await res.json();
      return data.owner;
    } catch { return null; } // offline — keep token, assume still owner (local cache mode)
  },
  async ownerExists() {
    try {
      const res = await fetch(`${API_BASE}/auth/owner-exists`);
      const data = await res.json();
      return data.exists;
    } catch { return false; }
  },
  logout() { this.clearToken(); }
};

function authHeaders() {
  const t = Auth.getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}
window.authHeaders = authHeaders;

// ── OFFLINE-FIRST CACHE (owner mode only) ──────────────────────────────────────
function readCache() {
  try { return JSON.parse(localStorage.getItem(OWNER_CACHE_KEY)) || { persons: [], groups: [], matches: [] }; }
  catch { return { persons: [], groups: [], matches: [] }; }
}
function writeCache(cache) { localStorage.setItem(OWNER_CACHE_KEY, JSON.stringify(cache)); }

let _isOnline = navigator.onLine;
window.addEventListener('online', () => { _isOnline = true; DB.syncToServer(); });
window.addEventListener('offline', () => { _isOnline = false; });

// ── DB — used only when Auth.isOwner() is true ─────────────────────────────────
const DB = {
  async getAll() {
    if (!Auth.isOwner()) return [];
    if (_isOnline) {
      try {
        const res = await fetch(`${API_BASE}/owner/persons`, { headers: authHeaders() });
        if (res.ok) {
          const data = await res.json();
          const cache = readCache(); cache.persons = data.persons; writeCache(cache);
          return data.persons;
        }
      } catch { /* fall through to cache */ }
    }
    return readCache().persons;
  },

  async add(person) {
    person.id = person.id || ('p_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6));
    person.createdAt = new Date().toISOString();
    person.verified = person.verified || false;
    person.teamsByYear = person.teamsByYear || {};

    const cache = readCache(); cache.persons.push(person); writeCache(cache);

    if (_isOnline) {
      try { await fetch(`${API_BASE}/owner/persons`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(person) }); }
      catch { /* will sync later */ }
    }
    return person;
  },

  async update(id, updates) {
    const cache = readCache();
    const idx = cache.persons.findIndex(p => p.id === id);
    if (idx === -1) return null;
    cache.persons[idx] = { ...cache.persons[idx], ...updates, updatedAt: new Date().toISOString() };
    writeCache(cache);

    if (_isOnline) {
      try { await fetch(`${API_BASE}/owner/persons/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(updates) }); }
      catch { /* will sync later */ }
    }
    return cache.persons[idx];
  },

  async delete(id) {
    const cache = readCache();
    cache.persons = cache.persons.filter(p => p.id !== id);
    writeCache(cache);
    if (_isOnline) {
      try { await fetch(`${API_BASE}/owner/persons/${id}`, { method: 'DELETE', headers: authHeaders() }); }
      catch { /* will sync later */ }
    }
  },

  async deleteMany(ids) {
    const cache = readCache();
    const idSet = new Set(ids);
    cache.persons = cache.persons.filter(p => !idSet.has(p.id));
    writeCache(cache);
    if (_isOnline) {
      try { await fetch(`${API_BASE}/owner/persons/bulk-delete`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify({ ids }) }); }
      catch { /* will sync later */ }
    }
  },

  async getById(id) {
    const all = await this.getAll();
    return all.find(p => p.id === id) || null;
  },

  // Push the full local cache to the server — called on reconnect
  async syncToServer() {
    if (!Auth.isOwner() || !_isOnline) return;
    const cache = readCache();
    try {
      await fetch(`${API_BASE}/owner/persons/sync`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify({ persons: cache.persons }) });
    } catch { /* try again next time */ }
  },

  findDuplicates(persons) {
    const seen = new Map();
    persons.forEach(p => {
      const key = (p.name || '').toLowerCase().trim() + '|' + (p.dob || '').trim();
      if (!seen.has(key)) seen.set(key, []);
      seen.get(key).push(p.id);
    });
    const groups = [];
    seen.forEach((ids) => { if (ids.length > 1) groups.push({ ids, persons: ids.map(id => persons.find(p => p.id === id)).filter(Boolean) }); });
    return groups;
  },

  getTeamForYear(person, year) {
    const tby = person.teamsByYear || {};
    if (tby[year] && tby[year].length) return tby[year];
    const years = Object.keys(tby).map(Number).filter(y => y <= year).sort((a, b) => b - a);
    if (years.length) return tby[years[0]];
    return [];
  },

  search(persons, { name, team, party, occupation, verified } = {}) {
    return persons.filter(p => {
      if (name && !p.name.toLowerCase().includes(name.toLowerCase())) return false;
      if (party && !(p.party || '').toLowerCase().includes(party.toLowerCase())) return false;
      if (occupation && !(p.occupation || '').toLowerCase().includes(occupation.toLowerCase())) return false;
      if (team) {
        const allYears = Object.keys(p.teamsByYear || {});
        const match = allYears.some(y => (p.teamsByYear[y] || []).some(t => t.team.toLowerCase().includes(team.toLowerCase())));
        if (!match) return false;
      }
      if (verified === true && !p.verified) return false;
      if (verified === false && p.verified) return false;
      return true;
    });
  }
};

const Groups = {
  async getAll() {
    if (!Auth.isOwner()) return [];
    if (_isOnline) {
      try { const res = await fetch(`${API_BASE}/owner/groups`, { headers: authHeaders() }); if (res.ok) { const d = await res.json(); const c = readCache(); c.groups = d.groups; writeCache(c); return d.groups; } } catch {}
    }
    return readCache().groups || [];
  },
  async add(group) {
    group.id = group.id || ('g_' + Date.now());
    group.createdAt = new Date().toISOString();
    const cache = readCache(); cache.groups = cache.groups || []; cache.groups.push(group); writeCache(cache);
    if (_isOnline) { try { await fetch(`${API_BASE}/owner/groups`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(group) }); } catch {} }
    return group;
  },
  async delete(id) {
    const cache = readCache(); cache.groups = (cache.groups || []).filter(g => g.id !== id); writeCache(cache);
    if (_isOnline) { try { await fetch(`${API_BASE}/owner/groups/${id}`, { method: 'DELETE', headers: authHeaders() }); } catch {} }
  },
  async getById(id) { const all = await this.getAll(); return all.find(g => g.id === id) || null; }
};

const Matches = {
  async getAll() {
    if (!Auth.isOwner()) return [];
    if (_isOnline) {
      try { const res = await fetch(`${API_BASE}/owner/matches`, { headers: authHeaders() }); if (res.ok) { const d = await res.json(); const c = readCache(); c.matches = d.matches; writeCache(c); return d.matches; } } catch {}
    }
    return readCache().matches || [];
  },
  async add(match) {
    match.id = match.id || ('m_' + Date.now());
    match.createdAt = new Date().toISOString();
    const cache = readCache(); cache.matches = cache.matches || []; cache.matches.push(match); writeCache(cache);
    if (_isOnline) { try { await fetch(`${API_BASE}/owner/matches`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...authHeaders() }, body: JSON.stringify(match) }); } catch {} }
    return match;
  },
  async delete(id) {
    const cache = readCache(); cache.matches = (cache.matches || []).filter(m => m.id !== id); writeCache(cache);
    if (_isOnline) { try { await fetch(`${API_BASE}/owner/matches/${id}`, { method: 'DELETE', headers: authHeaders() }); } catch {} }
  },
  async getById(id) { const all = await this.getAll(); return all.find(m => m.id === id) || null; }
};

// ── VISITOR-MODE: read-only fetch, nothing ever cached locally ────────────────
const VisitorAPI = {
  async getPersons() {
    try { const res = await fetch(`${API_BASE}/public/persons`); const d = await res.json(); return d.persons || []; }
    catch { return []; }
  },
  async logVisit(consentGiven, extra = {}) {
    try {
      await fetch(`${API_BASE}/public/log-visit`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ consentGiven, ...extra }) });
    } catch { /* visitor offline or blocked — fine, just skip */ }
  },
  async bookSession(payload) {
    const res = await fetch(`${API_BASE}/public/book-session`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Could not submit request');
    return data;
  },
  async getContactInfo() {
    try { const res = await fetch(`${API_BASE}/public/contact-info`); return await res.json(); }
    catch { return { name: '', email: '', phone: '' }; }
  }
};
