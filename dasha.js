/* ════════════════════════════════════════════════════════════════════════════
   EXTRA STYLES — auth, consent banner, visitor mode, visitor log, chaldean
   ════════════════════════════════════════════════════════════════════════════ */

.nav-links.hidden { display: none; }
.page-loading { padding: 60px; text-align: center; color: var(--text3); }

/* ── AUTH PAGE ───────────────────────────────────────────────────────────────── */
.auth-page { display: flex; align-items: center; justify-content: center; min-height: calc(100vh - 56px); padding: 24px; }
.auth-card { background: var(--card); border: 1px solid var(--border); border-radius: var(--r2); padding: 32px; max-width: 380px; width: 100%; text-align: center; }
.auth-symbol { font-size: 40px; color: var(--gold); margin-bottom: 10px; filter: drop-shadow(0 0 8px rgba(201,168,76,.4)); }
.auth-card h2 { color: var(--gold2); font-family: var(--font-display); margin-bottom: 6px; }
.auth-card form { display: flex; flex-direction: column; gap: 12px; text-align: left; }
.auth-error { color: var(--red); font-size: 12px; min-height: 16px; }

/* ── CONSENT BANNER ──────────────────────────────────────────────────────────── */
.consent-banner {
  position: sticky; top: 56px; z-index: 90;
  display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
  background: rgba(107,79,160,.18); border-bottom: 1px solid var(--violet);
  padding: 10px 24px; font-size: 13px;
}
.consent-icon { font-size: 16px; color: var(--violet2); }
.consent-text { flex: 1; color: var(--text2); min-width: 200px; }
.consent-actions { display: flex; gap: 8px; }

/* ── VISITOR MODE ─────────────────────────────────────────────────────────────── */
.visitor-page { max-width: 1100px; margin: 0 auto; }
.visitor-header { margin-bottom: 16px; }
.visitor-header .hint { display: flex; align-items: center; gap: 10px; }
.booking-page { max-width: 480px; margin: 40px auto; }
.booking-page h2 { color: var(--gold2); font-family: var(--font-display); }

/* ── VISITOR LOG (owner) ──────────────────────────────────────────────────────── */
.visitorlog-page { max-width: 1100px; margin: 0 auto; }
.vl-section { margin-bottom: 32px; }
.vl-requests { display: flex; flex-direction: column; gap: 10px; }
.vl-request-card { background: var(--card); border: 1px solid var(--border); border-radius: var(--r); padding: 14px 18px; }
.vl-request-card.vl-done { opacity: .55; }
.vl-req-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
.vl-req-name { font-weight: 700; color: var(--text); }
.vl-req-status { font-size: 11px; padding: 2px 8px; border-radius: 10px; text-transform: uppercase; font-weight: 700; }
.status-pending { background: rgba(245,158,11,.15); color: var(--basic); }
.status-done { background: rgba(45,212,191,.15); color: var(--teal); }
.vl-req-contact { color: var(--violet2); font-size: 12px; }
.vl-req-time, .vl-req-msg { color: var(--text2); font-size: 12px; margin-top: 4px; }
.vl-req-date { color: var(--text3); font-size: 10px; margin-top: 6px; }
.vl-req-actions { margin-top: 8px; }

/* ── CHALDEAN NUMEROLOGY (optional, on-demand) ──────────────────────────────── */
.chaldean-toggle-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.chaldean-result { margin-top: 10px; background: var(--card2); border: 1px solid var(--border); border-radius: var(--r); padding: 12px 16px; }
.chaldean-header { font-size: 11px; color: var(--text3); text-transform: uppercase; font-weight: 700; margin-bottom: 8px; }
.chaldean-breakdown { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 10px; }
.chaldean-letter { display: flex; flex-direction: column; align-items: center; background: var(--card); border: 1px solid var(--border); border-radius: 4px; padding: 4px 7px; font-size: 12px; font-weight: 700; color: var(--text); }
.chaldean-letter small { color: var(--gold2); font-size: 10px; font-weight: 700; }
.chaldean-totals { font-size: 13px; color: var(--text2); }
