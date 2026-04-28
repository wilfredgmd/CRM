import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../database/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all tasks for user
router.get('/', authenticateToken, (req, res) => {
  const tasks = db.prepare(`
    SELECT * FROM tasks WHERE user_id = ?
    ORDER BY created_at DESC
  `).all(req.user.userId);
  res.json(tasks);
});

// Get single task
router.get('/:id', authenticateToken, (req, res) => {
  const task = db.prepare(`
    SELECT * FROM tasks WHERE id = ? AND user_id = ?
  `).get(req.params.id, req.user.userId);
  
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(task);
});

// Create task
router.post('/', authenticateToken, (req, res) => {
  const { title, description, priority, status, dueDate, assignee } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Task title is required' });
  }

  const taskId = uuidv4();
  const now = new Date().toISOString();
  
  db.prepare(`
    INSERT INTO tasks (id, user_id, title, description, priority, status, due_date, assignee, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    taskId,
    req.user.userId,
    title,
    description || null,
    priority || 'Medium',
    status || 'Pending',
    dueDate || null,
    assignee || null,
    now,
    now
  );

  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
  res.status(201).json(task);
});

// Update task
router.put('/:id', authenticateToken, (req, res) => {
  const { title, description, priority, status, dueDate, assignee } = req.body;
  const now = new Date().toISOString();

  const result = db.prepare(`
    UPDATE tasks
    SET title = ?, description = ?, priority = ?, status = ?, due_date = ?, assignee = ?, updated_at = ?
    WHERE id = ? AND user_id = ?
  `).run(
    title, description, priority, status, dueDate, assignee, now,
    req.params.id, req.user.userId
  );

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  res.json(task);
});

// Delete task
router.delete('/:id', authenticateToken, (req, res) => {
  const result = db.prepare('DELETE FROM tasks WHERE id = ? AND user_id = ?').run(req.params.id, req.user.userId);
  
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  res.json({ message: 'Task deleted successfully' });
});

export default router;
