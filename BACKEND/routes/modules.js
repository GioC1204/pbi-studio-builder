const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const moduleController = require('../controllers/moduleController');
const cloudConnector = require('../services/cloudConnectorService');
const db = require('../config/database');

router.use(auth);

// Save module data (1-6)
router.post('/:projectId/modules/:moduleNum', moduleController.save);
router.get('/:projectId/modules/:moduleNum', moduleController.get);

// Cloud connection test for Module 1
router.post('/:projectId/modules/1/test-connection', async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { type, credentials } = req.body;

    if (!type || !credentials) {
      return res.status(400).json({ error: 'type y credentials son requeridos.' });
    }

    const validTypes = ['s3', 'postgres', 'mysql', 'sqlserver'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: `type debe ser: ${validTypes.join(', ')}` });
    }

    // Verify project belongs to user
    const { rows: [project] } = await db.query(
      'SELECT id FROM projects WHERE id = $1 AND user_id = $2',
      [projectId, req.userId]
    );
    if (!project) return res.status(404).json({ error: 'Proyecto no encontrado.' });

    // Test connection and get schema
    const result = await cloudConnector.connect(type, credentials);

    // Encrypt and save credentials to project
    const encrypted = cloudConnector.encrypt({ type, ...credentials });
    await db.query(
      'UPDATE projects SET connection_config = $1, updated_at = NOW() WHERE id = $2',
      [JSON.stringify(encrypted), projectId]
    );

    res.json({
      success: true,
      tables: result.tables,
      message: `Conexión exitosa. ${result.tables.length} tabla(s) detectada(s).`,
    });
  } catch (err) {
    const msg = err.message || 'Error de conexión.';
    res.status(400).json({ error: `Error de conexión: ${msg}` });
  }
});

module.exports = router;
