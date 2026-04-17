const Label = require('../models/Label');

// READ - Récupérer les étiquettes
const getLabels = async (req, res) => {
    try {
        const { projetId } = req.query;
        const filter = projetId ? { projet_id: projetId } : {};
        const labels = await Label.find(filter);
        res.json(labels);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// READ - Récupérer une étiquette par ID
const getLabelById = async (req, res) => {
    try {
        const label = await Label.findById(req.params.id);
        if (!label) {
            return res.status(404).json({ message: 'Étiquette non trouvée' });
        }
        res.json(label);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// CREATE - Créer une étiquette
const createLabel = async (req, res) => {
    try {
        const label = await Label.create({
            ...req.body,
            cree_par: req.user._id
        });
        res.status(201).json(label);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE - Modifier une étiquette
const updateLabel = async (req, res) => {
    try {
        const label = await Label.findByIdAndUpdate(
            req.params.id,
            { ...req.body },
            { new: true, runValidators: true }
        );
        if (!label) {
            return res.status(404).json({ message: 'Étiquette non trouvée' });
        }
        res.json(label);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE - Supprimer une étiquette
const deleteLabel = async (req, res) => {
    try {
        const label = await Label.findByIdAndDelete(req.params.id);
        if (!label) {
            return res.status(404).json({ message: 'Étiquette non trouvée' });
        }
        res.json({ message: 'Étiquette supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getLabels, getLabelById, createLabel, updateLabel, deleteLabel };