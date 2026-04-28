import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../database/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all deals for user
router.get('/', authenticateToken, (req, res) => {
  const deals = db.prepare(`
    SELECT * FROM deals WHERE user_id = ?
    ORDER BY created_at DESC
  `).all(req.user.userId);
  res.json(deals);
});

// Get single deal
router.get('/:id', authenticateToken, (req, res) => {
  const deal = db.prepare(`
    SELECT * FROM deals WHERE id = ? AND user_id = ?
  `).get(req.params.id, req.user.userId);
  
  if (!deal) {
    return res.status(404).json({ error: 'Deal not found' });
  }
  res.json(deal);
});

// Create deal
router.post('/', authenticateToken, (req, res) => {
  const { name, contactName, company, value, stage, probability, expectedClose, notes } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Deal name is required' });
  }

  const dealId = uuidv4();
  const now = new Date().toISOString();
  
  db.prepare(`
    INSERT INTO deals (id, user_id, name, contact_name, company, value, stage, probability, expected_close, notes, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    dealId,
    req.user.userId,
    name,
    contactName || null,
    company || null,
    value || 0,
    stage || 'Qualification',
    probability || 10,
    expectedClose || null,
    notes || null,
    now,
    now
  );

  const deal = db.prepare('SELECT * FROM deals WHERE id = ?').get(dealId);
  res.status(201).json(deal);
});

// Update deal with workflow automation
router.put('/:id', authenticateToken, (req, res) => {
  const { name, contactName, company, value, stage, probability, expectedClose, notes } = req.body;
  const now = new Date().toISOString();

  // Get current deal to check for stage change
  const currentDeal = db.prepare('SELECT * FROM deals WHERE id = ? AND user_id = ?').get(req.params.id, req.user.userId);

  if (!currentDeal) {
    return res.status(404).json({ error: 'Deal not found' });
  }

  const result = db.prepare(`
    UPDATE deals
    SET name = ?, contact_name = ?, company = ?, value = ?, stage = ?, probability = ?,
        expected_close = ?, notes = ?, updated_at = ?
    WHERE id = ? AND user_id = ?
  `).run(
    name || currentDeal.name,
    contactName || currentDeal.contact_name,
    company || currentDeal.company,
    value !== undefined ? value : currentDeal.value,
    stage || currentDeal.stage,
    probability !== undefined ? probability : currentDeal.probability,
    expectedClose !== undefined ? expectedClose : currentDeal.expected_close,
    notes !== undefined ? notes : currentDeal.notes,
    now,
    req.params.id,
    req.user.userId
  );

  // Workflow: Auto-create tasks based on stage changes (Step 6)
  const stageChangeTasks = {
    'Qualification': { title: 'Qualify the opportunity', desc: 'BANT assessment required', priority: 'Medium' },
    'Proposal': { title: 'Send proposal to client', desc: 'Prepare and send formal proposal', priority: 'High' },
    'Negotiation': { title: 'Negotiation follow-up', desc: 'Address client concerns and finalize terms', priority: 'High' },
    'Closed Won': { title: 'Kickoff onboarding', desc: 'Start customer onboarding process', priority: 'High' },
    'Closed Lost': { title: 'Lost deal analysis', desc: 'Document reasons and lessons learned', priority: 'Low' }
  };

  // Check if stage changed
  if (stage && stage !== currentDeal.stage && stageChangeTasks[stage]) {
    const taskConfig = stageChangeTasks[stage];
    const taskId = uuidv4();

    db.prepare(`
      INSERT INTO tasks (id, user_id, title, description, priority, status, due_date, assignee, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      taskId,
      req.user.userId,
      `${taskConfig.title} - ${name || currentDeal.name}`,
      `${taskConfig.desc} for ${contactName || currentDeal.contact_name} at ${company || currentDeal.company}`,
      taskConfig.priority,
      'Pending',
      stage === 'Closed Won' ? 'Today' : 'Tomorrow',
      req.user.name || 'Admin',
      now,
      now
    );

    // Create notification for stage change
    const notifId = uuidv4();
    db.prepare(`
      INSERT INTO notifications (id, user_id, type, title, message, icon, read, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      notifId,
      req.user.userId,
      'deal_stage_change',
      'Deal Stage Updated',
      `${name || currentDeal.name} moved to ${stage}. Follow-up task created.`,
      'TrendingUp',
      0,
      now
    );
  }

  // Workflow: When deal is won, create additional tasks (Step 7)
  if (stage === 'Closed Won' && currentDeal.stage !== 'Closed Won') {
    // Create onboarding task
    const onboardingTaskId = uuidv4();
    db.prepare(`
      INSERT INTO tasks (id, user_id, title, description, priority, status, due_date, assignee, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      onboardingTaskId,
      req.user.userId,
      `Onboarding: ${company || currentDeal.company}`,
      `Schedule kickoff meeting and send welcome package`,
      'High',
      'Pending',
      'Today',
      req.user.name || 'Admin',
      now,
      now
    );

    // Create renewal reminder task (Step 8 - 11 months out)
    const renewalTaskId = uuidv4();
    const elevenMonthsLater = new Date();
    elevenMonthsLater.setMonth(elevenMonthsLater.getMonth() + 11);

    db.prepare(`
      INSERT INTO tasks (id, user_id, title, description, priority, status, due_date, assignee, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      renewalTaskId,
      req.user.userId,
      `Contract renewal: ${company || currentDeal.company}`,
      `Check renewal status and prepare renewal proposal`,
      'Medium',
      'Pending',
      elevenMonthsLater.toISOString().split('T')[0],
      req.user.name || 'Admin',
      now,
      now
    );
  }

  const deal = db.prepare('SELECT * FROM deals WHERE id = ?').get(req.params.id);
  res.json(deal);
});

// Delete deal
router.delete('/:id', authenticateToken, (req, res) => {
  const result = db.prepare('DELETE FROM deals WHERE id = ? AND user_id = ?').run(req.params.id, req.user.userId);
  
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Deal not found' });
  }
  
  res.json({ message: 'Deal deleted successfully' });
});

export default router;
