import express from 'express';
import db from '../database/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get dashboard stats
router.get('/dashboard', authenticateToken, (req, res) => {
  const userId = req.user.userId;

  // Get counts
  const leadsCount = db.prepare('SELECT COUNT(*) as count FROM leads WHERE user_id = ?').get(userId).count;
  const contactsCount = db.prepare('SELECT COUNT(*) as count FROM contacts WHERE user_id = ?').get(userId).count;
  const dealsCount = db.prepare('SELECT COUNT(*) as count FROM deals WHERE user_id = ?').get(userId).count;
  const tasksCount = db.prepare('SELECT COUNT(*) as count FROM tasks WHERE user_id = ? AND status != ?').get(userId, 'Completed').count;

  // Pipeline value
  const pipelineResult = db.prepare(`
    SELECT SUM(value * probability / 100) as weighted, SUM(value) as total
    FROM deals WHERE user_id = ? AND stage NOT IN ('Closed Won', 'Closed Lost')
  `).get(userId);

  // Won revenue this month
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const wonRevenue = db.prepare(`
    SELECT SUM(value) as total FROM deals
    WHERE user_id = ? AND stage = 'Closed Won' AND updated_at >= ?
  `).get(userId, monthStart);

  // Deals by stage for pipeline
  const dealsByStage = db.prepare(`
    SELECT stage, COUNT(*) as count, SUM(value) as value
    FROM deals WHERE user_id = ?
    GROUP BY stage
  `).all(userId);

  // Recent activity (last 7 days)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const recentLeads = db.prepare(`
    SELECT id, first_name, last_name, company, created_at, 'lead_added' as type
    FROM leads WHERE user_id = ? AND created_at >= ?
    ORDER BY created_at DESC LIMIT 5
  `).all(userId, sevenDaysAgo);

  const recentDeals = db.prepare(`
    SELECT id, name, company, stage, value, updated_at, 'deal_updated' as type
    FROM deals WHERE user_id = ? AND updated_at >= ?
    ORDER BY updated_at DESC LIMIT 5
  `).all(userId, sevenDaysAgo);

  // Conversion rate (leads to contacts/deals)
  const convertedLeads = db.prepare(`
    SELECT COUNT(*) as count FROM leads WHERE user_id = ? AND status = 'converted'
  `).get(userId).count;

  const conversionRate = leadsCount > 0 ? Math.round((convertedLeads / leadsCount) * 100) : 0;

  // Average deal size
  const avgDealSize = db.prepare(`
    SELECT AVG(value) as avg FROM deals WHERE user_id = ? AND value > 0
  `).get(userId).avg || 0;

  res.json({
    counts: {
      leads: leadsCount,
      contacts: contactsCount,
      deals: dealsCount,
      pendingTasks: tasksCount,
    },
    pipeline: {
      total: pipelineResult.total || 0,
      weighted: Math.round(pipelineResult.weighted || 0),
      dealsByStage,
    },
    revenue: {
      wonThisMonth: wonRevenue.total || 0,
      averageDealSize: Math.round(avgDealSize),
    },
    conversionRate,
    recentActivity: {
      leads: recentLeads,
      deals: recentDeals,
    },
  });
});

export default router;
