// server/index.js
// ════════════════════════════════════════════════════════════════════════════
// SERVER ENTRY POINT
// ════════════════════════════════════════════════════════════════════════════

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDB } = require('./db');
const { router: authRouter } = require('./routes/auth');
const dataRouter = require('./routes/data');
const publicRouter = require('./routes/public');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '15mb' })); // generous limit for photo data URLs

// API routes
app.use('/api/auth', authRouter);
app.use('/api/owner', dataRouter);
app.use('/api/public', publicRouter);

// Serve the frontend (single-page app)
app.use(express.static(path.join(__dirname, '..', 'public')));
app.get('/*splat', (req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Not found' });
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`KundaliGrid server running on http://localhost:${PORT}`);
  });
});
