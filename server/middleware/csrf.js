const crypto = require('crypto');

const CSRF_COOKIE = 'armvet_csrf';
const CSRF_HEADER = 'x-csrf-token';

// Generate a CSRF token and set it as a cookie
function setCsrfToken(req, res, next) {
  if (!req.cookies[CSRF_COOKIE]) {
    const token = crypto.randomBytes(32).toString('hex');
    res.cookie(CSRF_COOKIE, token, {
      httpOnly: false, // Frontend needs to read this
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 8 * 60 * 60 * 1000, // 8 hours
    });
  }
  next();
}

// Validate CSRF token on state-changing requests
function validateCsrf(req, res, next) {
  // Skip CSRF for public POST endpoints (external form submissions use CORS origin check instead)
  if (req.path.startsWith('/api/public/')) {
    return next();
  }

  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    const cookieToken = req.cookies[CSRF_COOKIE];
    const headerToken = req.headers[CSRF_HEADER];

    if (!cookieToken || !headerToken || cookieToken !== headerToken) {
      return res.status(403).json({ error: 'Invalid CSRF token' });
    }
  }
  next();
}

module.exports = { setCsrfToken, validateCsrf };
