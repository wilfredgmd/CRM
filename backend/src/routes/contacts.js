import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../database/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all contacts for user
router.get('/', authenticateToken, (req, res) => {
  const contacts = db.prepare(`
    SELECT * FROM contacts WHERE user_id = ?
    ORDER BY created_at DESC
  `).all(req.user.userId);
  res.json(contacts);
});

// Get single contact
router.get('/:id', authenticateToken, (req, res) => {
  const contact = db.prepare(`
    SELECT * FROM contacts WHERE id = ? AND user_id = ?
  `).get(req.params.id, req.user.userId);
  
  if (!contact) {
    return res.status(404).json({ error: 'Contact not found' });
  }
  res.json(contact);
});

// Create contact
router.post('/', authenticateToken, (req, res) => {
  const { name, email, phone, company, title, address, status, notes } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const contactId = uuidv4();
  const now = new Date().toISOString();
  
  db.prepare(`
    INSERT INTO contacts (id, user_id, name, email, phone, company, title, address, status, notes, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    contactId,
    req.user.userId,
    name,
    email,
    phone || null,
    company || null,
    title || null,
    address || null,
    status || 'Active',
    notes || null,
    now,
    now
  );

  const contact = db.prepare('SELECT * FROM contacts WHERE id = ?').get(contactId);
  res.status(201).json(contact);
});

// Update contact
router.put('/:id', authenticateToken, (req, res) => {
  const { name, email, phone, company, title, address, status, notes } = req.body;
  const now = new Date().toISOString();

  const result = db.prepare(`
    UPDATE contacts
    SET name = ?, email = ?, phone = ?, company = ?, title = ?, address = ?, status = ?, notes = ?, updated_at = ?
    WHERE id = ? AND user_id = ?
  `).run(
    name, email, phone, company, title, address, status, notes, now,
    req.params.id, req.user.userId
  );

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Contact not found' });
  }

  const contact = db.prepare('SELECT * FROM contacts WHERE id = ?').get(req.params.id);
  res.json(contact);
});

// Delete contact
router.delete('/:id', authenticateToken, (req, res) => {
  const result = db.prepare('DELETE FROM contacts WHERE id = ? AND user_id = ?').run(req.params.id, req.user.userId);
  
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Contact not found' });
  }
  
  res.json({ message: 'Contact deleted successfully' });
});

export default router;
