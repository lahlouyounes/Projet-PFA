const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const auth = require('./middleware/auth');

dotenv.config();

const app = express();

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB connecté avec succès'))
    .catch(err => console.error('❌ Erreur MongoDB:', err.message));

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Routes API
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projets', require('./routes/projectRoutes'));
app.use('/api/taches', require('./routes/taskRoutes'));
app.use('/api/utilisateurs', require('./routes/userRoutes'));
app.use('/api/roles', require('./routes/roleRoutes'));
app.use('/api/etiquettes', require('./routes/labelRoutes'));
app.use('/api/logs', require('./routes/logRoutes'));

// Route test
app.get('/api/test', (req, res) => {
    res.json({ 
        success: true, 
        message: 'API CollabFlow fonctionne !',
        timestamp: new Date(),
        status: 'online'
    });
});

// ✅ Route de nettoyage des anciennes tâches corrompues
app.post('/api/cleanup', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Réservé aux administrateurs' });
        }
        const Task = require('./models/Task');
        const tasks = await Task.find({});
        let count = 0;
        for (const task of tasks) {
            if (task.assigne && !mongoose.Types.ObjectId.isValid(task.assigne)) {
                task.assigne = null;
                await task.save();
                count++;
            }
        }
        res.json({ success: true, nettoyees: count });
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
});

// Routes HTML
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../frontend/index.html')));
app.get('/login.html', (req, res) => res.sendFile(path.join(__dirname, '../frontend/login.html')));
app.get('/index.html', (req, res) => res.sendFile(path.join(__dirname, '../frontend/index.html')));
app.get('/projets.html', (req, res) => res.sendFile(path.join(__dirname, '../frontend/projets.html')));
app.get('/board.html', (req, res) => res.sendFile(path.join(__dirname, '../frontend/board.html')));
app.get('/taches.html', (req, res) => res.sendFile(path.join(__dirname, '../frontend/taches.html')));
app.get('/utilisateurs.html', (req, res) => res.sendFile(path.join(__dirname, '../frontend/utilisateurs.html')));
app.get('/roles.html', (req, res) => res.sendFile(path.join(__dirname, '../frontend/roles.html')));
app.get('/etiquette.html', (req, res) => res.sendFile(path.join(__dirname, '../frontend/etiquette.html')));
app.get('/profil.html', (req, res) => res.sendFile(path.join(__dirname, '../frontend/profil.html')));
app.get('/logs.html', (req, res) => res.sendFile(path.join(__dirname, '../frontend/logs.html')));
app.get('/membres.html', (req, res) => res.sendFile(path.join(__dirname, '../frontend/membres.html')));

// Initialisation - SEULEMENT les comptes et étiquettes, PAS les tâches corrompues
const initData = async () => {
    try {
        const User = require('./models/User');
        const Label = require('./models/Label');
        const authController = require('./controllers/authController');
        
        // Créer admin
        await authController.initAdmin();
        
        // Créer étiquettes par défaut
        await Label.initDefaultLabels();
        
        console.log('✅ Données initialisées avec succès');
    } catch (error) {
        console.error('❌ Erreur initialisation:', error.message);
    }
};

mongoose.connection.once('open', async () => {
    await initData();
});

// Démarrage
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║   ✅ SERVEUR COLLABFLOW DÉMARRÉ AVEC SUCCÈS !                  ║
║                                                                ║
║   🌐 Application: http://localhost:${PORT}                      ║
║   📡 API: http://localhost:${PORT}/api                          ║
║                                                                ║
║   🔑 Comptes de test:                                          ║
║   - admin@collabflow.com / admin123                            ║
║   - younes@collabflow.com / younes123                          ║
║   - inass@collabflow.com / inass123                            ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
    `);
});