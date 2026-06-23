// ════════════════════════════════════════════════════════════════════════════
// UI — DATABASE PAGE (bulk delete/verify/edit, duplicate detection)
// ════════════════════════════════════════════════════════════════════════════

async function renderDatabasePage() {
  const persons = await DB.getAll();
  const dups = DB.findDuplicates(persons);
  const verified = persons.filter(p => p.verified).length;
  const unverified = persons.length - verified;

  return `
    <div class="database-page">
      <div class="db-topbar">
        <div class="db-topbar-left">
          <h2>Database <span class="count-badge">${persons.length}</span></h2>
          <span class="db-stat-pill verified-pill">✔ ${verified} verified</span>
          <span class="db-stat-pill unverified-pill">? ${unverified} unverified</span>
        </div>
        <div class="db-topbar-right">
          <button class="btn-primary" onclick="App.go('add')">＋ Add</button>
        </div>
      </div>

      <div class="bulk-toolbar">
        <div class="bt-left">
          <label class="bt-sel-all"><input type="checkbox" id="sel-all-cb" onchange="App.toggleSelectAll(this.checked)" /><span>Select all</span></label>
          <span class="bt-count" id="bulk-sel-count">0 selected</span>
        </div>
        <div class="bt-actions">
          <button class="bt-btn bt-verify" onclick="App.bulkVerify()">✔ Verify</button>
          <button class="bt-btn bt-unverify" onclick="App.bulkUnverify()">? Unverify</button>
          <button class="bt-btn bt-edit" onclick="App.bulkEditFirst()">✏ Edit</button>
          <button class="bt-btn bt-delete" onclick="App.bulkDelete()">🗑 Delete</button>
          <div class="bt-divider"></div>
          <button class="bt-btn bt-clear-all" onclick="App.confirmClearAll()">🗑 Clear All</button>
        </div>
      </div>

      ${dups.length ? `
      <div class="dup-alert"><span class="dup-icon">⚠</span><strong>${dups.length}</strong> duplicate group${dups.length > 1 ? 's' : ''} detected.
        <button class="btn-sm" onclick="App.showDuplicates()">Review</button></div>` : ''}
      <div id="dup-panel" style="display:none"></div>

      <div class="db-filters">
        <input id="db-search" type="text" placeholder="🔍 Name…" oninput="App.applyDbFilter()" />
        <input id="db-f-team" type="text" placeholder="Team…" oninput="App.applyDbFilter()" />
        <input id="db-f-party" type="text" placeholder="Party…" oninput="App.applyDbFilter()" />
        <input id="db-f-occ" type="text" placeholder="Occupation…" oninput="App.applyDbFilter()" />
        <select id="db-f-verified" onchange="App.applyDbFilter()">
          <option value="">All</option><option value="verified">✔ Verified</option><option value="unverified">? Unverified</option>
        </select>
        <select id="db-sort" onchange="App.applyDbFilter()">
          <option value="name">Name ↑</option><option value="dob">DOB</option><option value="basic">Basic #</option>
          <option value="destiny">Destiny #</option><option value="recent">Recent</option>
        </select>
      </div>

      <div id="db-table-wrap">${renderDbTable(persons, 'name')}</div>
    </div>`;
}

function renderDuplicatesPanel(dups) {
  if (!dups.length) return '<p class="hint" style="padding:12px">No duplicates found.</p>';
  return `<div class="dup-panel-inner">
    <h3>Duplicate Records</h3>
    <p class="hint" style="margin-bottom:12px">Same Name + DOB found multiple times. Keep one, delete the rest.</p>
    ${dups.map(g => `
      <div class="dup-group">
        <div class="dup-group-label">⚠ ${g.persons[0]?.name} — ${g.persons[0]?.dob} (${g.persons.length} records)</div>
        <div class="dup-rows">
          ${g.persons.map((p, i) => `
            <div class="dup-row">
              ${avatarHtml(p, 'xs')}
              <span class="dup-idx">#${i + 1}</span><span class="dup-name">${p.name}</span>
              <span class="dup-dob">${p.dob || '–'}</span><span class="dup-team">${getCurrentYearTeam(p)}</span>
              ${verifiedBadge(p)}
              <span class="dup-created">${p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '–'}</span>
              <button class="btn-sm" onclick="App.editPerson('${p.id}')">Edit</button>
              <button class="btn-danger-sm" onclick="App.deleteDup('${p.id}')">Delete</button>
            </div>`).join('')}
        </div>
      </div>`).join('')}
  </div>`;
}

