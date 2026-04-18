const Project = require('../models/Project');

exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find().sort('-createdAt');
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ error: 'Projet non trouvé' });
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createProject = async (req, res) => {
    try {
        const project = await Project.create({ ...req.body, createdBy: req.user._id });
        res.status(201).json(project);
    } catch (error) {
        console.error('Erreur création:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = {
            nom: req.body.nom,
            description: req.body.description,
            statut: req.body.statut,
            avancement: req.body.avancement,
            dateFin: req.body.dateFin,
            updatedAt: Date.now()
        };
        
        const project = await Project.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        
        if (!project) {
            return res.status(404).json({ error: 'Projet non trouvé' });
        }
        
        console.log('✅ Projet modifié:', project.nom);
        res.json(project);
    } catch (error) {
        console.error('Erreur modification:', error);
        res.status(500).json({ error: error.message });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) return res.status(404).json({ error: 'Projet non trouvé' });
        // Supprimer les tâches associées
        await Task.deleteMany({ projetId: req.params.id });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};