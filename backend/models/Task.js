const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  dateEcheance: {
    type: Date
  },
  dureeEstimee: {
    type: Number
  },
  colonne: {
    type: String,
    default: 'todo'
  },
  projet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  etiquettes: [String],
  commentaires: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    texte: String,
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);