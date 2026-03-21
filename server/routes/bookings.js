const express = require('express');
const { bookings } = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/bookings
router.get('/', authenticateToken, (req, res) => {
  try {
    const { status, category, search } = req.query;
    res.json(bookings.list({ status, category, search }));
  } catch (err) {
    console.error('Error fetching bookings:', err.message);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// GET /api/bookings/:id
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const row = bookings.get(req.params.id);
    if (!row) return res.status(404).json({ error: 'Booking not found' });
    res.json(row);
  } catch (err) {
    console.error('Error fetching booking:', err.message);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// PATCH /api/bookings/:id/status
router.patch('/:id/status', authenticateToken, (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'approved', 'declined', 'on-calendar'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
  }

  try {
    const row = bookings.updateStatus(req.params.id, status);
    if (!row) return res.status(404).json({ error: 'Booking not found' });
    res.json(row);
  } catch (err) {
    console.error('Error updating booking:', err.message);
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

// DELETE /api/bookings/:id
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const deleted = bookings.delete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Booking not found' });
    res.json({ message: 'Booking deleted' });
  } catch (err) {
    console.error('Error deleting booking:', err.message);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

module.exports = router;
