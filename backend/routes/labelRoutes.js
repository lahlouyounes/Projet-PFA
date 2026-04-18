const express = require('express');
const router = express.Router();
const labelController = require('../controllers/labelController');
const auth = require('../middleware/auth');

router.use(auth);
router.get('/', labelController.getLabels);
router.get('/:id', labelController.getLabelById);
router.post('/', labelController.createLabel);
router.put('/:id', labelController.updateLabel);
router.delete('/:id', labelController.deleteLabel);

module.exports = router;