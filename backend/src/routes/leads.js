import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../database/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all leads for user
router.get('/', authenticateToken, (req, res) => {
  const leads = db.prepare(`
    SELECT * FROM leads WHERE user_id = ?
    ORDER BY created_at DESC
  `).all(req.user.userId);
  res.json(leads);
});

// Get single lead
router.get('/:id', authenticateToken, (req, res) => {
  const lead = db.prepare(`
    SELECT * FROM leads WHERE id = ? AND user_id = ?
  `).get(req.params.id, req.user.userId);
  
  if (!lead) {
    return res.status(404).json({ error: 'Lead not found' });
  }
  res.json(lead);
});

// Create lead
router.post('/', authenticateToken, (req, res) => {
  const { firstName, lastName, email, phone, company, title, source, value, status, notes } = req.body;
  
  if (!firstName || !lastName || !email) {
    return res.status(400).json({ error: 'First name, last name, and email are required' });
  }

  const leadId = uuidv4();
  const now = new Date().toISOString();
  
  db.prepare(`
    INSERT INTO leads (id, user_id, first_name, last_name, email, phone, company, title, source, value, status, notes, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    leadId,
    req.user.userId, 
    firstName,
    lastName,
    email,
    phone || null,
    company || null,
    title || null,
    source || null,
    value || 0,
    status || 'new',
    notes || null,
    now,
    now
  );

  // Create notification
  const notifId = uuidv4();
  db.prepare(`
    INSERT INTO notifications (id, user_id, type, title, message, icon, read, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    notifId,
    req.user.userId,
    'lead_added',
    'New Lead Added',
    `${firstName} ${lastName} from ${company || 'Unknown'} was added as a new lead.`,
    'UserPlus',
    0,
    now
  );

  const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(leadId);
  res.status(201).json(lead);
});

// Update lead
router.put('/:id', authenticateToken, (req, res) => {
  const { firstName, lastName, email, phone, company, title, source, value, status, notes } = req.body;
  const now = new Date().toISOString();

  const result = db.prepare(`
    UPDATE leads
    SET first_name = ?, last_name = ?, email = ?, phone = ?, company = ?, title = ?, 
        source = ?, value = ?, status = ?, notes = ?, updated_at = ?
    WHERE id = ? AND user_id = ?
  `).run(
    firstName, lastName, email, phone, company, title, source, value, status, notes, now,
    req.params.id, req.user.userId
  );

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Lead not found' });
  }

  const lead = db.prepare('SELECT * FROM leads WHERE id = ?').get(req.params.id);
  res.json(lead);
});

// Delete lead
router.delete('/:id', authenticateToken, (req, res) => {
  const result = db.prepare('DELETE FROM leads WHERE id = ? AND user_id = ?').run(req.params.id, req.user.userId);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Lead not found' });
  }

  res.json({ message: 'Lead deleted successfully' });
});

// Convert lead to contact + deal (Workflow Step 5)
router.post('/:id/convert', authenticateToken, (req, res) => {
  const lead = db.prepare('SELECT * FROM leads WHERE id = ? AND user_id = ?').get(req.params.id, req.user.userId);

  if (!lead) {
    return res.status(404).json({ error: 'Lead not found' });
  }

  const now = new Date().toISOString();
  const contactId = uuidv4();
  const dealId = uuidv4();

  // Start transaction
  const transaction = db.transaction(() => {
    // Create contact from lead
    db.prepare(`
      INSERT INTO contacts (id, user_id, name, email, phone, company, title, status, notes, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      contactId,
      req.user.userId,
      `${lead.first_name} ${lead.last_name}`,
      lead.email,
      lead.phone,
      lead.company,
      lead.title,
      'Active',
      `Converted from lead. ${lead.notes || ''}`,
      now,
      now
    );

    // Create deal from lead value
    if (lead.value > 0) {
      db.prepare(`
        INSERT INTO deals (id, user_id, name, contact_name, company, value, stage, probability, expected_close, notes, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        dealId,
        req.user.userId,
        `${lead.company || lead.first_name} Deal`,
        `${lead.first_name} ${lead.last_name}`,
        lead.company,
        lead.value,
        'Qualification',
        10,
        null,
        `Deal created from converted lead. Source: ${lead.source || 'Unknown'}`,
        now,
        now
      );
    }

    // Update lead status to converted
    db.prepare(`
      UPDATE leads SET status = 'converted', updated_at = ? WHERE id = ?
    `).run(now, req.params.id);

    // Create notification
    const notifId = uuidv4();
    db.prepare(`
      INSERT INTO notifications (id, user_id, type, title, message, icon, read, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      notifId,
      req.user.userId,
      'lead_converted',
      'Lead Converted',
      `${lead.first_name} ${lead.last_name} was converted to a contact${lead.value > 0 ? ' and deal' : ''}.`,
      'UserCheck',
      0,
      now
    );

    // Auto-create follow-up task (Workflow Step 6)
    const taskId = uuidv4();
    db.prepare(`
      INSERT INTO tasks (id, user_id, title, description, priority, status, due_date, assignee, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      taskId,
      req.user.userId,
      `Follow up with ${lead.first_name} ${lead.last_name}`,
      `New contact converted from lead. Schedule introduction call.`,
      'High',
      'Pending',
      'Tomorrow',
      req.user.name || 'Admin',
      now,
      now
    );
  });

  transaction();

  const contact = db.prepare('SELECT * FROM contacts WHERE id = ?').get(contactId);
  const deal = lead.value > 0 ? db.prepare('SELECT * FROM deals WHERE id = ?').get(dealId) : null;

  res.json({
    message: 'Lead converted successfully',
    contact,
    deal,
    taskCreated: true
  });
});

export default router;
