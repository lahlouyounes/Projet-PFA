const Task = require('../models/Task');

exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find().sort('-createdAt');
        res.json(tasks);
    } catch (error) {
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
        const task = await Task.create(req.body);
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true }
        );
        if (!task) return res.status(404).json({ error: 'Tâche non trouvée' });
        res.json(task);
    } catch (error) {
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
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ error: 'Tâche non trouvée' });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};