const express = require('express');
const { contacts } = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/contacts
router.get('/', authenticateToken, (req, res) => {
  try {
    const { status, search } = req.query;
    res.json(contacts.list({ status, search }));
  } catch (err) {
    console.error('Error fetching contacts:', err.message);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// GET /api/contacts/:id
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const row = contacts.get(req.params.id);
    if (!row) return res.status(404).json({ error: 'Contact not found' });
    res.json(row);
  } catch (err) {
    console.error('Error fetching contact:', err.message);
    res.status(500).json({ error: 'Failed to fetch contact' });
  }
});

// PATCH /api/contacts/:id/status
router.patch('/:id/status', authenticateToken, (req, res) => {
  const { status } = req.body;
  const validStatuses = ['new', 'replied', 'archived'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` });
  }

  try {
    const row = contacts.updateStatus(req.params.id, status);
    if (!row) return res.status(404).json({ error: 'Contact not found' });
    res.json(row);
  } catch (err) {
    console.error('Error updating contact:', err.message);
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

// DELETE /api/contacts/:id
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const deleted = contacts.delete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Contact not found' });
    res.json({ message: 'Contact deleted' });
  } catch (err) {
    console.error('Error deleting contact:', err.message);
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

module.exports = router;
