const db = require('../config/database');
const polarisService = require('../services/polarisService');
const bpaValidator = require('../services/bpaValidatorService');
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');

// SSE clients per project
const sseClients = new Map();

exports.start = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows: [project] } = await db.query(
      'SELECT * FROM projects WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );
    if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });

    // Validate all modules 1-6 complete
    const modules = project.modules || {};
    const missing = [1, 2, 3, 4, 5, 6].filter((i) => !modules[i]?.completed);
    if (missing.length > 0) {
      return res.status(400).json({ error: `Módulos incompletos: ${missing.join(', ')}` });
    }

    // BPA pre-generation validation
    const bpaConfig = {
      module1: modules[1]?.data || {},
      module2: modules[2]?.data || {},
      module3: modules[3]?.data || {},
      module4: modules[4]?.data || {},
      module6: modules[6]?.data || {},
    };
    const bpaViolations = bpaValidator.validateConfig(bpaConfig);
    const bpaErrors = bpaViolations.filter((v) => v.severity === 2);
    if (bpaErrors.length > 0) {
      return res.status(400).json({
        error: 'El modelo tiene errores de calidad (BPA) que deben corregirse antes de generar.',
        violations: bpaErrors,
      });
    }

    // Mark as generating
    await db.query(
      "UPDATE projects SET status = 'generating', updated_at = NOW() WHERE id = $1",
      [id]
    );

    res.json({ message: 'Generación iniciada', project_id: id });

    // Run async (fire and forget)
    polarisService.generate(project, (event) => {
      const clients = sseClients.get(id) || [];
      clients.forEach((client) => client.write(`data: ${JSON.stringify(event)}\n\n`));
    }).then(async () => {
      await db.query(
        "UPDATE projects SET status = 'completed', updated_at = NOW() WHERE id = $1",
        [id]
      );
    }).catch(async (err) => {
      console.error('Generation error:', err);
      // Notify frontend via SSE so the progress bar shows the error
      const errClients = sseClients.get(id) || [];
      errClients.forEach((c) => c.write(`data: ${JSON.stringify({ step: 'error', percent: 0, message: `Error: ${err.message}` })}\n\n`));
      await db.query(
        "UPDATE projects SET status = 'error', updated_at = NOW() WHERE id = $1",
        [id]
      );
    });
  } catch (err) {
    next(err);
  }
};

exports.getStatus = async (req, res, next) => {
  try {
    const { rows: [project] } = await db.query(
      'SELECT id, status, updated_at FROM projects WHERE id = $1 AND user_id = $2',
      [req.params.id, req.userId]
    );
    if (!project) return res.status(404).json({ error: 'Proyecto no encontrado' });
    res.json(project);
  } catch (err) {
    next(err);
  }
};

exports.stream = (req, res) => {
  const { id } = req.params;
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  if (!sseClients.has(id)) sseClients.set(id, []);
  sseClients.get(id).push(res);

  req.on('close', () => {
    const clients = sseClients.get(id) || [];
    sseClients.set(id, clients.filter((c) => c !== res));
  });
};

exports.download = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows: [project] } = await db.query(
      "SELECT * FROM projects WHERE id = $1 AND user_id = $2 AND status = 'completed'",
      [id, req.userId]
    );
    if (!project) return res.status(404).json({ error: 'Proyecto no disponible para descarga' });

    const projectDir = path.join(process.env.GENERATED_PROJECTS_PATH || '../GENERATED-PROJECTS', id);
    if (!fs.existsSync(projectDir)) return res.status(404).json({ error: 'Archivos no encontrados' });

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${project.name}.zip"`);

    const archive = archiver('zip', { zlib: { level: 9 } });

    archive.on('error', (err) => {
      console.error('Archiver error:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Error al comprimir archivos' });
      } else {
        res.destroy();
      }
    });

    archive.pipe(res);
    archive.directory(projectDir, false);
    await archive.finalize();
  } catch (err) {
    next(err);
  }
};
