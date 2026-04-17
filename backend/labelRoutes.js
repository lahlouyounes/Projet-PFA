const express = require('express');
const { getLabels, getLabelById, createLabel, updateLabel, deleteLabel } = require('../controllers/labelController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.get('/', protect, getLabels);
router.get('/:id', protect, getLabelById);
router.post('/', protect, createLabel);
router.put('/:id', protect, updateLabel);
router.delete('/:id', protect, deleteLabel);

module.exports = router;