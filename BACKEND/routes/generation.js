const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const generationController = require('../controllers/generationController');

router.use(auth);

router.post('/:id/generate', generationController.start);
router.get('/:id/status', generationController.getStatus);
router.get('/:id/status/stream', generationController.stream);
router.get('/:id/download', generationController.download);

module.exports = router;
