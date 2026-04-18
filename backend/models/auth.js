const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
        return res.status(401).json({ message: 'Non autorisé - Token manquant' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
        req.user = await User.findById(decoded.id).select('-password');
        
        if (!req.user) {
            return res.status(401).json({ message: 'Utilisateur non trouvé' });
        }
        
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token invalide' });
    }
};

const verifierPermission = (permission) => {
    return async (req, res, next) => {
        if (req.user.role === 'admin') return next();
        
        if (req.user.role === 'chef_projet' && ['createProjects', 'manageMembers', 'assignTasks'].includes(permission)) {
            return next();
        }
        
        if (req.user.role === 'membre' && permission === 'assignTasks') {
            return next();
        }
        
        res.status(403).json({ message: `Permission refusée: ${permission}` });
    };
};

module.exports = { protect, verifierPermission };