function renderDbTable(persons, sortBy = 'name') {
  if (!persons.length) return '<div class="empty-state">No persons found.</div>';
  const sorted = [...persons].sort((a, b) => {
    switch (sortBy) {
      case 'name': return (a.name || '').localeCompare(b.name || '');
      case 'dob': return (new Date(parseDOB(a.dob)?.year, parseDOB(a.dob)?.month, parseDOB(a.dob)?.day) || 0) - (new Date(parseDOB(b.dob)?.year, parseDOB(b.dob)?.month, parseDOB(b.dob)?.day) || 0);
      case 'basic': { const ak = calcKundali(a.dob), bk = calcKundali(b.dob); return (ak?.basic || 0) - (bk?.basic || 0); }
      case 'destiny': { const ak = calcKundali(a.dob), bk = calcKundali(b.dob); return (ak?.destiny || 0) - (bk?.destiny || 0); }
      case 'recent': return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      default: return 0;
    }
  });

  return `
    <table class="db-table">
      <thead><tr>
        <th style="width:36px"><input type="checkbox" id="sel-all-cb2" onchange="App.toggleSelectAll(this.checked)" /></th>
        <th style="width:44px"></th><th>Name</th><th>DOB</th><th>Age</th>
        <th>Team / Party</th><th>Occupation</th><th>B</th><th>D</th>
        <th style="width:44px">Ver.</th><th style="width:110px">Actions</th>
      </tr></thead>
      <tbody>
        ${sorted.map(p => {
          const k = calcKundali(p.dob);
          return `
          <tr class="db-row ${p.verified ? 'row-verified' : ''}" data-id="${p.id}">
            <td onclick="event.stopPropagation()"><input type="checkbox" class="row-cb" value="${p.id}" onchange="App.onRowCheck()" /></td>
            <td onclick="App.openPerson('${p.id}')" class="td-avatar">${avatarHtml(p, 'xs')}</td>
            <td class="td-name" onclick="App.openPerson('${p.id}')">${p.name}</td>
            <td onclick="App.openPerson('${p.id}')">${p.dob || '–'}</td>
            <td onclick="App.openPerson('${p.id}')">${getAge(p.dob)}</td>
            <td onclick="App.openPerson('${p.id}')">${getCurrentYearTeam(p)}</td>
            <td onclick="App.openPerson('${p.id}')">${p.occupation || '–'}</td>
            <td onclick="App.openPerson('${p.id}')">${k ? `<span class="b-badge">${k.basic}</span>` : '–'}</td>
            <td onclick="App.openPerson('${p.id}')">${k ? `<span class="d-badge">${k.destiny}</span>` : '–'}</td>
            <td onclick="event.stopPropagation()"><button class="btn-verify-sm ${p.verified ? 'verified' : ''}" onclick="App.toggleVerify('${p.id}',true)">${p.verified ? '✔' : '?'}</button></td>
            <td onclick="event.stopPropagation()" class="td-actions">
              <button class="btn-icon" title="Edit" onclick="App.editPerson('${p.id}')">✏</button>
              <button class="btn-icon" title="View" onclick="App.openPerson('${p.id}')">👁</button>
              <button class="btn-icon btn-del" title="Delete" onclick="App.deleteSingle('${p.id}')">🗑</button>
            </td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>`;
}
