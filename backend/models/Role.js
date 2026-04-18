const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    nom: { type: String, required: true, unique: true },
    permissions: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

roleSchema.statics.initDefaultRoles = async function() {
    const defaultRoles = [
        { nom: 'admin', permissions: ['*'] },
        { nom: 'user', permissions: ['view_tasks', 'view_projects'] }
    ];
    for (const role of defaultRoles) {
        const exists = await this.findOne({ nom: role.nom });
        if (!exists) {
            await this.create(role);
            console.log(`✅ Rôle ${role.nom} créé`);
        }
    }
};

module.exports = mongoose.model('Role', roleSchema);