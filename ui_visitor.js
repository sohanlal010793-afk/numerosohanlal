/* ════════════════════════════════════════════════════════════════════════════
   DESIGN TOKENS
   ════════════════════════════════════════════════════════════════════════════ */
:root {
  --bg: #0e0c14;
  --card: #1a1628;
  --card2: #221d34;
  --border: #2e2848;
  --gold: #c9a84c;
  --gold2: #f0c96e;
  --gold-dim: #8a6e2a;
  --violet: #6b4fa0;
  --violet2: #8b6dc0;
  --teal: #2dd4bf;
  --red: #e05050;
  --text: #e8e0f0;
  --text2: #a09ab8;
  --text3: #6b6485;
  --basic: #f59e0b;
  --destiny: #6366f1;
  --both: #ec4899;
  --v-best: #2dd4bf;
  --v-pos: #4ade80;
  --v-neu: #94a3b8;
  --v-mixed: #f59e0b;
  --v-neg: #f87171;
  --font-display: 'Georgia', 'Times New Roman', serif;
  --font-body: 'Segoe UI', system-ui, sans-serif;
  --r: 8px; --r2: 12px;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background: var(--bg); color: var(--text); font-family: var(--font-body);
  font-size: 14px; line-height: 1.6; min-height: 100vh;
}
body::before {
  content: ''; position: fixed; inset: 0;
  background-image: radial-gradient(ellipse at 20% 10%, rgba(107,79,160,0.12) 0%, transparent 50%),
                     radial-gradient(ellipse at 80% 80%, rgba(201,168,76,0.06) 0%, transparent 40%);
  pointer-events: none; z-index: 0;
}
#app { position: relative; z-index: 1; }

/* ── NAV ─────────────────────────────────────────────────────────────────────── */
.nav { display: flex; align-items: center; gap: 16px; padding: 0 24px; background: rgba(14,12,20,0.95);
  border-bottom: 1px solid var(--border); height: 56px; position: sticky; top: 0; z-index: 100; backdrop-filter: blur(8px); }
.nav-brand { display: flex; align-items: center; gap: 10px; margin-right: 16px; }
.nav-symbol { font-size: 22px; color: var(--gold); filter: drop-shadow(0 0 6px rgba(201,168,76,0.5)); }
.nav-title { font-family: var(--font-display); font-size: 18px; color: var(--gold2); letter-spacing: 0.05em; }
.nav-links { display: flex; gap: 4px; flex-wrap: wrap; }
.nav-btn { background: none; border: none; padding: 6px 14px; border-radius: 6px; color: var(--text2); cursor: pointer; font-size: 13px; transition: all 0.15s; }
.nav-btn:hover { background: var(--card); color: var(--text); }
.nav-btn.active { background: var(--card); color: var(--gold); border-bottom: 2px solid var(--gold); }

.main { min-height: calc(100vh - 56px); }
.page { display: none; padding: 24px; max-width: 1500px; margin: 0 auto; }
.page.active { display: block; }

h1 { font-family: var(--font-display); font-size: 2.2rem; color: var(--gold2); }
h2 { font-size: 1.3rem; color: var(--text); font-weight: 600; margin-bottom: 16px; }
h3 { font-size: 1rem; color: var(--text2); font-weight: 600; margin-bottom: 10px; }
h4 { font-size: 0.85rem; color: var(--text3); font-weight: 600; margin-bottom: 8px; }
.section-title { font-family: var(--font-display); color: var(--gold); font-size: 1.1rem; margin-bottom: 14px; }

