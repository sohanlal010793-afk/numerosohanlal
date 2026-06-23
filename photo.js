// ════════════════════════════════════════════════════════════════════════════
// UI — PERSON DETAIL VIEW (with full dasha drill-down)
// ════════════════════════════════════════════════════════════════════════════

function renderPersonView(person) {
  const k = calcKundali(person.dob);
  const now = new Date();

  return `
    <div class="person-view">
      <div class="pv-header">
        <div class="pv-avatar-col">${avatarHtml(person, 'lg')}</div>
        <div class="pv-info">
          <div class="pv-name-row"><h2>${person.name}</h2>${verifiedBadge(person)}</div>
          <div class="pv-meta">
            <span>DOB: <strong>${person.dob}</strong></span>
            ${person.timeOfBirth ? `<span>⏰ ${person.timeOfBirth}</span>` : ''}
            ${person.placeOfBirth ? `<span>📍 ${person.placeOfBirth}</span>` : ''}
            ${person.occupation ? `<span>💼 ${person.occupation}</span>` : ''}
            ${person.jerseyNumber ? `<span>#${person.jerseyNumber}</span>` : ''}
            ${person.party ? `<span>🏛 ${person.party}</span>` : ''}
            <span>Age: <strong>${getAge(person.dob)}</strong></span>
          </div>
          ${renderYearTeamPills(person)}
          ${person.notes ? `<div class="pv-notes">${person.notes}</div>` : ''}
        </div>
        <div class="pv-actions">
          <button class="btn-sm" onclick="App.editPerson('${person.id}')">✏ Edit</button>
          <button class="btn-verify ${person.verified ? 'verified' : ''}" onclick="App.toggleVerify('${person.id}', true)">
            ${person.verified ? '✔ Verified' : '? Verify'}
          </button>
          <button class="btn-danger-sm" onclick="App.deletePerson('${person.id}')">🗑</button>
        </div>
      </div>

      <div class="pv-body">
        <div class="pv-kundali-section">
          <h3>Kundali Chart</h3>
          ${k ? renderKundaliGrid(k) : '<p>Invalid DOB</p>'}
          ${k ? `
          <div class="num-breakdown">
            <div class="nb-row"><span class="nb-label">Digits:</span><span class="nb-val">${k.gridDigits.join(', ')}</span></div>
            <div class="nb-row"><span class="nb-label">Basic:</span><span class="nb-val highlight-basic-text">${k.basic} — ${getNumMeaning(k.basic)}</span></div>
            <div class="nb-row"><span class="nb-label">Destiny:</span><span class="nb-val highlight-destiny-text">${k.destiny} — ${getNumMeaning(k.destiny)}</span></div>
          </div>` : ''}
          <button class="btn-sm" style="margin-top:10px" onclick="App.showChaldean('${(person.name||'').replace(/'/g,"\\'")}')">Name Numerology (optional)</button>
          <div id="chaldean-result"></div>
        </div>

        <div class="pv-dasha-section">
          <h3>Dasha Explorer</h3>
          <div class="dasha-date-picker">
            <label>Date</label>
            <input type="date" id="pv-dasha-date" value="${now.toISOString().slice(0,10)}" onchange="App.refreshPersonDasha('${person.id}')" />
            <label>Time</label>
            <input type="time" id="pv-dasha-time" value="${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}" onchange="App.refreshPersonDasha('${person.id}')" />
            <button class="btn-sm" onclick="App.setDashaNow('${person.id}')">Now</button>
          </div>
          <div id="pv-dasha-explorer">
            ${k ? renderDashaExplorer(person, k, now) : ''}
          </div>
        </div>
      </div>
    </div>`;
}

function renderYearTeamPills(person) {
  const tby = person.teamsByYear || {};
  const years = Object.keys(tby).sort((a, b) => b - a);
  if (!years.length) return '';
  return `<div class="pv-teams">
    ${years.map(y => (tby[y] || []).map(t =>
      `<span class="team-tag">${y}: ${t.team}${t.league ? ' · ' + t.league : ''}${t.role ? ' · ' + t.role : ''}</span>`
    ).join('')).join('')}
  </div>`;
}

// ── DASHA EXPLORER (drill-down: Maha → Antar → Pratyantar → Daily → Hourly → Minute) ──
function renderDashaExplorer(person, kundali, atDate) {
  const snap = getFullDashaSnapshot(kundali, person.dob, atDate);
  if (!snap) return '<p class="hint">Date is before birth — no dasha available.</p>';
  const evalRes = evaluateFullSnapshot(kundali, snap);

  let html = `<div class="dasha-explorer" data-person="${person.id}">`;

  // MAHA row (always shown, clickable to expand antars)
  html += renderDashaLevelRow('maha', snap.maha, evalRes.maha, person, kundali, atDate, true);
  html += `<div class="dasha-children" id="dx-antar-${person.id}">`;
  html += renderDashaLevelRow('antar', snap.antar, evalRes.antar, person, kundali, atDate, true);
  html += `<div class="dasha-children" id="dx-praty-${person.id}">`;
  html += renderDashaLevelRow('praty', snap.praty, evalRes.praty, person, kundali, atDate, true);
  html += `<div class="dasha-children" id="dx-daily-${person.id}">`;
  html += renderDashaLevelRow('daily', snap.daily, evalRes.daily, person, kundali, atDate, true);
  html += `<div class="dasha-children" id="dx-hourly-${person.id}">`;
  html += renderDashaLevelRow('hourly', snap.hourly, evalRes.hourly, person, kundali, atDate, true);
  html += `<div class="dasha-children" id="dx-minute-${person.id}">`;
  html += renderDashaLevelRow('minute', snap.minute, evalRes.minute, person, kundali, atDate, false);
  html += `</div></div></div></div></div>`;

  html += '</div>';
  return html;
}

function renderDashaLevelRow(level, data, evalItem, person, kundali, atDate, expandable) {
  if (!data) return '<div class="dasha-level-row hint">–</div>';
  const labels = { maha: 'Mahadasha', antar: 'Antardasha', praty: 'Pratyantardasha', daily: 'Daily Dasha', hourly: 'Hourly Dasha', minute: 'Minute Dasha' };
  let rangeLabel = '';
  if (data.start && data.end) rangeLabel = `${formatShortDate(data.start)} → ${formatShortDate(data.end)}`;
  if (level === 'daily') rangeLabel = formatShortDate(data.date);
  if (level === 'hourly') rangeLabel = `${String(data.h24).padStart(2,'0')}:00`;
  if (level === 'minute') rangeLabel = `min ${data.minute}`;

  return `
    <div class="dasha-level-row level-${level}">
      <div class="dlr-label">${labels[level]}</div>
      <div class="dasha-num-badge num-${data.num}">${data.num}</div>
      <div class="dlr-range">${rangeLabel}</div>
      ${evalItem ? renderVerdictBadge(evalItem) : ''}
    </div>`;
}

// Refresh whole explorer when date/time changes
function refreshDashaExplorerHtml(person, kundali, atDate) {
  return renderDashaExplorer(person, kundali, atDate);
}
