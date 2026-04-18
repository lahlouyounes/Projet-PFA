const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// ✅ Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
        }
        
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
        }
        
        const token = generateToken(user._id);
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Get profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json({
            nom: user.name,
            email: user.email,
            role: user.role,
            fonction: user.fonction || '',
            telephone: user.telephone || '',
            localisation: user.localisation || '',
            language: user.language || 'fr',
            avatar: user.avatar || user.name?.charAt(0) || '👤',
            createdAt: user.createdAt,
            id: user._id
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Update profile
exports.updateProfile = async (req, res) => {
    try {
        const { nom, email, fonction, telephone, localisation, language, avatar } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                name: nom,
                email,
                fonction,
                telephone,
                localisation,
                language,
                avatar,
                updatedAt: Date.now()
            },
            { new: true }
        ).select('-password');
        
        res.json({
            nom: user.name,
            email: user.email,
            role: user.role,
            fonction: user.fonction,
            telephone: user.telephone,
            localisation: user.localisation,
            language: user.language,
            avatar: user.avatar,
            id: user._id
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Change password
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);
        
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mot de passe actuel incorrect' });
        }
        
        user.password = newPassword;
        await user.save();
        
        res.json({ success: true, message: 'Mot de passe mis à jour' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ✅ Init admin
exports.initAdmin = async () => {
    try {
        const adminExists = await User.findOne({ email: 'admin@collabflow.com' });
        if (!adminExists) {
            await User.create({
                name: 'Administrateur',
                email: 'admin@collabflow.com',
                password: 'admin123',
                role: 'admin',
                avatar: 'A',
                fonction: 'Administrateur',
                telephone: '+212 6XX XXX XXX',
                localisation: 'Casablanca, Maroc'
            });
            console.log('✅ Compte admin créé');
        }
        
        const userExists = await User.findOne({ email: 'user@collabflow.com' });
        if (!userExists) {
            await User.create({
                name: 'Utilisateur',
                email: 'user@collabflow.com',
                password: 'user123',
                role: 'user',
                avatar: 'U'
            });
            console.log('✅ Compte user créé');
        }
        
        // Ajouter Younes et Inass
        const younesExists = await User.findOne({ email: 'younes@collabflow.com' });
        if (!younesExists) {
            await User.create({
                name: 'Younes',
                email: 'younes@collabflow.com',
                password: 'younes123',
                role: 'admin',
                avatar: 'Y',
                fonction: 'Lead Developer',
                telephone: '+212 6XX XXX XXX',
                localisation: 'Casablanca, Maroc'
            });
            console.log('✅ Compte Younes créé');
        }
        
        const inassExists = await User.findOne({ email: 'inass@collabflow.com' });
        if (!inassExists) {
            await User.create({
                name: 'Inass',
                email: 'inass@collabflow.com',
                password: 'inass123',
                role: 'admin',
                avatar: 'I',
                fonction: 'UI/UX Designer',
                telephone: '+212 6XX XXX XXX',
                localisation: 'Rabat, Maroc'
            });
            console.log('✅ Compte Inass créé');
        }
    } catch (error) {
        console.error('Erreur initAdmin:', error.message);
    }
};