const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');

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

// Route test
app.get('/api/test', (req, res) => {
    res.json({ 
        success: true, 
        message: 'API CollabFlow fonctionne !',
        timestamp: new Date(),
        status: 'online'
    });
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

// Initialisation des données par défaut
const initData = async () => {
    try {
        const Project = require('./models/Project');
        const Task = require('./models/Task');
        const User = require('./models/User');
        const authController = require('./controllers/authController');
        
        // Créer admin
        await authController.initAdmin();
        
        // Créer des projets
        const projectCount = await Project.countDocuments();
        if (projectCount === 0) {
            await Project.create([
                { nom: 'Application Mobile', description: 'Développement React Native', avancement: 65, statut: 'actif' },
                { nom: 'Dashboard Analytics', description: 'Tableau de bord avec graphiques', avancement: 30, statut: 'actif' },
                { nom: 'Refacto UI', description: 'Refonte interface utilisateur', avancement: 100, statut: 'termine' },
                { nom: 'API Gateway', description: 'Mise en place du proxy API', avancement: 45, statut: 'actif' }
            ]);
            console.log('✅ 4 projets créés');
        }
        
        // Créer des tâches
        const taskCount = await Task.countDocuments();
        if (taskCount === 0) {
            await Task.create([
                { titre: 'Concevoir wireframes', status: 'done', priorite: 'high', assigne: 'Younes' },
                { titre: 'Implémenter JWT', status: 'in-progress', priorite: 'high', assigne: 'Younes' },
                { titre: 'Drag & Drop Kanban', status: 'done', priorite: 'medium', assigne: 'Inass' },
                { titre: 'Tests unitaires', status: 'todo', priorite: 'medium', assigne: 'Younes' },
                { titre: 'Design UI/UX', status: 'in-progress', priorite: 'high', assigne: 'Inass' },
                { titre: 'Documentation API', status: 'todo', priorite: 'low', assigne: 'Inass' },
                { titre: 'Optimisation performances', status: 'todo', priorite: 'medium', assigne: 'Younes' },
                { titre: 'Mise en production', status: 'todo', priorite: 'high', assigne: 'Younes' }
            ]);
            console.log('✅ 8 tâches créées');
        }
        
        // Créer des utilisateurs
        const userCount = await User.countDocuments();
        if (userCount <= 2) {
            await User.create([
                { name: 'Younes', email: 'younes@collabflow.com', password: 'younes123', role: 'admin', avatar: 'Y' },
                { name: 'Inass', email: 'inass@collabflow.com', password: 'inass123', role: 'admin', avatar: 'I' }
            ]);
            console.log('✅ Utilisateurs Younes et Inass créés');
        }
        
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
║   🧪 Test: http://localhost:${PORT}/api/test                    ║
║                                                                ║
║   🔑 Comptes de test:                                          ║
║   - admin@collabflow.com / admin123                            ║
║   - younes@collabflow.com / younes123                          ║
║   - inass@collabflow.com / inass123                            ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
    `);
});