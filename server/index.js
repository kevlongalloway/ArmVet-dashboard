require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const path = require('path');
const bcrypt = require('bcryptjs');
const { users, initDB } = require('./db');
const { setCsrfToken, validateCsrf } = require('./middleware/csrf');

const app = express();
const PORT = process.env.PORT || 3001;

// Allowed origins for CORS
const allowedOrigins = [
  'https://armvet.onrender.com',
  'https://ArmVet.onrender.com',
  process.env.PUBLIC_SITE_URL,
  process.env.DASHBOARD_URL,
].filter(Boolean);

if (process.env.NODE_ENV !== 'production') {
  allowedOrigins.push('http://localhost:5173', 'http://localhost:3000', 'http://localhost:3001');
}

// Security headers
app.use(helmet({
  contentSecurityPolicy: false,
}));

// CORS
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
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

// GET /api/csrf-token
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.cookies.armvet_csrf });
});

// GET /api/stats (auth required)
const { authenticateToken } = require('./middleware/auth');
const { bookings, contacts, events } = require('./db');

app.get('/api/stats', authenticateToken, (req, res) => {
  try {
    res.json({
      totalBookings: bookings.count(),
      newContacts: contacts.countByStatus('new'),
      pendingBookings: bookings.countByStatus('pending'),
      upcomingEvents: events.upcoming(5),
    });
  } catch (err) {
    console.error('Error fetching stats:', err.message);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Serve static frontend
const fs = require('fs');
const distPath = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api/') && !req.path.includes('.')) {
      return res.sendFile(path.join(distPath, 'index.html'));
    }
    next();
  });
}

// Ensure admin user exists from env vars
async function ensureAdminUser() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    console.warn('ADMIN_USERNAME or ADMIN_PASSWORD not set — skipping admin user sync');
    return;
  }

  const hash = await bcrypt.hash(password, 10);
  users.upsert(username, hash, 'admin');
  console.log(`Admin user "${username}" synced from environment`);
}

// Start server
async function start() {
  try {
    initDB();
    await ensureAdminUser();

    app.listen(PORT, () => {
      console.log(`ArmVet Dashboard running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();
