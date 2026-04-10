const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const projectController = require('../controllers/projectController');

router.use(auth);

router.get('/', projectController.list);
router.post('/', projectController.create);
router.get('/:id', projectController.get);
router.patch('/:id', projectController.update);
router.delete('/:id', projectController.remove);

module.exports = router;
