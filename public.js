// server/db.js
// ════════════════════════════════════════════════════════════════════════════
// DATABASE — pure-JS JSON file store (lowdb). Swappable later for
// Supabase/Firebase/Postgres without changing the route logic much,
// since all access goes through the functions below.
// ════════════════════════════════════════════════════════════════════════════

const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const path = require('path');

const file = path.join(__dirname, 'data', 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter, {
  owners: [],       // [{ id, email, passwordHash, name, createdAt }]
  persons: [],      // owner's kundali persons (synced from their device)
  groups: [],       // saved comparison groups
  matches: [],      // predictions/match schedule
  visitors: [],      // [{ id, ip, location, device, page, at, consentGiven }]
  bookingRequests: [], // [{ id, name, contact, preferredTime, message, at, status }]
});

async function initDB() {
  await db.read();
  db.data ||= { owners: [], persons: [], groups: [], matches: [], visitors: [], bookingRequests: [] };
  await db.write();
}

module.exports = { db, initDB };
