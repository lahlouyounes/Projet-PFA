const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  nomProjet: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  membres: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['chef', 'membre'], default: 'membre' }
  }],
  colonnes: {
    type: [String],
    default: ['À faire', 'En cours', 'Terminé']
  },
  avancement: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);