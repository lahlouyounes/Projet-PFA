const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    nom: { type: String, required: true, unique: true },
    permissions: {
        createProjects: { type: Boolean, default: false },
        manageMembers: { type: Boolean, default: false },
        assignTasks: { type: Boolean, default: false },
        deleteProjects: { type: Boolean, default: false },
        manageRoles: { type: Boolean, default: false }
    },
    description: { type: String },
    membres: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Role', roleSchema);