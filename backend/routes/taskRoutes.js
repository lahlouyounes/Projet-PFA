const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');

router.use(auth);
router.get('/', taskController.getTasks);
router.get('/:id', taskController.getTaskById);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.patch('/:id/status', taskController.updateTaskStatus);
router.delete('/:id', taskController.deleteTask);

module.exports = router;