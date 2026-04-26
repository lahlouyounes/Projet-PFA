const Log = require('../models/Log');
const Project = require('../models/Project');

// Récupérer les logs d'un projet (chef de projet seulement)
exports.getLogsByProject = async (req, res) => {
    try {
        const { projetId } = req.params;

        // Vérifier que c'est le chef du projet
        const project = await Project.findById(projetId);
        if (!project) {
            return res.status(404).json({ error: 'Projet non trouvé' });
        }

        const isCreator = project.createdBy.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';
        if (!isCreator && !isAdmin) {
            return res.status(403).json({ error: 'Accès refusé' });
        }
        const logs = await Log.find({ projetId })
            .populate('userId', 'name email avatar')
            .sort('-createdAt')
            .limit(100);

        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fonction utilitaire pour créer un log (appelée depuis les autres controllers)
exports.creerLog = async (action, userId, projetId, details) => {
    try {
        await Log.create({ action, userId, projetId, details });
    } catch (error) {
        console.error('Erreur log:', error.message);
    }
};