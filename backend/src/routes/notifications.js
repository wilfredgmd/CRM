import express from 'express';
import db from '../database/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all notifications for user
router.get('/', authenticateToken, (req, res) => {
  const notifications = db.prepare(`
    SELECT * FROM notifications WHERE user_id = ?
    ORDER BY created_at DESC
    LIMIT 50
  `).all(req.user.userId);
  res.json(notifications);
});

// Get unread count
router.get('/unread/count', authenticateToken, (req, res) => {
  const count = db.prepare(`
    SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND read = 0
  `).get(req.user.userId);
  res.json({ count: count.count });
});

// Mark notification as read
router.put('/:id/read', authenticateToken, (req, res) => {
  const result = db.prepare(`
    UPDATE notifications SET read = 1 WHERE id = ? AND user_id = ?
  `).run(req.params.id, req.user.userId);
  
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Notification not found' });
  }
  
  res.json({ message: 'Notification marked as read' });
});

// Mark all notifications as read
router.put('/read-all', authenticateToken, (req, res) => {
  db.prepare(`
    UPDATE notifications SET read = 1 WHERE user_id = ?
  `).run(req.user.userId);
  
  res.json({ message: 'All notifications marked as read' });
});

// Delete notification
router.delete('/:id', authenticateToken, (req, res) => {
  const result = db.prepare('DELETE FROM notifications WHERE id = ? AND user_id = ?').run(req.params.id, req.user.userId);
  
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Notification not found' });
  }
  
  res.json({ message: 'Notification deleted' });
});

// Clear all notifications
router.delete('/', authenticateToken, (req, res) => {
  db.prepare('DELETE FROM notifications WHERE user_id = ?').run(req.user.userId);
  res.json({ message: 'All notifications cleared' });
});

export default router;
