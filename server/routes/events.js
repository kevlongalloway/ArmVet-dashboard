const express = require('express');
const { events } = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/events
router.get('/', authenticateToken, (req, res) => {
  try {
    const { type } = req.query;
    res.json(events.list({ type }));
  } catch (err) {
    console.error('Error fetching events:', err.message);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// GET /api/events/:id
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const row = events.get(req.params.id);
    if (!row) return res.status(404).json({ error: 'Event not found' });
    res.json(row);
  } catch (err) {
    console.error('Error fetching event:', err.message);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// POST /api/events
router.post('/', authenticateToken, (req, res) => {
  const { title, date, time, type, description } = req.body;

  if (!title || !date) {
    return res.status(400).json({ error: 'Title and date are required' });
  }

  try {
    const row = events.create({
      title,
      date,
      time: time || null,
      type: type || 'internal',
      description: description || null,
    });
    res.status(201).json(row);
  } catch (err) {
    console.error('Error creating event:', err.message);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// DELETE /api/events/:id
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const deleted = events.delete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Event not found' });
    res.json({ message: 'Event deleted' });
  } catch (err) {
    console.error('Error deleting event:', err.message);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

module.exports = router;
