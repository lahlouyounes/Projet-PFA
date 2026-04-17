const Project = require('../models/Project');
const Task = require('../models/Task');

// READ - Récupérer tous les projets d'un utilisateur
const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            $or: [
                { proprietaire_id: req.user._id },
                { membres: req.user._id }
            ]
        }).populate('proprietaire_id', 'nom email');
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CREATE - Créer un projet
const createProject = async (req, res) => {
    try {
        const project = await Project.create({
            ...req.body,
            proprietaire_id: req.user._id,
            membres: [req.user._id]
        });
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// READ - Récupérer un projet par ID
const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('proprietaire_id', 'nom email')
            .populate('membres', 'nom email');
        if (!project) {
            return res.status(404).json({ message: 'Projet non trouvé' });
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE - Modifier un projet
const updateProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            { ...req.body },
            { new: true, runValidators: true }
        );
        if (!project) {
            return res.status(404).json({ message: 'Projet non trouvé' });
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE - Supprimer un projet
const deleteProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Projet non trouvé' });
        }
        // Supprimer toutes les tâches du projet
        await Task.deleteMany({ projet_id: req.params.id });
        res.json({ message: 'Projet supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getProjects, createProject, getProjectById, updateProject, deleteProject };