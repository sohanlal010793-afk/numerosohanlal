// ════════════════════════════════════════════════════════════════════════════
// UI — HELPERS & DASHBOARD
// ════════════════════════════════════════════════════════════════════════════

function getAge(dob) {
  const p = parseDOB(dob);
  if (!p) return '–';
  const today = new Date();
  let age = today.getFullYear() - p.year;
  const hasHadBirthday = (today.getMonth() + 1 > p.month) || ((today.getMonth() + 1 === p.month) && today.getDate() >= p.day);
  if (!hasHadBirthday) age--;
  return age;
}

function getCurrentYearTeam(person, year) {
  year = year || new Date().getFullYear();
  const teams = DB.getTeamForYear(person, year);
  if (!teams || !teams.length) return person.party || person.occupation || '–';
  return teams.map(t => t.team + (t.league ? ` (${t.league})` : '')).join(', ');
}

function verifiedBadge(p) {
  return p.verified ? `<span class="badge-verified">✔ Verified</span>` : `<span class="badge-unverified">? Unverified</span>`;
}

function availableYears(person) {
  return Object.keys(person.teamsByYear || {}).map(Number).sort((a, b) => b - a);
}

// ── DASHBOARD ──────────────────────────────────────────────────────────────────
async function renderDashboard() {
  const persons = await DB.getAll();
  const groups = await Groups.getAll();
  const matches = await Matches.getAll();
  const verified = persons.filter(p => p.verified).length;
  const dups = DB.findDuplicates(persons);

  return `
    <div class="dashboard">
      <div class="dash-hero">
        <div class="dash-hero-text">
          <h1>KundaliGrid</h1>
          <p class="dash-sub">Offline numerology comparison — individuals, teams &amp; parties</p>
        </div>
        <div class="dash-stats">
          <div class="stat-card"><span class="stat-num">${persons.length}</span><span class="stat-lbl">Persons</span></div>
          <div class="stat-card"><span class="stat-num">${groups.length}</span><span class="stat-lbl">Groups</span></div>
          <div class="stat-card verified-stat"><span class="stat-num">${verified}</span><span class="stat-lbl">Verified</span></div>
          <div class="stat-card"><span class="stat-num">${matches.length}</span><span class="stat-lbl">Matches</span></div>
        </div>
      </div>

      ${dups.length ? `
      <div class="dup-alert">
        <span class="dup-icon">⚠</span><span>${dups.length} duplicate group${dups.length > 1 ? 's' : ''} found.</span>
        <button class="btn-sm" onclick="App.go('database'); setTimeout(()=>App.showDuplicates(),100)">Review →</button>
      </div>` : ''}

      <div class="dash-quick">
        <h2 class="section-title">Quick Actions</h2>
        <div class="quick-btns">
          <button class="qbtn" onclick="App.go('add')">＋ Add Person</button>
          <button class="qbtn" onclick="App.go('compare')">⊕ Compare</button>
          <button class="qbtn" onclick="App.go('match')">🎯 Predictions</button>
          <button class="qbtn" onclick="App.go('database')">☰ Database</button>
        </div>
      </div>

      ${groups.length ? `
      <div class="dash-groups">
        <h2 class="section-title">Saved Groups</h2>
        <div class="group-cards">
          ${groups.slice(-6).reverse().map(g => `
            <div class="group-card" onclick="App.openGroup('${g.id}')">
              <div class="gc-type">${g.type}</div><div class="gc-name">${g.name}</div>
              <div class="gc-count">${(g.personIds || []).length} members</div>
            </div>`).join('')}
        </div>
      </div>` : ''}

      ${persons.length ? `
      <div class="dash-recent">
        <h2 class="section-title">Recently Added</h2>
        <div class="person-cards">${persons.slice(-6).reverse().map(p => renderPersonMiniCard(p)).join('')}</div>
      </div>` : `
      <div class="dash-empty">
        <div class="empty-icon">☸</div><p>No persons yet.</p>
        <button class="btn-primary" onclick="App.go('add')">Add Person</button>
      </div>`}
    </div>`;
}

function renderPersonMiniCard(p) {
  const k = calcKundali(p.dob);
  return `
    <div class="mini-card" onclick="App.openPerson('${p.id}')">
      <div class="mc-avatar">${avatarHtml(p, 'sm')}</div>
      <div class="mc-body">
        <div class="mc-top">${verifiedBadge(p)}</div>
        <div class="mc-name">${p.name}</div>
        <div class="mc-dob">${p.dob || '–'}</div>
        <div class="mc-team">${getCurrentYearTeam(p)}</div>
        ${k ? `<div class="mc-nums"><span class="b-badge">B:${k.basic}</span><span class="d-badge">D:${k.destiny}</span></div>` : ''}
      </div>
    </div>`;
}
