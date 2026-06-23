// public/chaldean.js
// ════════════════════════════════════════════════════════════════════════════
// CHALDEAN NUMEROLOGY — name-based numerology, used ONLY when explicitly
// requested by the person (e.g. clicking "Name Numerology" on a profile).
// This is intentionally never auto-computed alongside the DOB-based kundali.
// ════════════════════════════════════════════════════════════════════════════

const CHALDEAN_MAP = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 8, g: 3, h: 5, i: 1,
  j: 1, k: 2, l: 3, m: 4, n: 5, o: 7, p: 8, q: 1, r: 2,
  s: 3, t: 4, u: 6, v: 6, w: 6, x: 5, y: 1, z: 7,
};

function calcChaldean(name) {
  if (!name) return null;
  const letters = name.toLowerCase().replace(/[^a-z]/g, '');
  if (!letters.length) return null;

  let total = 0;
  const breakdown = [];
  for (const ch of letters) {
    const val = CHALDEAN_MAP[ch] || 0;
    total += val;
    breakdown.push({ letter: ch, value: val });
  }
  const compound = total;
  let reduced = total;
  while (reduced > 9 && reduced !== 11 && reduced !== 22) {
    reduced = String(reduced).split('').reduce((a, d) => a + parseInt(d), 0);
  }

  return { name, breakdown, compound, reduced };
}

function renderChaldeanResult(result) {
  if (!result) return '<p class="hint">Enter a name to calculate.</p>';
  return `
    <div class="chaldean-result">
      <div class="chaldean-header">Chaldean Name Number</div>
      <div class="chaldean-breakdown">
        ${result.breakdown.map(b => `<span class="chaldean-letter">${b.letter.toUpperCase()}<small>${b.value}</small></span>`).join('')}
      </div>
      <div class="chaldean-totals">
        <span class="nb-label">Compound:</span> <strong>${result.compound}</strong>
        &nbsp;→&nbsp; <span class="nb-label">Reduced:</span> <strong class="highlight-destiny-text">${result.reduced}</strong>
      </div>
    </div>`;
}
