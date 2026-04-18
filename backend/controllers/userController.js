const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createUser = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password || 'user123', 10);
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role || 'user',
            avatar: req.body.name?.charAt(0).toUpperCase() || 'U'
        });
        res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const updateData = { name: req.body.name, email: req.body.email, role: req.body.role };
        if (req.body.password) {
            updateData.password = await bcrypt.hash(req.body.password, 10);
        }
        const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true }).select('-password');
        if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};