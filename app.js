// ════════════════════════════════════════════════════════════════════════════
// UI — ADD / EDIT PERSON FORM
// ════════════════════════════════════════════════════════════════════════════

function renderAddForm(person = null) {
  const edit = !!person;
  const p = person || {};
  const isVerified = p.verified || false;
  const teamsByYear = p.teamsByYear || {};
  const years = Object.keys(teamsByYear).map(Number).sort((a, b) => b - a);
  const currentYear = new Date().getFullYear();
  const yearsToShow = years.length ? years : [currentYear];

  return `
    <div class="form-page">
      <div class="form-header">
        <h2>${edit ? 'Edit Person' : 'Add New Person'}</h2>
        <div class="form-header-actions">
          ${edit ? `
            <button class="btn-verify ${isVerified ? 'verified' : ''}" onclick="App.toggleVerify('${p.id}', false, true)">
              ${isVerified ? '✔ Verified' : '? Mark Verified'}
            </button>
            <button class="btn-danger-sm" onclick="App.deletePerson('${p.id}')">🗑 Delete</button>
          ` : ''}
        </div>
      </div>

      ${isVerified ? `<div class="verified-notice"><span>✔ Verified record</span><span class="vn-sub">Editing keeps it verified.</span></div>` : ''}

      <form id="person-form" class="person-form" onsubmit="App.savePerson(event, '${p.id || ''}')">

        <div class="form-photo-row">
          <div class="photo-upload-area" id="photo-area" onclick="document.getElementById('photo-file-input').click()">
            ${p.photo
              ? `<img id="photo-preview-img" src="${p.photo}" class="photo-preview-img" />`
              : `<div id="photo-placeholder" class="photo-placeholder"><span class="photo-icon">📷</span><span>Add Photo</span><span class="hint" style="margin-top:2px">optional</span></div>`
            }
            <input type="file" id="photo-file-input" accept="image/*" style="display:none" onchange="App.handlePhotoSelect(this)" />
          </div>
          <input type="hidden" name="photo" id="photo-hidden" value="${p.photo || ''}" />
          ${p.photo ? `<button type="button" class="btn-remove-photo" onclick="App.removePhoto()">✕ Remove Photo</button>` : ''}
        </div>

        <div class="form-grid">
          <div class="form-group span2">
            <label>Full Name *</label>
            <input name="name" type="text" value="${p.name || ''}" required placeholder="e.g. Virat Kohli" />
          </div>
          <div class="form-group">
            <label>Date of Birth * <span class="hint">DD/MM/YYYY</span></label>
            <input name="dob" type="text" value="${p.dob || ''}" required placeholder="15/11/1988"
              pattern="\\d{2}/\\d{2}/\\d{4}" oninput="App.previewKundali(this.value)" />
          </div>
          <div class="form-group">
            <label>Time of Birth <span class="hint">optional</span></label>
            <input name="timeOfBirth" type="time" value="${p.timeOfBirth || ''}" />
          </div>
          <div class="form-group">
            <label>Place of Birth</label>
            <input name="placeOfBirth" type="text" value="${p.placeOfBirth || ''}" placeholder="e.g. Ranchi, India" />
          </div>
          <div class="form-group">
            <label>Occupation / Role</label>
            <input name="occupation" type="text" value="${p.occupation || ''}" placeholder="e.g. Cricketer" />
          </div>
          <div class="form-group">
            <label>Jersey Number <span class="hint">optional</span></label>
            <input name="jerseyNumber" type="text" value="${p.jerseyNumber || ''}" placeholder="e.g. 18" />
          </div>
          <div class="form-group">
            <label>Party / Affiliation</label>
            <input name="party" type="text" value="${p.party || ''}" placeholder="e.g. BJP, Congress…" />
          </div>
          <div class="form-group span2">
            <label>Notes <span class="hint">one page max</span></label>
            <textarea name="notes" rows="3" placeholder="Additional info, career highlights, etc.">${p.notes || ''}</textarea>
          </div>
        </div>

        <!-- YEAR-BASED TEAM TRACKING -->
        <div class="teams-section">
          <div class="teams-header">
            <h3>Teams by Year <span class="hint">league/team changes year to year</span></h3>
            <button type="button" class="btn-sm" onclick="App.addYearBlock()">+ Add Year</button>
          </div>
          <div id="years-container">
            ${yearsToShow.map(y => renderYearBlock(y, teamsByYear[y] || [{ team: '', league: '', role: '' }])).join('')}
          </div>
        </div>

        <div class="preview-section">
          <h3>Kundali Preview</h3>
          <div id="kundali-preview" class="kundali-preview-box">
            ${p.dob ? (() => { const k = calcKundali(p.dob); return k ? renderKundaliGrid(k) : '<p class="hint">Enter DOB to preview</p>'; })() : '<p class="hint">Enter DOB to preview</p>'}
          </div>
        </div>

        <!-- OPTIONAL: Chaldean name numerology — only calculated if you ask for it -->
        <div class="preview-section">
          <div class="chaldean-toggle-row">
            <h3 style="margin-bottom:0">Name Numerology <span class="hint">(Chaldean — optional)</span></h3>
            <button type="button" class="btn-sm" onclick="App.showChaldean(document.querySelector('[name=name]').value)">Calculate</button>
          </div>
          <div id="chaldean-result">${p.name ? '' : '<p class="hint">Click Calculate if you want this — not required.</p>'}</div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-secondary" onclick="App.go('database')">Cancel</button>
          <button type="submit" class="btn-primary">${edit ? 'Save Changes' : 'Add Person'}</button>
        </div>
      </form>
    </div>`;
}

function renderYearBlock(year, teamRows) {
  return `
    <div class="year-block" data-year="${year}">
      <div class="year-block-header">
        <input type="number" class="year-input" value="${year}" min="1900" max="2100" />
        <button type="button" class="btn-icon" onclick="App.addTeamRowToYear(this)">+ team</button>
        <button type="button" class="btn-icon" onclick="this.closest('.year-block').remove()">✕ year</button>
      </div>
      <div class="year-team-rows">
        ${teamRows.map(t => renderTeamRowInYear(t)).join('')}
      </div>
    </div>`;
}

function renderTeamRowInYear(t = {}) {
  return `
    <div class="team-row-y">
      <input type="text" class="ty-team" placeholder="Team name" value="${t.team || ''}" />
      <input type="text" class="ty-league" placeholder="League" value="${t.league || ''}" />
      <input type="text" class="ty-role" placeholder="Role (capt/batsman/bowler…)" value="${t.role || ''}" />
      <button type="button" class="btn-icon" onclick="this.closest('.team-row-y').remove()">✕</button>
    </div>`;
}
