const express = require('express');
const { pool } = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/contacts - List all contacts (auth required)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = 'SELECT * FROM contacts';
    const conditions = [];
    const params = [];

    if (status && status !== 'all') {
      params.push(status);
      conditions.push(`status = $${params.length}`);
    }
    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(name ILIKE $${params.length} OR subject ILIKE $${params.length})`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY submitted_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching contacts:', err.message);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// GET /api/contacts/:id - Get single contact (auth required)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM contacts WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching contact:', err.message);
    res.status(500).json({ error: 'Failed to fetch contact' });
  }
});

// PATCH /api/contacts/:id/status - Update contact status (auth required)
router.patch('/:id/status', authenticateToken, async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['new', 'replied', 'archived'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
  }

  try {
    const result = await pool.query(
      'UPDATE contacts SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating contact:', err.message);
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

// DELETE /api/contacts/:id - Delete contact (auth required)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM contacts WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json({ message: 'Contact deleted' });
  } catch (err) {
    console.error('Error deleting contact:', err.message);
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

module.exports = router;
