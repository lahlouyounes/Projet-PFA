const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ success: false, message: 'Non autorisé - Token manquant' });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            return res.status(401).json({ success: false, message: 'Utilisateur non trouvé' });
        }
        
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Token invalide ou expiré' });
    }
};

module.exports = auth;