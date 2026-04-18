const mongoose = require('mongoose');

const labelSchema = new mongoose.Schema({
    nom: { type: String, required: true, unique: true },
    couleur: { type: String, default: '#667eea' },
    description: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

labelSchema.statics.initDefaultLabels = async function() {
    const defaultLabels = [
        { nom: 'Urgent', couleur: '#ef4444', description: 'Priorité haute - À traiter immédiatement' },
        { nom: 'Bug', couleur: '#f59e0b', description: 'Correction de bug nécessaire' },
        { nom: 'Feature', couleur: '#10b981', description: 'Nouvelle fonctionnalité' },
        { nom: 'Documentation', couleur: '#3b82f6', description: 'Documentation à mettre à jour' },
        { nom: 'Design', couleur: '#8b5cf6', description: 'Travail de design/UI' },
        { nom: 'Review', couleur: '#ec4899', description: 'En attente de relecture' }
    ];
    for (const label of defaultLabels) {
        const exists = await this.findOne({ nom: label.nom });
        if (!exists) {
            await this.create(label);
            console.log(`✅ Étiquette ${label.nom} créée`);
        }
    }
};

module.exports = mongoose.model('Label', labelSchema);