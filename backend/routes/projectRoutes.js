const express = require('express');
const { getProjects, createProject, getProjectById, updateProject, deleteProject } = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.get('/', protect, getProjects);
router.get('/:id', protect, getProjectById);
router.post('/', protect, createProject);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);

module.exports = router;