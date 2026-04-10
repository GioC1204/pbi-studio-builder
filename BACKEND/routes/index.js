const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const projectRoutes = require('./projects');
const moduleRoutes = require('./modules');
const generationRoutes = require('./generation');
const kpiTemplateRoutes = require('./kpiTemplates');

router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/projects', moduleRoutes);
router.use('/projects', generationRoutes);
router.use('/kpi-templates', kpiTemplateRoutes);

router.get('/health', (req, res) => res.json({ status: 'ok' }));

module.exports = router;
