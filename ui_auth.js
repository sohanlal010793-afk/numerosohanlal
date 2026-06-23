// ════════════════════════════════════════════════════════════════════════════
// UI — PREDICTION / MATCH PAGE
// ════════════════════════════════════════════════════════════════════════════

async function renderMatchPage() {
  const matches = await Matches.getAll();
  const persons = await DB.getAll();

  return `
    <div class="match-page">
      <div class="match-header"><h2>🎯 Predictions</h2><p class="bulk-sub">Set up a match/event window and see which dasha levels matter for that duration.</p></div>

      <div class="match-form-card">
        <h3>New Match / Event</h3>
        <div class="match-form-grid">
          <div class="form-group"><label>Title</label><input id="mf-title" type="text" placeholder="e.g. India vs Australia, Final" /></div>
          <div class="form-group"><label>Venue</label><input id="mf-venue" type="text" placeholder="e.g. MCG, Melbourne" /></div>
          <div class="form-group"><label>Start Date</label><input id="mf-start-date" type="date" /></div>
          <div class="form-group"><label>Start Time</label><input id="mf-start-time" type="time" /></div>
          <div class="form-group"><label>End Date</label><input id="mf-end-date" type="date" /></div>
          <div class="form-group"><label>End Time</label><input id="mf-end-time" type="time" /></div>
        </div>
        <div class="form-group"><label>Notes / Schedule paste</label><textarea id="mf-notes" rows="3" placeholder="Paste schedule text, squad list, or any notes…"></textarea></div>

        <div class="match-squad-picker">
          <label>Squad (select persons)</label>
          <div class="cmp-search-bar"><input id="mf-search" type="text" placeholder="Search persons…" oninput="App.filterMatchPersons(this.value)" /></div>
          <div class="cmp-person-list" id="mf-person-list">
            ${persons.map(p => `
              <label class="cmp-person-item">
                <input type="checkbox" value="${p.id}" class="mf-checkbox" />
                ${avatarHtml(p, 'xs')}<span class="cpi-name">${p.name}</span><span class="cpi-team">${getCurrentYearTeam(p)}</span>
              </label>`).join('')}
          </div>
        </div>

        <div class="form-actions"><button class="btn-primary" onclick="App.saveMatch()">💾 Save Match</button></div>
      </div>

      <div id="match-result"></div>

      ${matches.length ? `
      <div class="saved-matches-section">
        <h3>Saved Matches</h3>
        <div class="saved-matches-list">
          ${matches.slice().reverse().map(m => `
            <div class="match-card">
              <div class="mc-title">${m.title}</div>
              <div class="mc-venue">${m.venue || ''}</div>
              <div class="mc-dates">${m.startDate} ${m.startTime || ''} → ${m.endDate} ${m.endTime || ''}</div>
              <div class="mc-squad">${(m.personIds || []).length} players</div>
              <div class="mc-actions">
                <button class="btn-sm" onclick="App.viewMatch('${m.id}')">View Predictions</button>
                <button class="btn-icon" onclick="App.deleteMatch('${m.id}')">✕</button>
              </div>
            </div>`).join('')}
        </div>
      </div>` : ''}
    </div>`;
}

// Render the match prediction view: for the match duration, show only relevant dasha levels
async function renderMatchPrediction(match) {
  const allPersons = await DB.getAll();
  const idSet = new Set(match.personIds || []);
  const persons = allPersons.filter(p => idSet.has(p.id));
  if (!persons.length) return '<p class="hint">No squad selected for this match.</p>';

  const start = new Date(`${match.startDate}T${match.startTime || '00:00'}`);
  const end = new Date(`${match.endDate || match.startDate}T${match.endTime || '23:59'}`);
  const durationMs = end - start;
  const durationHours = durationMs / 3600000;

  // Decide which levels matter: short match (<24h) -> hourly/minute focus; multi-day -> daily; long (>30d) -> antar/maha
  let focusLevels = ['daily', 'hourly'];
  if (durationHours <= 6) focusLevels = ['hourly', 'minute'];
  else if (durationHours <= 24) focusLevels = ['daily', 'hourly'];
  else if (durationHours <= 24 * 30) focusLevels = ['praty', 'daily'];
  else focusLevels = ['antar', 'praty'];

  let html = `<div class="match-prediction">
    <div class="mp-header">
      <h3>${match.title}</h3>
      <div class="mp-meta">${match.venue || ''} · ${formatShortDate(start)} ${match.startTime||''} → ${formatShortDate(end)} ${match.endTime||''}</div>
      <div class="mp-focus">Focused dasha levels for this duration: ${focusLevels.map(l => `<span class="focus-tag">${l}</span>`).join('')}</div>
    </div>
    <div class="mp-grid">`;

  persons.forEach(p => {
    const k = calcKundali(p.dob);
    if (!k) return;
    const snap = getFullDashaSnapshot(k, p.dob, start);
    const evalRes = evaluateFullSnapshot(k, snap);
    const score = overallScore(Object.fromEntries(focusLevels.map(l => [l, evalRes[l]])));

    html += `
      <div class="mp-card">
        <div class="mp-card-head">${avatarHtml(p, 'sm')}<span class="mp-name">${p.name}</span></div>
        <div class="mp-score score-${score > 0 ? 'pos' : score < 0 ? 'neg' : 'neu'}">${score > 0 ? '+' : ''}${score}</div>
        <div class="mp-levels">
          ${focusLevels.map(l => `
            <div class="mp-level-row">
              <span class="mp-level-label">${l}</span>
              <span class="dasha-num-badge num-${snap[l]?.num}">${snap[l]?.num ?? '–'}</span>
              ${renderVerdictBadge(evalRes[l])}
            </div>`).join('')}
        </div>
      </div>`;
  });

  html += '</div></div>';
  return html;
}
