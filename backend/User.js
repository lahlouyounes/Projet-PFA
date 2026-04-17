const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fonction: { type: String, default: 'Membre' },
    telephone: { type: String },
    localisation: { type: String },
    avatar: { type: String, default: '👤' },
    role: { type: String, enum: ['admin', 'chef_projet', 'membre', 'observateur'], default: 'membre' },
    roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
    projets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    createdAt: { type: Date, default: Date.now }
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);