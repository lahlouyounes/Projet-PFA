const express = require('express');
const { register, login, getProfil, updateProfil } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profil', protect, getProfil);
router.put('/profil', protect, updateProfil);

module.exports = router;