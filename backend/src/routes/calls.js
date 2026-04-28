import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../database/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all calls for user
router.get('/', authenticateToken, (req, res) => {
  const calls = db.prepare(`
    SELECT * FROM calls WHERE user_id = ?
    ORDER BY created_at DESC
  `).all(req.user.userId);
  res.json(calls);
});

// Get single call
router.get('/:id', authenticateToken, (req, res) => {
  const call = db.prepare(`
    SELECT * FROM calls WHERE id = ? AND user_id = ?
  `).get(req.params.id, req.user.userId);
  
  if (!call) {
    return res.status(404).json({ error: 'Call not found' });
  }
  res.json(call);
});

// Create call
router.post('/', authenticateToken, (req, res) => {
  const { contactName, phone, company, scheduledTime, date, type, duration, status, outcome, notes } = req.body;
  
  if (!contactName || !phone) {
    return res.status(400).json({ error: 'Contact name and phone are required' });
  }

  const callId = uuidv4();
  const now = new Date().toISOString();
  
  db.prepare(`
    INSERT INTO calls (id, user_id, contact_name, phone, company, scheduled_time, date, type, duration, status, outcome, notes, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    callId,
    req.user.userId,
    contactName,
    phone,
    company || null,
    scheduledTime || null,
    date || now.split('T')[0],
    type || 'phone',
    duration || 30,
    status || 'scheduled',
    outcome || null,
    notes || null,
    now,
    now
  );

  const call = db.prepare('SELECT * FROM calls WHERE id = ?').get(callId);
  res.status(201).json(call);
});

// Update call
router.put('/:id', authenticateToken, (req, res) => {
  const { contactName, phone, company, scheduledTime, date, type, duration, status, outcome, notes } = req.body;
  const now = new Date().toISOString();

  const result = db.prepare(`
    UPDATE calls
    SET contact_name = ?, phone = ?, company = ?, scheduled_time = ?, date = ?, type = ?, 
        duration = ?, status = ?, outcome = ?, notes = ?, updated_at = ?
    WHERE id = ? AND user_id = ?
  `).run(
    contactName, phone, company, scheduledTime, date, type, duration, status, outcome, notes, now,
    req.params.id, req.user.userId
  );

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Call not found' });
  }

  const call = db.prepare('SELECT * FROM calls WHERE id = ?').get(req.params.id);
  res.json(call);
});

// Delete call
router.delete('/:id', authenticateToken, (req, res) => {
  const result = db.prepare('DELETE FROM calls WHERE id = ? AND user_id = ?').run(req.params.id, req.user.userId);
  
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Call not found' });
  }
  
  res.json({ message: 'Call deleted successfully' });
});

export default router;
