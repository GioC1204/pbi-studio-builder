const db = require('../config/database');

exports.list = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'SELECT id, name, status, created_at, updated_at FROM projects WHERE user_id = $1 ORDER BY updated_at DESC',
      [req.userId]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { rows } = await db.query(
      `INSERT INTO projects (user_id, name, status, modules)
       VALUES ($1, $2, 'draft', $3)
       RETURNING *`,
      [req.userId, name || 'Nuevo Proyecto', JSON.stringify({
        1: { completed: false, data: {} },
        2: { completed: false, data: {} },
        3: { completed: false, data: {} },
        4: { completed: false, data: {} },
        5: { completed: false, data: {} },
        6: { completed: false, data: {} },
      })]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
      [req.params.id, req.userId]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Proyecto no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { rows } = await db.query(
      'UPDATE projects SET name = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3 RETURNING *',
      [name, req.params.id, req.userId]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Proyecto no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await db.query('DELETE FROM projects WHERE id = $1 AND user_id = $2', [req.params.id, req.userId]);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
