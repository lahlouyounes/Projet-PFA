const express = require('express');
const { getTasks, getTaskById, createTask, updateTask, moveTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.get('/', protect, getTasks);
router.get('/:id', protect, getTaskById);
router.post('/', protect, createTask);
router.put('/:id', protect, updateTask);
router.patch('/:id/move', protect, moveTask);
router.delete('/:id', protect, deleteTask);

module.exports = router;