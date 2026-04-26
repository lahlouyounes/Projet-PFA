const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');
const auth = require('../middleware/auth');

router.use(auth);
router.get('/projet/:projetId', logController.getLogsByProject);

module.exports = router;