const Role = require('../models/Role');

// READ - Récupérer tous les rôles
const getRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// READ - Récupérer un rôle par ID
const getRoleById = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) {
            return res.status(404).json({ message: 'Rôle non trouvé' });
        }
        res.json(role);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CREATE - Créer un rôle
const createRole = async (req, res) => {
    try {
        const role = await Role.create(req.body);
        res.status(201).json(role);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE - Modifier un rôle
const updateRole = async (req, res) => {
    try {
        const role = await Role.findByIdAndUpdate(
            req.params.id,
            { ...req.body },
            { new: true, runValidators: true }
        );
        if (!role) {
            return res.status(404).json({ message: 'Rôle non trouvé' });
        }
        res.json(role);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE - Supprimer un rôle
const deleteRole = async (req, res) => {
    try {
        const role = await Role.findByIdAndDelete(req.params.id);
        if (!role) {
            return res.status(404).json({ message: 'Rôle non trouvé' });
        }
        res.json({ message: 'Rôle supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getRoles, getRoleById, createRole, updateRole, deleteRole };