/* ── BUTTONS ─────────────────────────────────────────────────────────────────── */
.btn-primary { background: linear-gradient(135deg, var(--gold-dim), var(--gold)); color: #0e0c14; border: none; padding: 9px 20px; border-radius: var(--r); font-weight: 700; font-size: 13px; cursor: pointer; transition: all .15s; }
.btn-primary:hover { filter: brightness(1.15); }
.btn-secondary { background: var(--card2); border: 1px solid var(--border); color: var(--text2); padding: 8px 18px; border-radius: var(--r); font-size: 13px; cursor: pointer; transition: all .15s; }
.btn-secondary:hover { border-color: var(--gold); color: var(--gold); }
.btn-sm { background: var(--card2); border: 1px solid var(--border); color: var(--text2); padding: 5px 12px; border-radius: 6px; font-size: 12px; cursor: pointer; transition: all .15s; }
.btn-sm:hover { border-color: var(--gold); color: var(--gold); }
.btn-danger-sm { background: rgba(224,80,80,.15); border: 1px solid var(--red); color: var(--red); padding: 5px 12px; border-radius: 6px; font-size: 12px; cursor: pointer; }
.btn-danger-sm:hover { background: rgba(224,80,80,.3); }
.btn-icon { background: none; border: none; color: var(--text3); cursor: pointer; font-size: 14px; padding: 4px 6px; border-radius: 4px; transition: all .15s; }
.btn-icon:hover { color: var(--gold); background: var(--card); }
.btn-del:hover { color: var(--red) !important; }

/* ── FORMS ───────────────────────────────────────────────────────────────────── */
.form-page { max-width: 900px; margin: 0 auto; }
.form-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.form-header-actions { display: flex; gap: 8px; align-items: center; }
.person-form { display: flex; flex-direction: column; gap: 24px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 5px; }
.form-group.span2 { grid-column: 1/-1; }
label { font-size: 12px; color: var(--text3); font-weight: 600; text-transform: uppercase; letter-spacing: .05em; }
.hint { font-size: 11px; color: var(--text3); text-transform: none; font-weight: 400; }
input[type="text"], input[type="time"], input[type="date"], input[type="number"], select, textarea {
  background: var(--card); border: 1px solid var(--border); color: var(--text); padding: 9px 12px; border-radius: var(--r); font-size: 13px; transition: border-color .15s; width: 100%; font-family: inherit;
}
textarea { resize: vertical; }
input:focus, select:focus, textarea:focus { outline: none; border-color: var(--gold); }
input::placeholder, textarea::placeholder { color: var(--text3); }
select { cursor: pointer; }

.verified-notice { background: rgba(45,212,191,.1); border: 1px solid var(--teal); border-radius: var(--r); padding: 10px 16px; margin-bottom: 16px; display: flex; gap: 12px; align-items: center; font-size: 13px; color: var(--teal); }
.vn-sub { color: var(--text2); font-size: 12px; }

/* Photo upload */
.form-photo-row { display: flex; align-items: center; gap: 14px; }
.photo-upload-area { width: 96px; height: 96px; border-radius: 50%; border: 2px dashed var(--border); cursor: pointer; display: flex; align-items: center; justify-content: center; overflow: hidden; transition: border-color .15s; background: var(--card); flex-shrink: 0; }
.photo-upload-area:hover { border-color: var(--gold); }
.photo-placeholder { display: flex; flex-direction: column; align-items: center; gap: 3px; color: var(--text3); font-size: 11px; }
.photo-icon { font-size: 22px; }
.photo-preview-img { width: 100%; height: 100%; object-fit: cover; }
.btn-remove-photo { background: rgba(224,80,80,.1); border: 1px solid var(--red); color: var(--red); padding: 6px 14px; border-radius: 6px; font-size: 12px; cursor: pointer; }

/* Year/team blocks */
.teams-section { background: var(--card); border: 1px solid var(--border); border-radius: var(--r2); padding: 16px; }
.teams-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.year-block { background: var(--card2); border: 1px solid var(--border); border-radius: var(--r); padding: 10px 14px; margin-bottom: 10px; }
.year-block-header { display: flex; gap: 8px; align-items: center; margin-bottom: 8px; }
.year-input { width: 90px; font-weight: 700; color: var(--gold2); }
.year-team-rows { display: flex; flex-direction: column; gap: 6px; }
.team-row-y { display: flex; gap: 6px; }
.team-row-y input { flex: 1; }

.preview-section { background: var(--card); border: 1px solid var(--border); border-radius: var(--r2); padding: 16px; }
.kundali-preview-box { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; }
.form-actions { display: flex; gap: 12px; justify-content: flex-end; padding-top: 8px; }

/* ── KUNDALI GRID ────────────────────────────────────────────────────────────── */
.kundali-grid { display: inline-grid; grid-template-rows: repeat(3, 80px); gap: 3px; background: var(--border); border: 2px solid var(--border); border-radius: 6px; overflow: hidden; }
.kundali-grid.compact { grid-template-rows: repeat(3, 50px); }
.kundali-grid.tiny { grid-template-rows: repeat(3, 28px); }
.kundali-grid.large { grid-template-rows: repeat(3, 110px); }
.kundali-row { display: contents; }
.kundali-cell { width: 80px; height: 80px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: var(--card); position: relative; transition: background .15s; }
.kundali-grid.compact .kundali-cell { width: 50px; height: 50px; }
.kundali-grid.tiny .kundali-cell { width: 28px; height: 28px; }
.kundali-grid.large .kundali-cell { width: 110px; height: 110px; }
.kundali-cell:hover { background: var(--card2); }
.kundali-cell.empty { opacity: .3; }
.kundali-cell.highlight-basic { background: rgba(245,158,11,.15); box-shadow: inset 0 0 0 2px var(--basic); }
.kundali-cell.highlight-destiny { background: rgba(99,102,241,.15); box-shadow: inset 0 0 0 2px var(--destiny); }
.kundali-cell.highlight-both { background: rgba(236,72,153,.15); box-shadow: inset 0 0 0 2px var(--both); }
.cell-digits { font-family: var(--font-display); font-size: 18px; font-weight: 700; color: var(--gold2); line-height: 1; }
.kundali-grid.compact .cell-digits { font-size: 12px; }
.kundali-grid.tiny .cell-digits { font-size: 8px; }
.kundali-grid.large .cell-digits { font-size: 24px; }
.cell-empty { color: var(--text3); font-size: 12px; }
.kundali-grid.tiny .cell-empty { font-size: 7px; }
.cell-num-label { position: absolute; bottom: 2px; right: 4px; font-size: 9px; color: var(--text3); font-weight: 600; }
.kundali-grid.tiny .cell-num-label { display: none; }
.kundali-legend { display: flex; gap: 8px; margin-top: 6px; flex-wrap: wrap; }
.leg-basic { background: rgba(245,158,11,.2); border: 1px solid var(--basic); color: var(--basic); padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; }
.leg-destiny { background: rgba(99,102,241,.2); border: 1px solid var(--destiny); color: var(--destiny); padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; }

/* ── DASHA PANEL (compact summary used in compare tiles) ───────────────────────── */
.dasha-panel { display: flex; flex-direction: column; gap: 4px; }
.dasha-panel.compact { gap: 2px; }
.dasha-row { display: flex; align-items: center; gap: 8px; background: var(--card); border: 1px solid var(--border); border-radius: 5px; padding: 4px 8px; font-size: 11px; }
.dasha-label { color: var(--text3); width: 50px; font-size: 9px; text-transform: uppercase; font-weight: 700; }
.dasha-num-badge { display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; font-weight: 700; font-size: 12px; background: var(--card2); color: var(--gold2); border: 1px solid var(--border); flex-shrink: 0; }
.dasha-end { color: var(--text3); font-size: 9px; margin-left: auto; }

/* num color accents on badges */
.num-1 { color: #fbbf24; border-color: #fbbf24; } .num-8 { color: #fbbf24; border-color: #fbbf24; }
.num-4 { color: #f87171; border-color: #f87171; }
.num-2,.num-3,.num-5,.num-6,.num-7,.num-9 { color: var(--gold2); }

/* ── VERDICT BADGES ──────────────────────────────────────────────────────────── */
.verdict-badge { font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 10px; white-space: nowrap; cursor: help; }
.verdict-badge.v-best { background: rgba(45,212,191,.2); color: var(--v-best); border: 1px solid var(--v-best); }
.verdict-badge.v-pos { background: rgba(74,222,128,.15); color: var(--v-pos); border: 1px solid var(--v-pos); }
.verdict-badge.v-neu { background: rgba(148,163,184,.12); color: var(--v-neu); border: 1px solid var(--v-neu); }
.verdict-badge.v-mixed { background: rgba(245,158,11,.15); color: var(--v-mixed); border: 1px solid var(--v-mixed); }
.verdict-badge.v-neg { background: rgba(248,113,113,.15); color: var(--v-neg); border: 1px solid var(--v-neg); }

/* ── DASHA EXPLORER (drill-down tree) ─────────────────────────────────────────── */
.dasha-date-picker { display: flex; gap: 8px; align-items: center; margin-bottom: 14px; flex-wrap: wrap; }
.dasha-date-picker label { margin-left: 4px; }
.dasha-date-picker input { width: auto; }
.dasha-explorer { display: flex; flex-direction: column; gap: 4px; }
.dasha-level-row { display: flex; align-items: center; gap: 10px; background: var(--card); border: 1px solid var(--border); border-radius: 6px; padding: 8px 12px; font-size: 12px; }
.dlr-label { width: 110px; color: var(--text2); font-weight: 600; font-size: 11px; }
.dlr-range { color: var(--text3); font-size: 10px; flex: 1; }
.level-maha { border-left: 3px solid var(--gold); }
.level-antar { border-left: 3px solid var(--violet2); }
.level-praty { border-left: 3px solid var(--teal); }
.level-daily { border-left: 3px solid var(--basic); }
.level-hourly { border-left: 3px solid var(--destiny); }
.level-minute { border-left: 3px solid var(--both); }
.dasha-children { margin-left: 18px; padding-left: 10px; border-left: 1px dashed var(--border); margin-top: 4px; display: flex; flex-direction: column; gap: 4px; }

/* ── DASHBOARD ───────────────────────────────────────────────────────────────── */
.dashboard { display: flex; flex-direction: column; gap: 32px; }
.dash-hero { display: flex; justify-content: space-between; align-items: center; padding: 32px 40px; background: linear-gradient(135deg, var(--card) 0%, rgba(107,79,160,.2) 100%); border: 1px solid var(--border); border-radius: var(--r2); position: relative; overflow: hidden; }
.dash-hero::after { content: '☸'; position: absolute; right: 160px; top: 50%; transform: translateY(-50%); font-size: 120px; color: rgba(201,168,76,.05); pointer-events: none; }
.dash-hero-text h1 { margin-bottom: 4px; }
.dash-sub { color: var(--text2); font-size: 14px; }
.dash-stats { display: flex; gap: 16px; position: relative; z-index: 1; flex-wrap: wrap; }
.stat-card { background: var(--card2); border: 1px solid var(--border); border-radius: var(--r); padding: 16px 24px; text-align: center; }
.stat-num { display: block; font-size: 2rem; font-family: var(--font-display); color: var(--gold2); font-weight: 700; }
.stat-lbl { font-size: 11px; color: var(--text3); text-transform: uppercase; letter-spacing: .08em; }
.stat-card.verified-stat .stat-num { color: var(--teal); }
.quick-btns { display: flex; gap: 12px; flex-wrap: wrap; }
.qbtn { background: var(--card); border: 1px solid var(--border); color: var(--text); padding: 12px 24px; border-radius: var(--r); font-size: 13px; cursor: pointer; transition: all .15s; }
.qbtn:hover { border-color: var(--gold); color: var(--gold); background: var(--card2); }
.person-cards, .group-cards { display: flex; gap: 12px; flex-wrap: wrap; }
.mini-card { background: var(--card); border: 1px solid var(--border); border-radius: var(--r); padding: 12px 14px; min-width: 190px; cursor: pointer; transition: all .15s; display: flex; gap: 10px; }
.mini-card:hover { border-color: var(--gold-dim); transform: translateY(-1px); }
.mc-name { font-weight: 600; color: var(--text); margin-bottom: 3px; }
.mc-dob { font-size: 11px; color: var(--text3); }
.mc-team { font-size: 11px; color: var(--text2); margin-top: 3px; }
.mc-nums { display: flex; gap: 5px; margin-top: 6px; }
.mc-top { margin-bottom: 4px; }
.group-card { background: var(--card); border: 1px solid var(--border); border-radius: var(--r); padding: 14px 16px; min-width: 180px; cursor: pointer; }
.group-card:hover { border-color: var(--violet2); }
.gc-type { font-size: 10px; color: var(--violet2); text-transform: uppercase; font-weight: 700; margin-bottom: 4px; }
.gc-name { font-weight: 600; color: var(--text); }
.gc-count { font-size: 11px; color: var(--text3); margin-top: 3px; }
.dash-empty { text-align: center; padding: 60px; color: var(--text2); }
.empty-icon { font-size: 48px; color: var(--border); margin-bottom: 12px; }
.empty-state { padding: 24px; text-align: center; color: var(--text3); }
.b-badge { background: rgba(245,158,11,.2); border: 1px solid var(--basic); color: var(--basic); padding: 1px 7px; border-radius: 3px; font-size: 11px; font-weight: 700; }
.d-badge { background: rgba(99,102,241,.2); border: 1px solid var(--destiny); color: var(--destiny); padding: 1px 7px; border-radius: 3px; font-size: 11px; font-weight: 700; }

/* ── AVATAR ──────────────────────────────────────────────────────────────────── */
.avatar { border-radius: 50%; overflow: hidden; flex-shrink: 0; display: flex; align-items: center; justify-content: center; background: var(--card2); }
.avatar img { width: 100%; height: 100%; object-fit: cover; }
.avatar-xs { width: 24px; height: 24px; font-size: 10px; }
.avatar-sm { width: 40px; height: 40px; font-size: 14px; }
.avatar-md { width: 56px; height: 56px; font-size: 18px; }
.avatar-lg { width: 96px; height: 96px; font-size: 28px; }
.avatar-initials { font-weight: 700; color: #fff; background: hsl(var(--av-hue, 200), 45%, 35%); }

/* ── VERIFIED BADGES ─────────────────────────────────────────────────────────── */
.badge-verified { display: inline-flex; align-items: center; gap: 4px; background: rgba(45,212,191,.15); border: 1px solid var(--teal); color: var(--teal); font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 4px; white-space: nowrap; }
.badge-unverified { display: inline-flex; align-items: center; gap: 4px; background: rgba(160,154,184,.1); border: 1px solid var(--text3); color: var(--text3); font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 4px; white-space: nowrap; }
.btn-verify { background: rgba(160,154,184,.1); border: 1px solid var(--text3); color: var(--text3); padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; }
.btn-verify.verified { background: rgba(45,212,191,.15); border-color: var(--teal); color: var(--teal); }
.btn-verify-sm { background: rgba(160,154,184,.1); border: 1px solid var(--text3); color: var(--text3); padding: 3px 8px; border-radius: 4px; font-size: 12px; font-weight: 700; cursor: pointer; min-width: 26px; }
.btn-verify-sm.verified { background: rgba(45,212,191,.15); border-color: var(--teal); color: var(--teal); }
.row-verified { background: rgba(45,212,191,.04); }
.row-verified .td-name { color: var(--teal); }
.cpi-v { color: var(--teal); font-size: 11px; font-weight: 700; }

/* ── DUPLICATE PANELS ────────────────────────────────────────────────────────── */
.dup-alert { display: flex; align-items: center; gap: 12px; background: rgba(245,158,11,.1); border: 1px solid var(--basic); border-radius: var(--r); padding: 10px 16px; margin-bottom: 16px; font-size: 13px; }
.dup-icon { font-size: 18px; color: var(--basic); }
.dup-panel-inner { background: var(--card); border: 1px solid var(--basic); border-radius: var(--r2); padding: 18px; margin-bottom: 16px; }
.dup-panel-inner h3 { color: var(--basic); }
.dup-group { margin-bottom: 16px; }
.dup-group-label { font-size: 12px; font-weight: 700; color: var(--basic); background: rgba(245,158,11,.1); padding: 5px 10px; border-radius: 5px 5px 0 0; border: 1px solid rgba(245,158,11,.3); }
.dup-rows { border: 1px solid rgba(245,158,11,.2); border-top: none; border-radius: 0 0 5px 5px; overflow: hidden; }
.dup-row { display: flex; align-items: center; gap: 10px; padding: 8px 12px; font-size: 12px; border-bottom: 1px solid var(--border); background: var(--card); }
.dup-row:last-child { border-bottom: none; }
.dup-row:hover { background: var(--card2); }
.dup-idx { color: var(--text3); width: 20px; font-weight: 700; }
.dup-name { color: var(--text); font-weight: 600; flex: 1; }
.dup-dob { color: var(--text2); width: 90px; }
.dup-team { color: var(--text3); flex: 1; }
.dup-created { color: var(--text3); width: 80px; font-size: 10px; }
.dup-modal-box { max-width: 520px; }
.dup-modal-msg { color: var(--text2); font-size: 13px; margin: 10px 0 14px; }
.dup-existing-card { display: flex; gap: 12px; background: var(--card2); border: 1px solid var(--border); border-radius: var(--r); padding: 12px 16px; margin-bottom: 16px; }
.dec-name { font-size: 15px; font-weight: 700; color: var(--text); }
.dec-dob { font-size: 12px; color: var(--text2); margin: 3px 0; }
.dec-nums { display: flex; gap: 6px; margin-top: 6px; }
.dup-modal-actions { display: flex; gap: 10px; flex-wrap: wrap; }

/* ── BULK TOOLBAR ────────────────────────────────────────────────────────────── */
.db-topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 10px; }
.db-topbar-left { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.count-badge { background: var(--card2); color: var(--text3); font-size: 12px; padding: 2px 8px; border-radius: 10px; margin-left: 8px; }
.db-stat-pill { font-size: 11px; padding: 3px 10px; border-radius: 10px; font-weight: 600; }
.verified-pill { background: rgba(45,212,191,.15); color: var(--teal); }
.unverified-pill { background: rgba(160,154,184,.1); color: var(--text3); }
.bulk-toolbar { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; background: var(--card); border: 1px solid var(--border); border-radius: var(--r); padding: 10px 16px; margin-bottom: 14px; transition: all .2s; }
.bulk-toolbar.has-selection { border-color: var(--violet); background: rgba(107,79,160,.12); }
.bt-left { display: flex; align-items: center; gap: 14px; }
.bt-sel-all { display: flex; align-items: center; gap: 7px; font-size: 12px; color: var(--text2); cursor: pointer; }
.bt-sel-all input { cursor: pointer; accent-color: var(--gold); }
.bt-count { font-weight: 700; color: var(--violet2); font-size: 13px; }
.bt-actions { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.bt-btn { border: 1px solid var(--border); background: var(--card2); color: var(--text2); padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all .15s; }
.bt-verify:hover { border-color: var(--teal); color: var(--teal); }
.bt-unverify:hover { border-color: var(--text3); color: var(--text); }
.bt-edit:hover { border-color: var(--violet2); color: var(--violet2); }
.bt-delete:hover, .bt-clear-all:hover { border-color: var(--red); color: var(--red); }
.bt-divider { width: 1px; height: 20px; background: var(--border); }

.db-filters { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
.db-filters input, .db-filters select { flex: 1; min-width: 130px; }
.db-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.db-table thead tr { background: var(--card2); }
.db-table th { padding: 10px 12px; text-align: left; color: var(--text3); font-size: 11px; text-transform: uppercase; border-bottom: 1px solid var(--border); }
.db-row { border-bottom: 1px solid var(--border); cursor: pointer; transition: background .12s; }
.db-row:hover { background: var(--card2); }
.db-row td { padding: 8px 12px; color: var(--text2); vertical-align: middle; }
.td-name { color: var(--text); font-weight: 500; }
.td-avatar { padding: 6px !important; }

/* ── MODAL ───────────────────────────────────────────────────────────────────── */
.modal-overlay { position: fixed; inset: 0; z-index: 500; background: rgba(10,8,18,.85); display: flex; align-items: flex-start; justify-content: center; padding: 24px; overflow-y: auto; backdrop-filter: blur(4px); }
.modal-box { background: var(--card); border: 1px solid var(--border); border-radius: var(--r2); width: 100%; max-width: 1000px; padding: 28px; position: relative; }
.modal-close { position: absolute; top: 12px; right: 14px; background: none; border: none; color: var(--text3); font-size: 18px; cursor: pointer; }
.modal-close:hover { color: var(--text); }
.clear-modal { max-width: 420px; }
.clear-modal h3 { color: var(--red); margin-bottom: 12px; }
.clear-warn { color: var(--text); font-size: 14px; margin-bottom: 8px; }
.clear-warn2 { color: var(--text2); font-size: 13px; margin-bottom: 10px; }
.clear-input { margin-bottom: 14px; border-color: var(--red); }
.clear-actions { display: flex; gap: 10px; }
#clear-confirm-btn:disabled { opacity: .4; cursor: not-allowed; }

/* ── PERSON VIEW ─────────────────────────────────────────────────────────────── */
.pv-header { display: flex; gap: 20px; align-items: flex-start; margin-bottom: 24px; flex-wrap: wrap; }
.pv-info { flex: 1; min-width: 240px; }
.pv-name-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 6px; }
.pv-info h2 { font-family: var(--font-display); font-size: 1.6rem; color: var(--gold2); margin-bottom: 0; }
.pv-meta { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }
.pv-meta span { font-size: 12px; color: var(--text2); background: var(--card2); padding: 2px 8px; border-radius: 4px; }
.pv-teams { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
.team-tag { background: rgba(107,79,160,.25); border: 1px solid var(--violet); color: var(--violet2); font-size: 11px; padding: 2px 8px; border-radius: 4px; }
.pv-notes { margin-top: 10px; font-size: 12px; color: var(--text2); background: var(--card2); padding: 8px 12px; border-radius: 6px; white-space: pre-wrap; }
.pv-actions { display: flex; gap: 8px; flex-shrink: 0; flex-wrap: wrap; }
.pv-body { display: grid; grid-template-columns: auto 1fr; gap: 28px; }
.num-breakdown { margin-top: 12px; display: flex; flex-direction: column; gap: 5px; }
.nb-row { display: flex; gap: 10px; align-items: baseline; }
.nb-label { font-size: 11px; color: var(--text3); text-transform: uppercase; min-width: 70px; }
.nb-val { font-size: 12px; color: var(--text); }
.highlight-basic-text { color: var(--basic); font-weight: 700; }
.highlight-destiny-text { color: var(--destiny); font-weight: 700; }

/* ── COMPARE PAGE ────────────────────────────────────────────────────────────── */
.compare-setup { display: grid; grid-template-columns: 320px 1fr; gap: 24px; background: var(--card); border: 1px solid var(--border); border-radius: var(--r2); padding: 20px; margin-bottom: 16px; }
.cmp-person-list { max-height: 280px; overflow-y: auto; display: flex; flex-direction: column; gap: 4px; border: 1px solid var(--border); border-radius: var(--r); padding: 6px; background: var(--bg); }
.cmp-person-item { display: flex; align-items: center; gap: 8px; padding: 6px 8px; border-radius: 5px; cursor: pointer; }
.cmp-person-item:hover { background: var(--card2); }
.cmp-person-item input[type="checkbox"] { cursor: pointer; accent-color: var(--gold); }
.cpi-name { flex: 1; font-size: 12px; color: var(--text); font-weight: 500; }
.cpi-dob { font-size: 11px; color: var(--text3); width: 80px; text-align: right; }
.cpi-team { font-size: 10px; color: var(--text2); width: 90px; text-align: right; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cmp-selected-info { font-size: 11px; color: var(--gold); margin-top: 8px; font-weight: 600; }
.compare-actions { display: flex; gap: 12px; margin-bottom: 24px; }

.cmp-result-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px; }
.cmp-date-pick { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--text2); flex-wrap: wrap; }
.cmp-date-pick input { width: auto; }
.cmp-live-label, .cmp-rest-label { font-size: 12px; color: var(--text3); text-transform: uppercase; font-weight: 700; margin: 14px 0 8px; letter-spacing: .05em; }

/* Adaptive grid — sizes determined dynamically by population count */
.cmp-grid { display: grid; gap: 10px; }
.cmp-grid-live.gs-xl { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
.cmp-grid-live.gs-lg { grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
.cmp-grid-live.gs-md { grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }
.cmp-grid-rest { grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); }

.cmp-tile { background: var(--card); border: 1px solid var(--border); border-radius: var(--r); cursor: pointer; transition: all .15s; overflow: hidden; }
.cmp-tile:hover { border-color: var(--gold-dim); }
.tile-live { padding: 14px; display: flex; flex-direction: column; align-items: center; gap: 8px; }
.tile-small { padding: 6px; display: flex; flex-direction: column; align-items: center; gap: 3px; }
.cmp-tile-name { font-weight: 600; font-size: 12px; color: var(--gold2); text-align: center; }
.tile-small .cmp-tile-name { font-size: 9px; color: var(--text2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 70px; }
.cmp-tile-team { font-size: 10px; color: var(--violet2); text-align: center; }
.cmp-tile-mini-nums { display: flex; gap: 3px; }
.cmp-tile-mini-nums .b-badge, .cmp-tile-mini-nums .d-badge { font-size: 9px; padding: 0 4px; }

/* ── MATCH / PREDICTIONS PAGE ────────────────────────────────────────────────── */
.match-form-card { background: var(--card); border: 1px solid var(--border); border-radius: var(--r2); padding: 20px; margin-bottom: 20px; }
.match-form-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 14px; }
.match-squad-picker { margin: 14px 0; }
.saved-matches-list { display: flex; flex-direction: column; gap: 8px; }
.match-card { display: flex; align-items: center; gap: 14px; background: var(--card); border: 1px solid var(--border); border-radius: var(--r); padding: 10px 16px; }
.mc-title { font-weight: 700; color: var(--text); flex: 1; }
.mc-venue { color: var(--text3); font-size: 12px; }
.mc-dates { color: var(--text2); font-size: 11px; }
.mc-squad { color: var(--text3); font-size: 11px; }
.mc-actions { display: flex; gap: 6px; }

.match-prediction { margin-top: 20px; }
.mp-header { margin-bottom: 16px; }
.mp-meta { color: var(--text2); font-size: 12px; }
.mp-focus { margin-top: 6px; font-size: 11px; color: var(--text3); }
.focus-tag { background: var(--card2); border: 1px solid var(--violet); color: var(--violet2); padding: 1px 8px; border-radius: 10px; margin-left: 4px; }
.mp-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; }
.mp-card { background: var(--card); border: 1px solid var(--border); border-radius: var(--r); padding: 14px; }
.mp-card-head { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.mp-name { font-weight: 600; font-size: 13px; color: var(--gold2); }
.mp-score { font-size: 1.4rem; font-weight: 700; font-family: var(--font-display); margin-bottom: 8px; }
.mp-score.score-pos { color: var(--v-pos); }
.mp-score.score-neg { color: var(--v-neg); }
.mp-score.score-neu { color: var(--v-neu); }
.mp-levels { display: flex; flex-direction: column; gap: 4px; }
.mp-level-row { display: flex; align-items: center; gap: 8px; font-size: 11px; }
.mp-level-label { width: 45px; color: var(--text3); text-transform: uppercase; font-weight: 700; }

/* ── TOAST ───────────────────────────────────────────────────────────────────── */
.toast { position: fixed; bottom: 24px; right: 24px; z-index: 9999; background: var(--card2); border: 1px solid var(--gold); color: var(--gold2); padding: 10px 20px; border-radius: 8px; font-size: 13px; font-weight: 500; opacity: 0; transform: translateY(8px); transition: all .25s; pointer-events: none; }
.toast.show { opacity: 1; transform: translateY(0); }

::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--text3); }

/* ── RESPONSIVE ──────────────────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .page { padding: 12px; }
  .dash-hero { flex-direction: column; gap: 16px; padding: 20px; }
  .form-grid { grid-template-columns: 1fr; }
  .form-group.span2 { grid-column: 1; }
  .pv-body { grid-template-columns: 1fr; }
  .compare-setup { grid-template-columns: 1fr; }
  .match-form-grid { grid-template-columns: 1fr; }
}
