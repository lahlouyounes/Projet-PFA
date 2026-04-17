const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    titre: { type: String, required: true },
    description: { type: String },
    priorite: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    statut: { type: String, enum: ['todo', 'progress', 'done'], default: 'todo' },
    projet_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    assigne_a: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    cree_par: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    etiquettes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Label' }],
    echeance: { type: Date },
    createdAt: { type: Date, default: Date.now },
    completedAt: { type: Date }
});

module.exports = mongoose.model('Task', taskSchema);