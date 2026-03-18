const express = require('express');
const { pool } = require('../db');

const router = express.Router();

// POST /api/public/bookings - Submit a booking from the public ArmVet site
// No auth required - this is the endpoint ArmVet.onrender.com posts to
router.post('/bookings', async (req, res) => {
  const { name, email, phone, org, service, category, date, time, message } = req.body;

  if (!name || !email || !service || !category || !date || !time) {
    return res.status(400).json({
      error: 'Required fields: name, email, service, category, date, time',
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO bookings (name, email, phone, org, service, category, date, time, message)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [name, email, phone || null, org || null, service, category, date, time, message || null]
    );
    res.status(201).json({ message: 'Booking submitted successfully', booking: result.rows[0] });
  } catch (err) {
    console.error('Error creating booking:', err.message);
    res.status(500).json({ error: 'Failed to submit booking' });
  }
});

// POST /api/public/contacts - Submit a contact form from the public ArmVet site
// No auth required
router.post('/contacts', async (req, res) => {
  const { name, email, phone, category, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      error: 'Required fields: name, email, subject, message',
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO contacts (name, email, phone, category, subject, message)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [name, email, phone || null, category || null, subject, message]
    );
    res.status(201).json({ message: 'Contact form submitted successfully', contact: result.rows[0] });
  } catch (err) {
    console.error('Error creating contact:', err.message);
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
});

module.exports = router;
