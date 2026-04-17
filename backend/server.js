const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();

// Connexion à MongoDB
connectDB();

const app = express();

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

// Route de test
app.get('/api/test', (req, res) => {
    res.json({ message: 'API CollabFlow fonctionne !', timestamp: new Date() });
});

// Routes HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/register.html'));
});

app.get('/index.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/board.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/board.html'));
});

app.get('/projets.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/projets.html'));
});

app.get('/profil.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/profil.html'));
});

app.get('/roles.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/roles.html'));
});

app.get('/etiquette.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/etiquette.html'));
});

// Démarrage du serveur
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`
========================================
✅ SERVEUR DÉMARRÉ AVEC SUCCÈS !
========================================
🌐 Application: http://localhost:${PORT}
📡 API: http://localhost:${PORT}/api
🧪 Test: http://localhost:${PORT}/api/test
========================================
    `);
});