const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    description: { type: String, default: '' },
    statut: { type: String, enum: ['actif', 'termine', 'archive'], default: 'actif' },
    avancement: { type: Number, default: 0, min: 0, max: 100 },
    dateFin: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);