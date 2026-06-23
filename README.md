# KundaliGrid — Owner + Visitor Mode

## 🌐 Get your free live link (numerosohanlal) — 5 minutes, one-time

I've pre-configured everything (the `render.yaml` file in this folder tells Render
exactly how to build, run, and store your data — you don't need to configure anything
yourself). Just these steps:

**Step 1 — Put this code on GitHub (2 min)**
1. Go to [github.com/new](https://github.com/new), sign up free if you don't have an account
2. Name the repo `numerosohanlal` → Create repository
3. On the next page, click **"uploading an existing file"** and drag this whole
   `kundali-fullstack` folder in → Commit changes

**Step 2 — Deploy on Render (2 min)**
1. Go to [render.com](https://render.com) → sign up free (you can use your GitHub account to sign up, one click)
2. Click **New +** → **Blueprint**
3. Connect the `numerosohanlal` repo you just created
4. Render reads `render.yaml` automatically and sets everything up — just click **Apply**
5. Wait ~2 minutes for the first build

**Step 3 — Get your link**
Render gives you a URL like:
```
https://numerosohanlal.onrender.com
```
That's your permanent free link. Open it, create your owner account (email + password), and you're live.

> Free tier note: it sleeps after 15 min of no visitors and wakes up in a few seconds
> on the next visit — completely fine for personal use.

---

## ⚡ Or just run it on this PC right now (no internet needed)

1. Make sure **Node.js** is installed — if not, get it free from [nodejs.org](https://nodejs.org) (LTS version), install, restart your computer.
2. **Windows:** double-click `START.bat`
   **Mac/Linux:** double-click `START.sh` (or run `./START.sh` in a terminal)
3. It opens `http://localhost:3000` in your browser automatically.
4. First time only: you'll see **"Create Owner Account"** — set your email + password. This is your owner login for this PC.
5. To stop the server later, close the terminal window it opened.
6. To run it again anytime, just double-click the same file — your data is still there.

That's it — everything below is for going further (deploying online, understanding the structure).

---


A numerology comparison app with two modes:

- **Owner mode (you)**: log in once with your email. Everything you add/edit/delete
  saves to the server (your backup) and also works offline on this PC — it syncs
  back up automatically when you're online again.
- **Visitor mode (everyone else)**: no login, no local storage at all. They can browse
  a read-only view of your data, optionally allow their visit to be logged (location,
  device, time — only if they say yes), and submit a request to book a call/session
  with you. Everything they do goes straight to the server, nothing stays on their device.

---

## 1. Run it locally first (to test)

```bash
cd kundali-fullstack
npm install
npm start
```

Open `http://localhost:3000` in your browser.

First time: you'll see **"Create Owner Account"** — set your email + password here.
This becomes the *only* owner account for this site (by design, so nobody else can
register as a second owner).

---

## 2. Deploy it for free so it works from anywhere

You have two pieces to deploy: this is a single Node.js app that serves both the
API and the website, so you only need **one** free hosting service.

### Option A — Render.com (recommended, easiest)

1. Push this folder to a GitHub repository
2. Go to [render.com](https://render.com) → New → Web Service → connect your repo
3. Build command: `npm install`
4. Start command: `npm start`
5. Add an environment variable: `JWT_SECRET` = (any long random string — e.g. generate
   one at [randomkeygen.com](https://randomkeygen.com))
6. Deploy — Render gives you a free `https://yourapp.onrender.com` URL

**Note:** Render's free tier sleeps after 15 minutes of no traffic and wakes up in a
few seconds on the next visit. Fine for personal use; upgrade later (~$7/mo) if you
want it always instantly responsive.

### Option B — Railway.app

Similar process: connect GitHub repo, set `JWT_SECRET` env var, deploy. Railway's
free tier gives you a monthly credit that covers light personal use.

### ⚠️ Important: persistent storage on free hosting

This app currently stores data in a JSON file (`server/data/db.json`) on disk.
**Most free hosting tiers wipe the disk on restart/redeploy.** For a hobby project
with light traffic this is usually fine for weeks at a time, but to be safe long-term:

- Render: add a **free persistent disk** (Render → your service → Disks → Add Disk,
  mount at `/app/server/data`) — small disks are free on Render
- Alternative: migrate to a free-tier real database (Supabase/Firebase) later —
  the code is structured so only `server/db.js` needs to change, not the routes

---

## 3. Point a domain at it (optional)

Free subdomain (`yourapp.onrender.com`) works fine. If you want `yourname.com`:
buy a domain (~$10–15/year from Namecheap/Porkbun) and follow Render's "Custom Domain"
instructions to point it there.

---

## 4. Your email = your owner key

- Sign in with the same email on any device/browser to manage your data from there too
- If you ever need to change your email or password, use **Settings → Update Credentials**
  (requires your current password)
- If you lose access entirely (forgot password, lost device), you'll need to manually
  edit `server/data/db.json` on the host to reset it, since there's no email-reset
  flow built yet — let me know if you want that added (it needs an email-sending
  service, which has its own free tiers too)

---

## 5. What visitors can and can't do

| Action | Visitor | Owner (you) |
|---|---|---|
| Browse kundalis | ✅ read-only | ✅ full access |
| Add/edit/delete | ❌ | ✅ |
| Local storage used | **None** | Yes (offline cache, syncs to server) |
| Location/device logged | Only if they click "Allow" | n/a |
| Book a call/session | ✅ | n/a (you receive requests) |

---

## File structure

```
kundali-fullstack/
├── server/
│   ├── index.js          # Express app entry point
│   ├── db.js              # JSON file database (lowdb)
│   ├── data/db.json        # auto-created on first run — your actual data lives here
│   └── routes/
│       ├── auth.js         # owner signup/login (JWT)
│       ├── data.js         # owner CRUD: persons, groups, matches, visitor/booking views
│       └── public.js       # visitor-facing: read-only data, consent logging, booking
├── public/                # the actual frontend (served as static files)
│   ├── index.html
│   ├── app.js              # main controller (owner/visitor mode boot logic)
│   ├── data.js             # API client (replaces old localStorage-only version)
│   ├── kundali.js          # numerology grid engine
│   ├── dasha.js             # Maha/Antar/Pratyantar/Daily/Hourly/Minute dasha engine
│   ├── rules.js             # prediction rules engine
│   ├── chaldean.js          # optional name-numerology (on-demand only)
│   └── ui_*.js              # page renderers
├── package.json
└── .env                    # JWT_SECRET (don't commit this)
```
