// ════════════════════════════════════════════════════════════════════════════
// KUNDALI ENGINE — numerology grid calculations
// ════════════════════════════════════════════════════════════════════════════

function digitSum(n) {
  n = Math.abs(n);
  while (n > 9) n = String(n).split('').reduce((a, d) => a + parseInt(d), 0);
  return n;
}

function parseDOB(dob) {
  // dob: "DD/MM/YYYY"
  const parts = (dob || '').split('/');
  if (parts.length !== 3) return null;
  const [dd, mm, yyyy] = parts;
  if (!dd || !mm || !yyyy || yyyy.length !== 4) return null;
  return {
    d1: parseInt(dd[0]) || 0, d2: parseInt(dd[1]) || 0,
    m1: parseInt(mm[0]) || 0, m2: parseInt(mm[1]) || 0,
    y1: parseInt(yyyy[0]) || 0, y2: parseInt(yyyy[1]) || 0,
    y3: parseInt(yyyy[2]) || 0, y4: parseInt(yyyy[3]) || 0,
    day: parseInt(dd), month: parseInt(mm), year: parseInt(yyyy),
  };
}

function calcKundali(dob) {
  const p = parseDOB(dob);
  if (!p) return null;
  const { d1, d2, m1, m2, y1, y2, y3, y4 } = p;

  const basicRaw = d1 + d2;
  const basic = digitSum(basicRaw);
  const destinyRaw = d1 + d2 + m1 + m2 + y1 + y2 + y3 + y4;
  const destiny = digitSum(destinyRaw);

  // Digits placed in the grid — zeros ignored entirely
  const gridDigits = [];
  if (d1 !== 0) gridDigits.push(d1);
  if (d2 !== 0) gridDigits.push(d2);
  if (m1 !== 0) gridDigits.push(m1);
  if (m2 !== 0) gridDigits.push(m2);
  if (y3 !== 0) gridDigits.push(y3);
  if (y4 !== 0) gridDigits.push(y4);
  if (basic !== 0) gridDigits.push(basic);
  if (destiny !== 0) gridDigits.push(destiny);

  const counts = {};
  for (let i = 1; i <= 9; i++) counts[i] = 0;
  gridDigits.forEach(d => { if (d >= 1 && d <= 9) counts[d]++; });

  return {
    ...p, basic, destiny, gridDigits, counts,
    raw: { basicRaw, destinyRaw },
  };
}

// Standard 3x3 grid layout
const GRID_LAYOUT = [[3, 1, 9], [6, 7, 5], [2, 8, 4]];

function getNumMeaning(n) {
  const m = {
    1: 'Sun – Leadership, Independence', 2: 'Moon – Emotion, Partnership',
    3: 'Jupiter – Creativity, Expression', 4: 'Rahu – Discipline, Hard Work',
    5: 'Mercury – Freedom, Adventure', 6: 'Venus – Harmony, Responsibility',
    7: 'Ketu – Spirituality, Analysis', 8: 'Saturn – Power, Karma',
    9: 'Mars – Energy, Humanitarian'
  };
  return m[n] || '';
}

function renderKundaliGrid(kundali, opts = {}) {
  if (!kundali) return '<div class="kundali-grid-empty">Invalid DOB</div>';
  const { counts, basic, destiny } = kundali;
  const sizeClass = opts.size || ''; // '', 'compact', 'tiny', 'large'

  let html = `<div class="kundali-grid ${sizeClass}">`;
  GRID_LAYOUT.forEach(row => {
    html += '<div class="kundali-row">';
    row.forEach(num => {
      const count = counts[num] || 0;
      const isBasic = num === basic, isDestiny = num === destiny;
      let cls = 'kundali-cell';
      if (isBasic && isDestiny) cls += ' highlight-both';
      else if (isBasic) cls += ' highlight-basic';
      else if (isDestiny) cls += ' highlight-destiny';
      if (count === 0) cls += ' empty';

      const inner = count === 0
        ? `<span class="cell-empty">·</span>`
        : `<span class="cell-digits">${String(num).repeat(count)}</span>`;
      html += `<div class="${cls}" title="${getNumMeaning(num)}">${inner}<span class="cell-num-label">${num}</span></div>`;
    });
    html += '</div>';
  });
  html += '</div>';

  if (!opts.noLegend) {
    html += `<div class="kundali-legend"><span class="leg-basic">B=${basic}</span><span class="leg-destiny">D=${destiny}</span></div>`;
  }
  return html;
}
