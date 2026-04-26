const Task = require('../models/Task');
const { creerLog } = require('./logController');
const { estimerDureeTache } = require('../services/aiService');

exports.getTasks = async (req, res) => {
    try {
        const { projetId, assigne, label, echeanceAvant } = req.query;
        const filter = {};

        if (projetId) filter.projetId = projetId;
        if (assigne) filter.assigne = assigne;
        if (label) filter.labels = label;
        if (echeanceAvant) filter.echeance = { $lte: new Date(echeanceAvant) };

        const tasks = await Task.find(filter).sort('-createdAt');
        
        // Populate manuel pour éviter les erreurs sur anciennes données
        const populated = await Promise.all(tasks.map(async (task) => {
            const t = task.toObject();
            try {
                if (t.assigne && typeof t.assigne === 'object') {
                    const User = require('../models/User');
                    const user = await User.findById(t.assigne).select('name email avatar');
                    t.assigne = user || null;
                } else {
                    t.assigne = null;
                }
            } catch(e) {
                t.assigne = null;
            }
            return t;
        }));

        res.json(populated);
    } catch (error) {
        console.error('Erreur getTasks:', error.message);
        res.status(500).json({ error: error.message });
    }
};

exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ error: 'Tâche non trouvée' });
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createTask = async (req, res) => {
    try {
        const taskData = {
            titre: req.body.titre,
            description: req.body.description || '',
            status: req.body.status || 'todo',
            priorite: req.body.priorite || 'medium',
            projetId: req.body.projetId || null,
            echeance: req.body.echeance || null,
            labels: req.body.labels || [],
            assigne: req.body.assigne && req.body.assigne !== ''
                ? req.body.assigne
                : null
        };

        const task = await Task.create(taskData);
        await creerLog('CREATE_TASK', req.user._id, task.projetId, `Tâche "${task.titre}" créée`);
        res.status(201).json(task);
    } catch (error) {
        console.error('Erreur createTask:', error.message);
        res.status(500).json({ error: error.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const updateData = {
            titre: req.body.titre,
            description: req.body.description || '',
            status: req.body.status || 'todo',
            priorite: req.body.priorite || 'medium',
            projetId: req.body.projetId || null,  
            echeance: req.body.echeance || null,
            labels: req.body.labels || [],
            updatedAt: Date.now(),
            assigne: req.body.assigne && req.body.assigne !== ''
                ? req.body.assigne
                : null
        };

        const task = await Task.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        if (!task) return res.status(404).json({ error: 'Tâche non trouvée' });
        await creerLog('UPDATE_TASK', req.user._id, task.projetId, `Tâche "${task.titre}" modifiée`);
        res.json(task);
    } catch (error) {
        console.error('Erreur updateTask:', error.message);
        res.status(500).json({ error: error.message });
    }
};

exports.updateTaskStatus = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status, updatedAt: Date.now() },
            { new: true }
        );
        if (!task) return res.status(404).json({ error: 'Tâche non trouvée' });
        await creerLog('MOVE_TASK', req.user._id, task.projetId, `Tâche "${task.titre}" déplacée vers "${task.status}"`);
        res.json(task);
    } catch (error) {
        console.error('Erreur updateTaskStatus:', error.message);
        res.status(500).json({ error: error.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ error: 'Tâche non trouvée' });
        await creerLog('DELETE_TASK', req.user._id, task.projetId, `Tâche "${task.titre}" supprimée`);
        res.json({ success: true });
    } catch (error) {
        console.error('Erreur deleteTask:', error.message);
        res.status(500).json({ error: error.message });
    }
};

exports.estimerDuree = async (req, res) => {
    try {
        const { titre, description, priorite, projetId } = req.body;

        // Récupérer l'historique des tâches du projet
        const tachesHistorique = await Task.find({
            projetId: projetId,
            status: 'done'
        }).limit(20);

        const duree = await estimerDureeTache(
            { titre, description, priorite },
            tachesHistorique
        );

        if (duree === null) {
            return res.status(500).json({ 
                error: 'Erreur estimation IA' 
            });
        }

        res.json({ dureeEstimee: duree });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};