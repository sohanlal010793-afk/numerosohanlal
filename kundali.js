// ════════════════════════════════════════════════════════════════════════════
// UI — COMPARE PAGE (adaptive grid)
// ════════════════════════════════════════════════════════════════════════════

async function renderComparePage(preselectedId = null) {
  const persons = await DB.getAll();
  const groups = await Groups.getAll();
  return `
    <div class="compare-page">
      <div class="compare-header"><h2>Comparison Builder</h2></div>
      <div class="compare-setup">
        <div class="setup-left">
          <div class="form-group"><label>Comparison Name</label><input id="cmp-name" type="text" placeholder="e.g. IPL 2025 – Team India" /></div>
          <div class="form-group">
            <label>Type</label>
            <select id="cmp-type">
              <option value="individual">Individual</option>
              <option value="cricket">Cricket (up to 22)</option>
              <option value="football">Football (up to 22)</option>
              <option value="election">Election Parties (3–5)</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <div class="form-group"><label>Year context</label><input id="cmp-year" type="number" value="${new Date().getFullYear()}" min="1900" max="2100" /></div>
        </div>
        <div class="setup-right">
          <h3>Select Persons</h3>
          <div class="cmp-search-bar"><input id="cmp-search" type="text" placeholder="Search by name, team, party…" oninput="App.filterCmpPersons(this.value)" /></div>
          <div class="cmp-person-list" id="cmp-person-list">
            ${persons.map(p => `
              <label class="cmp-person-item">
                <input type="checkbox" value="${p.id}" class="cmp-checkbox" ${preselectedId === p.id ? 'checked' : ''} onchange="App.updateCmpSelection()" />
                ${avatarHtml(p, 'xs')}
                <span class="cpi-name">${p.name}</span>
                <span class="cpi-dob">${p.dob || '–'}</span>
                <span class="cpi-team">${getCurrentYearTeam(p)}</span>
                ${p.verified ? '<span class="cpi-v">✔</span>' : ''}
              </label>`).join('')}
          </div>
          <div class="cmp-selected-info" id="cmp-selected-info">0 selected</div>
        </div>
      </div>
      <div class="compare-actions">
        <button class="btn-secondary" onclick="App.saveGroup()">💾 Save Group</button>
        <button class="btn-primary" onclick="App.runComparison()">▶ Compare</button>
      </div>
      <div id="comparison-result"></div>
      ${groups.length ? `
      <div class="saved-groups-section">
        <h3>Load Saved Group</h3>
        <div class="saved-groups-list">
          ${groups.map(g => `
            <div class="sg-item">
              <span class="sg-name">${g.name}</span><span class="sg-type">${g.type}</span>
              <span class="sg-count">${(g.personIds || []).length} members</span>
              <button class="btn-sm" onclick="App.loadGroup('${g.id}')">Load</button>
              <button class="btn-icon" onclick="App.deleteGroup('${g.id}')">✕</button>
            </div>`).join('')}
        </div>
      </div>` : ''}
    </div>`;
}

// Roles that get auto-promoted to "live" tier in adaptive grid
const LIVE_ROLE_KEYWORDS = ['captain', 'keeper', 'batsman', 'bowler', 'striker', 'opener'];

function autoSuggestLiveIds(persons, year) {
  // Score each person by role keyword match; take top 6
  const scored = persons.map(p => {
    const teams = DB.getTeamForYear(p, year);
    const roleText = teams.map(t => (t.role || '').toLowerCase()).join(' ');
    const score = LIVE_ROLE_KEYWORDS.reduce((s, kw) => s + (roleText.includes(kw) ? 1 : 0), 0);
    return { id: p.id, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.filter(s => s.score > 0).slice(0, 6).map(s => s.id);
}

// Adaptive grid sizing: more persons → smaller tiles; "live" tier always bigger
function gridSizeClassFor(count) {
  if (count <= 2) return 'gs-xl';
  if (count <= 4) return 'gs-lg';
  if (count <= 6) return 'gs-md';
  if (count <= 11) return 'gs-sm';
  if (count <= 16) return 'gs-xs';
  return 'gs-tiny';
}

function renderComparisonGrid(persons, refDate, year, liveIds = []) {
  if (!persons.length) return '';
  const now = refDate || new Date();
  year = year || now.getFullYear();
  const sizeClass = gridSizeClassFor(persons.length);
  const liveSet = new Set(liveIds.length ? liveIds : autoSuggestLiveIds(persons, year));

  const liveP = persons.filter(p => liveSet.has(p.id));
  const restP = persons.filter(p => !liveSet.has(p.id));

  let html = `<div class="cmp-result" data-year="${year}">
    <div class="cmp-result-header">
      <h3>Comparison — ${persons.length} ${persons.length === 1 ? 'Person' : 'Persons'} <span class="hint">(${year})</span></h3>
      <div class="cmp-date-pick">
        <label>Date</label><input type="date" id="cmp-ref-date" value="${now.toISOString().slice(0,10)}" onchange="App.updateRefDate(this.value)" />
        <label>Time</label><input type="time" id="cmp-ref-time" value="${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}" onchange="App.updateRefDate(document.getElementById('cmp-ref-date').value)" />
      </div>
    </div>

    ${liveP.length ? `<div class="cmp-live-label">🔴 Live (${liveP.length}) — click any tile to promote/demote</div>` : ''}
    <div class="cmp-grid cmp-grid-live ${sizeClass}">
      ${liveP.map(p => renderCmpTile(p, now, year, true)).join('')}
    </div>

    ${restP.length ? `<div class="cmp-rest-label">Squad (${restP.length})</div>` : ''}
    <div class="cmp-grid cmp-grid-rest gs-tiny">
      ${restP.map(p => renderCmpTile(p, now, year, false)).join('')}
    </div>
  </div>`;
  return html;
}

function renderCmpTile(p, refDate, year, isLive) {
  const k = calcKundali(p.dob);
  const snap = k ? getFullDashaSnapshot(k, p.dob, refDate) : null;
  const teams = getCurrentYearTeam(p, year);

  return `
    <div class="cmp-tile ${isLive ? 'tile-live' : 'tile-small'}" data-id="${p.id}" onclick="App.toggleLiveTile('${p.id}')">
      <div class="cmp-tile-photo">${avatarHtml(p, isLive ? 'lg' : 'xs')}</div>
      <div class="cmp-tile-name">${p.name}${p.verified ? ' <span class="cpi-v">✔</span>' : ''}</div>
      ${isLive ? `<div class="cmp-tile-team">${teams}</div>` : ''}
      ${isLive && k ? `<div class="cmp-tile-kundali">${renderKundaliGrid(k, { size: 'compact', noLegend: true })}</div>` : ''}
      ${isLive && snap ? `<div class="cmp-tile-dasha">${renderDashaSnapshot(snap, { size: 'compact' })}</div>` : ''}
      ${!isLive && k ? `<div class="cmp-tile-mini-nums"><span class="b-badge">${k.basic}</span><span class="d-badge">${k.destiny}</span></div>` : ''}
    </div>`;
}
