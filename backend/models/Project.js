const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    description: { type: String },
    avancement: { type: Number, default: 0, min: 0, max: 100 },
    statut: { type: String, enum: ['actif', 'termine', 'archive'], default: 'actif' },
    proprietaire_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    membres: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dateDebut: { type: Date, default: Date.now },
    dateFin: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);