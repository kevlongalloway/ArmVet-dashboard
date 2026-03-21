const express = require('express');
const { pool } = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/events - List all events (auth required)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { type } = req.query;
    let query = 'SELECT * FROM events';
    const params = [];

    if (type && type !== 'all') {
      params.push(type);
      query += ` WHERE type = $1`;
    }
    query += ' ORDER BY date ASC, time ASC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching events:', err.message);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// GET /api/events/:id - Get single event (auth required)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching event:', err.message);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// POST /api/events - Create event (auth required)
router.post('/', authenticateToken, async (req, res) => {
  const { title, date, time, type, description } = req.body;

  if (!title || !date) {
    return res.status(400).json({ error: 'Title and date are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO events (title, date, time, type, description)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [title, date, time || null, type || 'internal', description || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating event:', err.message);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// DELETE /api/events/:id - Delete event (auth required)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM events WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Event deleted' });
  } catch (err) {
    console.error('Error deleting event:', err.message);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

module.exports = router;
