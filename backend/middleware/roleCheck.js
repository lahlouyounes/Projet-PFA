const checkPermission = (resource, action) => {
    return async (req, res, next) => {
        try {
            const Role = require('../models/Role');
            const role = await Role.findOne({ nom: req.user.role });            
            if (!role) {
                return res.status(403).json({ message: 'Rôle non trouvé' });
            }
            
            const hasPermission = role.permissions.includes('*') ||
                role.permissions.includes(permission);
            
            if (!hasPermission && req.user.role !== 'admin') {
                return res.status(403).json({ message: `Permission refusée: ${action} sur ${resource}` });
            }
            
            next();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
};

const checkRole = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Rôle insuffisant' });
        }
        next();
    };
};

module.exports = { checkPermission, checkRole };