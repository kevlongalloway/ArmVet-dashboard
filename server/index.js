require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const path = require('path');
const { initDB } = require('./db');
const { setCsrfToken, validateCsrf } = require('./middleware/csrf');

const app = express();
const PORT = process.env.PORT || 3001;

// Allowed origins for CORS
const allowedOrigins = [
  'https://armvet.onrender.com',
  'https://ArmVet.onrender.com',
  process.env.PUBLIC_SITE_URL,       // In case the public site URL changes
  process.env.DASHBOARD_URL,         // The dashboard itself
].filter(Boolean);

// In development, also allow localhost
if (process.env.NODE_ENV !== 'production') {
  allowedOrigins.push('http://localhost:5173', 'http://localhost:3000', 'http://localhost:3001');
}

// Security headers
app.use(helmet({
  contentSecurityPolicy: false, // Let Vite/React handle CSP
}));

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (server-to-server, curl, mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CSRF protection
app.use(setCsrfToken);
app.use(validateCsrf);

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/events', require('./routes/events'));
app.use('/api/public', require('./routes/public'));

// GET /api/csrf-token - Endpoint for the frontend to get the CSRF token
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.cookies.armvet_csrf });
});

// GET /api/stats - Dashboard stats (auth required)
const { authenticateToken } = require('./middleware/auth');
app.get('/api/stats', authenticateToken, async (req, res) => {
  const { pool } = require('./db');
  try {
    const [bookings, contacts, pending, events] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM bookings'),
      pool.query("SELECT COUNT(*) FROM contacts WHERE status = 'new'"),
      pool.query("SELECT COUNT(*) FROM bookings WHERE status = 'pending'"),
      pool.query("SELECT COUNT(*) FROM events WHERE date >= CURRENT_DATE ORDER BY date ASC LIMIT 5"),
    ]);

    res.json({
      totalBookings: parseInt(bookings.rows[0].count),
      newContacts: parseInt(contacts.rows[0].count),
      pendingBookings: parseInt(pending.rows[0].count),
      upcomingEvents: events.rows,
    });
  } catch (err) {
    console.error('Error fetching stats:', err.message);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Serve static frontend in production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  // SPA fallback: serve index.html for non-API, non-file requests
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api/') && !req.path.includes('.')) {
      return res.sendFile(path.join(distPath, 'index.html'));
    }
    next();
  });
}

// Ensure admin user exists with current env password (hash on startup)
async function ensureAdminUser() {
  const bcrypt = require('bcryptjs');
  const { pool } = require('./db');
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    console.warn('ADMIN_USERNAME or ADMIN_PASSWORD not set — skipping admin user sync');
    return;
  }

  const hash = await bcrypt.hash(password, 10);
  const existing = await pool.query('SELECT id FROM users WHERE username = $1', [username]);

  if (existing.rows.length > 0) {
    await pool.query('UPDATE users SET password_hash = $1 WHERE username = $2', [hash, username]);
    console.log(`Admin user "${username}" password synced from environment`);
  } else {
    await pool.query(
      'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3)',
      [username, hash, 'admin']
    );
    console.log(`Admin user "${username}" created`);
  }
}

// Start server
async function start() {
  try {
    await initDB();
    console.log('Connected to PostgreSQL');
    await ensureAdminUser();

    app.listen(PORT, () => {
      console.log(`ArmVet Dashboard API running on port ${PORT}`);
      console.log(`Allowed CORS origins: ${allowedOrigins.join(', ')}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

start();
