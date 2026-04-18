const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    titre: { type: String, required: true },
    description: { type: String, default: '' },
    status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' },
    priorite: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    assigne: { type: String, default: '' },
    projetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    echeance: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);