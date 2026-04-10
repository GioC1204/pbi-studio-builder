'use strict';

const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/kpiTemplateController');
const authenticate = require('../middleware/auth');

// ── Admin guard middleware ─────────────────────────
const requireAdmin = async (req, res, next) => {
  try {
    const db = require('../config/database');
    const { rows } = await db.query('SELECT is_admin FROM users WHERE id = $1', [req.userId]);
    if (!rows[0]?.is_admin) {
      return res.status(403).json({ error: 'Acceso restringido a administradores.' });
    }
    next();
  } catch (err) {
    next(err);
  }
};

// Public — list approved templates (optionally filtered by sector)
router.get('/', authenticate, ctrl.list);

// Admin — full CRUD
router.get('/admin', authenticate, requireAdmin, ctrl.adminList);
router.post('/admin', authenticate, requireAdmin, ctrl.create);
router.put('/admin/:id', authenticate, requireAdmin, ctrl.update);
router.delete('/admin/:id', authenticate, requireAdmin, ctrl.remove);
router.patch('/admin/:id/approve', authenticate, requireAdmin, ctrl.toggleApprove);

module.exports = router;
