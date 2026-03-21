const express = require('express');
const { bookings, contacts } = require('../db');

const router = express.Router();

// POST /api/public/bookings - Submit a booking from the public ArmVet site
router.post('/bookings', (req, res) => {
  const { name, email, phone, org, service, category, date, time, message } = req.body;

  if (!name || !email || !service || !category || !date || !time) {
    return res.status(400).json({
      error: 'Required fields: name, email, service, category, date, time',
    });
  }

  try {
    const booking = bookings.create({
      name,
      email,
      phone: phone || null,
      org: org || null,
      service,
      category,
      date,
      time,
      message: message || null,
    });
    res.status(201).json({ message: 'Booking submitted successfully', booking });
  } catch (err) {
    console.error('Error creating booking:', err.message);
    res.status(500).json({ error: 'Failed to submit booking' });
  }
});

// POST /api/public/contacts - Submit a contact form from the public ArmVet site
router.post('/contacts', (req, res) => {
  const { name, email, phone, category, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      error: 'Required fields: name, email, subject, message',
    });
  }

  try {
    const contact = contacts.create({
      name,
      email,
      phone: phone || null,
      category: category || null,
      subject,
      message,
    });
    res.status(201).json({ message: 'Contact form submitted successfully', contact });
  } catch (err) {
    console.error('Error creating contact:', err.message);
    res.status(500).json({ error: 'Failed to submit contact form' });
  }
});

module.exports = router;
