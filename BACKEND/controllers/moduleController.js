const db = require('../config/database');

exports.save = async (req, res, next) => {
  try {
    const { projectId, moduleNum } = req.params;
    const num = parseInt(moduleNum, 10);
    if (num < 1 || num > 6) return res.status(400).json({ error: 'Módulo inválido (1-6)' });

    // Verify ownership
    const { rows: [project] } = await db.query(
      'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
      [projectId, req.userId]
    );
    if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });

    // Update module in JSONB
    const modules = project.modules || {};
    modules[num] = { completed: true, data: req.body.data };

    const { rows: [updated] } = await db.query(
      'UPDATE projects SET modules = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [JSON.stringify(modules), projectId]
    );

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    const { projectId, moduleNum } = req.params;
    const { rows: [project] } = await db.query(
      'SELECT modules FROM projects WHERE id = $1 AND user_id = $2',
      [projectId, req.userId]
    );
    if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });
    res.json(project.modules?.[parseInt(moduleNum, 10)] || { completed: false, data: {} });
  } catch (err) {
    next(err);
  }
};
