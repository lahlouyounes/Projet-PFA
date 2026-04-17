const mongoose = require('mongoose');

const labelSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    couleur: { type: String, default: '#3b82f6' },
    projet_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    cree_par: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Label', labelSchema);