const { creerLog } = require('./logController');
const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');

exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            $or: [
                { createdBy: req.user._id },
                { membres: req.user._id }
            ]
        }).sort('-createdAt');
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('createdBy', 'name email avatar')
            .populate('membres', 'name email avatar');
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
        await creerLog('CREATE_PROJECT', req.user._id, project._id, `Projet "${project.nom}" créé`);
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
        await creerLog('UPDATE_PROJECT', req.user._id, project._id, `Projet "${project.nom}" modifié`);
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
        await creerLog('DELETE_PROJECT', req.user._id, req.params.id, `Projet supprimé`);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Inviter un membre par email
exports.inviterMembre = async (req, res) => {
    try {
        const { email } = req.body;
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ error: 'Projet non trouvé' });
        }

        // Vérifier que c'est le chef de projet
        if (project.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Seul le chef de projet peut inviter des membres' });
        }

        // Trouver l'utilisateur par email
        const User = require('../models/User');
        const userToInvite = await User.findOne({ email });

        if (!userToInvite) {
            return res.status(404).json({ error: 'Aucun utilisateur trouvé avec cet email' });
        }

        // Vérifier qu'il n'est pas déjà membre
        if (project.membres.includes(userToInvite._id)) {
            return res.status(400).json({ error: 'Cet utilisateur est déjà membre du projet' });
        }

        // Vérifier que c'est pas le créateur lui-même
        if (project.createdBy.toString() === userToInvite._id.toString()) {
            return res.status(400).json({ error: 'Le chef de projet est déjà dans le projet' });
        }

        project.membres.push(userToInvite._id);
        await project.save();

        res.json({ success: true, message: `${userToInvite.name} a été ajouté au projet` });
        await creerLog('INVITE_MEMBER', req.user._id, project._id, `${userToInvite.name} invité au projet`);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Supprimer un membre
exports.supprimerMembre = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ error: 'Projet non trouvé' });
        }

        // Vérifier que c'est le chef de projet
        if (project.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Seul le chef de projet peut supprimer des membres' });
        }

        project.membres = project.membres.filter(
            m => m.toString() !== req.params.membreId
        );
        await project.save();

        res.json({ success: true, message: 'Membre retiré du projet' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};