'use strict';

const db = require('../config/database');

// ── Public ────────────────────────────────────────

/**
 * GET /kpi-templates?sector=retail
 * Returns approved templates, optionally filtered by sector.
 */
exports.list = async (req, res, next) => {
  try {
    const { sector } = req.query;
    const validSectors = ['retail', 'finanzas', 'logistica'];

    let query = 'SELECT id, sector, name, description_template, format, default_target, aggregation, keywords FROM kpi_templates WHERE is_approved = true';
    const params = [];

    if (sector && validSectors.includes(sector)) {
      query += ' AND sector = $1';
      params.push(sector);
    }

    query += ' ORDER BY sector, name';
    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

// ── Admin ─────────────────────────────────────────

/**
 * GET /admin/kpi-templates
 * Returns all templates (approved and pending), for admin management.
 */
exports.adminList = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM kpi_templates ORDER BY sector, created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /admin/kpi-templates
 * Create a new template.
 */
exports.create = async (req, res, next) => {
  try {
    const { sector, name, description_template, format, default_target, aggregation, keywords } = req.body;

    if (!sector || !name || !description_template || !format) {
      return res.status(400).json({ error: 'sector, name, description_template y format son requeridos.' });
    }

    const validSectors = ['retail', 'finanzas', 'logistica'];
    if (!validSectors.includes(sector)) {
      return res.status(400).json({ error: `sector debe ser uno de: ${validSectors.join(', ')}` });
    }

    const { rows } = await db.query(
      `INSERT INTO kpi_templates (sector, name, description_template, format, default_target, aggregation, keywords, is_approved, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, true, $8)
       RETURNING *`,
      [sector, name, description_template, format, default_target || null, aggregation || 'SUM', keywords || [], req.userId]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /admin/kpi-templates/:id
 * Update an existing template.
 */
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { sector, name, description_template, format, default_target, aggregation, keywords } = req.body;

    const { rows } = await db.query(
      `UPDATE kpi_templates
       SET sector = COALESCE($1, sector),
           name = COALESCE($2, name),
           description_template = COALESCE($3, description_template),
           format = COALESCE($4, format),
           default_target = COALESCE($5, default_target),
           aggregation = COALESCE($6, aggregation),
           keywords = COALESCE($7, keywords)
       WHERE id = $8
       RETURNING *`,
      [sector, name, description_template, format, default_target, aggregation, keywords, id]
    );

    if (!rows[0]) return res.status(404).json({ error: 'Template no encontrado.' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /admin/kpi-templates/:id
 */
exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rowCount } = await db.query('DELETE FROM kpi_templates WHERE id = $1', [id]);
    if (rowCount === 0) return res.status(404).json({ error: 'Template no encontrado.' });
    res.json({ message: 'Template eliminado.' });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /admin/kpi-templates/:id/approve
 * Toggle is_approved for a template.
 */
exports.toggleApprove = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(
      'UPDATE kpi_templates SET is_approved = NOT is_approved WHERE id = $1 RETURNING id, name, is_approved',
      [id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Template no encontrado.' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};
