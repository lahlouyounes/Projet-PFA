const Role = require('../models/Role');

exports.getRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRoleById = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) return res.status(404).json({ error: 'Rôle non trouvé' });
        res.json(role);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createRole = async (req, res) => {
    try {
        const { nom, permissions } = req.body;
        const existingRole = await Role.findOne({ nom });
        if (existingRole) {
            return res.status(400).json({ message: 'Ce rôle existe déjà' });
        }
        const role = await Role.create({ nom, permissions: permissions || [] });
        res.status(201).json(role);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateRole = async (req, res) => {
    try {
        const { nom, permissions } = req.body;
        const role = await Role.findByIdAndUpdate(
            req.params.id,
            { nom, permissions, updatedAt: Date.now() },
            { new: true }
        );
        if (!role) return res.status(404).json({ error: 'Rôle non trouvé' });
        res.json(role);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteRole = async (req, res) => {
    try {
        const role = await Role.findByIdAndDelete(req.params.id);
        if (!role) return res.status(404).json({ error: 'Rôle non trouvé' });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};