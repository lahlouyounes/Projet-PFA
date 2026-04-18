const Label = require('../models/Label');

exports.getLabels = async (req, res) => {
    try {
        const labels = await Label.find().sort('nom');
        res.json(labels);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getLabelById = async (req, res) => {
    try {
        const label = await Label.findById(req.params.id);
        if (!label) return res.status(404).json({ error: 'Étiquette non trouvée' });
        res.json(label);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createLabel = async (req, res) => {
    try {
        const { nom, couleur, description } = req.body;
        const existingLabel = await Label.findOne({ nom });
        if (existingLabel) {
            return res.status(400).json({ message: 'Cette étiquette existe déjà' });
        }
        const label = await Label.create({ nom, couleur, description });
        res.status(201).json(label);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateLabel = async (req, res) => {
    try {
        const { nom, couleur, description } = req.body;
        const label = await Label.findByIdAndUpdate(
            req.params.id,
            { nom, couleur, description, updatedAt: Date.now() },
            { new: true }
        );
        if (!label) return res.status(404).json({ error: 'Étiquette non trouvée' });
        res.json(label);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteLabel = async (req, res) => {
    try {
        const label = await Label.findByIdAndDelete(req.params.id);
        if (!label) return res.status(404).json({ error: 'Étiquette non trouvée' });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};