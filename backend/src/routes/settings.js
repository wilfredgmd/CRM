import express from 'express';
import db from '../database/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get settings for user
router.get('/', authenticateToken, (req, res) => {
  const settings = db.prepare('SELECT * FROM settings WHERE user_id = ?').get(req.user.userId);
  
  if (!settings) {
    // Create default settings if not exist
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO settings (user_id, company_name, user_name, user_email, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(req.user.userId, 'My CRM', req.user.name, req.user.email, now, now);
    
    const newSettings = db.prepare('SELECT * FROM settings WHERE user_id = ?').get(req.user.userId);
    return res.json(newSettings);
  }
  
  res.json(settings);
});

// Update settings
router.put('/', authenticateToken, (req, res) => {
  const {
    companyName, userName, userEmail, userTitle, userPhone,
    companyWebsite, companyAddress, currency, currencyCode,
    dateFormat, language, theme, notifications
  } = req.body;
  
  const now = new Date().toISOString();
  const notificationsJson = notifications ? JSON.stringify(notifications) : null;

  const result = db.prepare(`
    UPDATE settings
    SET company_name = ?, user_name = ?, user_email = ?, user_title = ?, user_phone = ?,
        company_website = ?, company_address = ?, currency = ?, currency_code = ?,
        date_format = ?, language = ?, theme = ?, notifications = ?, updated_at = ?
    WHERE user_id = ?
  `).run(
    companyName, userName, userEmail, userTitle, userPhone,
    companyWebsite, companyAddress, currency, currencyCode,
    dateFormat, language, theme, notificationsJson, now,
    req.user.userId
  );

  if (result.changes === 0) {
    // Create settings if not exist
    db.prepare(`
      INSERT INTO settings (user_id, company_name, user_name, user_email, currency, currency_code, 
                           date_format, language, theme, notifications, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      req.user.userId, companyName || 'My CRM', userName || req.user.name, userEmail || req.user.email,
      currency || '₹', currencyCode || 'INR', dateFormat || 'DD/MM/YYYY', language || 'en',
      theme || 'light', notificationsJson || '{"newLeads":true,"dealUpdates":true,"taskReminders":true,"emailAlerts":true}',
      now, now
    );
  }

  const settings = db.prepare('SELECT * FROM settings WHERE user_id = ?').get(req.user.userId);
  res.json(settings);
});

export default router;
