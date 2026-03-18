const express = require('express');
const { pool } = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/bookings - List all bookings (auth required)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, category, search } = req.query;
    let query = 'SELECT * FROM bookings';
    const conditions = [];
    const params = [];

    if (status && status !== 'all') {
      params.push(status);
      conditions.push(`status = $${params.length}`);
    }
    if (category && category !== 'all') {
      params.push(category);
      conditions.push(`category = $${params.length}`);
    }
    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(name ILIKE $${params.length} OR service ILIKE $${params.length} OR org ILIKE $${params.length})`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY submitted_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching bookings:', err.message);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// GET /api/bookings/:id - Get single booking (auth required)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM bookings WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching booking:', err.message);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// PATCH /api/bookings/:id/status - Update booking status (auth required)
router.patch('/:id/status', authenticateToken, async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'approved', 'declined', 'on-calendar'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
  }

  try {
    const result = await pool.query(
      'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating booking:', err.message);
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

// DELETE /api/bookings/:id - Delete booking (auth required)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM bookings WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json({ message: 'Booking deleted' });
  } catch (err) {
    console.error('Error deleting booking:', err.message);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

module.exports = router;
