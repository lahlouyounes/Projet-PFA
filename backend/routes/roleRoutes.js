const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const auth = require('../middleware/auth');

router.use(auth);
router.get('/', roleController.getRoles);
router.get('/:id', roleController.getRoleById);
router.post('/', roleController.createRole);
router.put('/:id', roleController.updateRole);
router.delete('/:id', roleController.deleteRole);

module.exports = router;