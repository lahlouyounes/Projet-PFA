const express = require('express');
const { getRoles, getRoleById, createRole, updateRole, deleteRole } = require('../controllers/roleController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.get('/', protect, getRoles);
router.get('/:id', protect, getRoleById);
router.post('/', protect, createRole);
router.put('/:id', protect, updateRole);
router.delete('/:id', protect, deleteRole);

module.exports = router;