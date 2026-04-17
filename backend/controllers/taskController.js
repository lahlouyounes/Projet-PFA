const Task = require('../models/Task');

// READ - Récupérer les tâches
const getTasks = async (req, res) => {
    try {
        const { projetId } = req.query;
        const filter = projetId ? { projet_id: projetId } : {};
        const tasks = await Task.find(filter)
            .populate('assigne_a', 'nom email')
            .populate('etiquettes');
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// READ - Récupérer une tâche par ID
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('assigne_a', 'nom email')
            .populate('etiquettes');
        if (!task) {
            return res.status(404).json({ message: 'Tâche non trouvée' });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CREATE - Créer une tâche
const createTask = async (req, res) => {
    try {
        const task = await Task.create({
            ...req.body,
            cree_par: req.user._id
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE - Modifier une tâche
const updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { ...req.body },
            { new: true, runValidators: true }
        );
        if (!task) {
            return res.status(404).json({ message: 'Tâche non trouvée' });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE - Déplacer une tâche (changer de colonne)
const moveTask = async (req, res) => {
    try {
        const { nouvelleListe } = req.body;
        const updateData = { statut: nouvelleListe };
        
        if (nouvelleListe === 'done') {
            updateData.completedAt = new Date();
        }
        
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );
        if (!task) {
            return res.status(404).json({ message: 'Tâche non trouvée' });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE - Supprimer une tâche
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Tâche non trouvée' });
        }
        res.json({ message: 'Tâche supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getTasks, getTaskById, createTask, updateTask, moveTask, deleteTask };