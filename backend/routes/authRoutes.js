const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');


// ✅ Vérifiez que ces fonctions existent bien dans authController
router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/profil', auth, authController.getProfile);
router.put('/profil', auth, authController.updateProfile);
router.post('/change-password', auth, authController.changePassword);

module.exports = router;