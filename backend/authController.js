const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '7d' });
};

// CREATE - Inscription
const register = async (req, res) => {
    try {
        const { nom, email, password, fonction, telephone } = req.body;
        
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }
        
        const userCount = await User.countDocuments();
        const role = userCount === 0 ? 'admin' : 'membre';
        
        const user = await User.create({
            nom, email, password, fonction, telephone, role
        });
        
        const token = generateToken(user._id);
        
        res.status(201).json({
            _id: user._id,
            nom: user.nom,
            email: user.email,
            role: user.role,
            token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// READ - Connexion
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }
        
        const token = generateToken(user._id);
        
        res.json({
            _id: user._id,
            nom: user.nom,
            email: user.email,
            role: user.role,
            token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// READ - Profil
const getProfil = async (req, res) => {
    res.json(req.user);
};

// UPDATE - Profil
const updateProfil = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { ...req.body },
            { new: true, runValidators: true }
        ).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { register, login, getProfil, updateProfil };