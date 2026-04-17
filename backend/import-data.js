const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI = 'mongodb+srv://trello-cluster:uQxOLjYHsft0eqKj@cluster0.2ph4joa.mongodb.net/trello-app?retryWrites=true&w=majority&appName=Cluster0';

// Schémas
const roleSchema = new mongoose.Schema({
    nom: String,
    permissions: Object,
    description: String,
    membres: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

const labelSchema = new mongoose.Schema({
    nom: String,
    couleur: String,
    createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
    nom: String,
    email: String,
    password: String,
    fonction: String,
    telephone: String,
    localisation: String,
    avatar: String,
    role: String,
    createdAt: { type: Date, default: Date.now }
});

const Role = mongoose.model('Role', roleSchema);
const Label = mongoose.model('Label', labelSchema);
const User = mongoose.model('User', userSchema);

async function importData() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connecté à MongoDB Atlas\n');

        // Importer les rôles
        const rolesCount = await Role.countDocuments();
        if (rolesCount === 0) {
            await Role.insertMany([
                {
                    nom: "Administrateur",
                    permissions: {
                        createProjects: true,
                        manageMembers: true,
                        assignTasks: true,
                        deleteProjects: true,
                        manageRoles: true
                    },
                    description: "Accès total à toutes les fonctionnalités"
                },
                {
                    nom: "Chef de projet",
                    permissions: {
                        createProjects: true,
                        manageMembers: true,
                        assignTasks: true,
                        deleteProjects: false,
                        manageRoles: false
                    },
                    description: "Gestion complète des projets et équipes"
                },
                {
                    nom: "Membre",
                    permissions: {
                        createProjects: false,
                        manageMembers: false,
                        assignTasks: true,
                        deleteProjects: false,
                        manageRoles: false
                    },
                    description: "Ajout et modification de cartes"
                },
                {
                    nom: "Observateur",
                    permissions: {
                        createProjects: false,
                        manageMembers: false,
                        assignTasks: false,
                        deleteProjects: false,
                        manageRoles: false
                    },
                    description: "Lecture seule"
                }
            ]);
            console.log('✅ 4 rôles importés');
        } else {
            console.log('⚠️ Les rôles existent déjà');
        }

        // Importer les labels
        const labelsCount = await Label.countDocuments();
        if (labelsCount === 0) {
            await Label.insertMany([
                { nom: "Urgent", couleur: "#ef4444" },
                { nom: "Bug", couleur: "#f59e0b" },
                { nom: "Feature", couleur: "#22c55e" },
                { nom: "Documentation", couleur: "#3b82f6" },
                { nom: "Design", couleur: "#8b5cf6" },
                { nom: "Test", couleur: "#14b8a6" }
            ]);
            console.log('✅ 6 labels importés');
        } else {
            console.log('⚠️ Les labels existent déjà');
        }

        // Importer l'utilisateur admin
        const adminExists = await User.findOne({ email: 'admin@collabflow.com' });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await User.create({
                nom: 'Administrateur',
                email: 'admin@collabflow.com',
                password: hashedPassword,
                fonction: 'Administrateur système',
                telephone: '+212 6 12 34 56 78',
                localisation: 'Casablanca, Maroc',
                avatar: '👑',
                role: 'admin'
            });
            console.log('✅ Compte admin créé: admin@collabflow.com / admin123');
        } else {
            console.log('⚠️ Le compte admin existe déjà');
        }

        // Afficher le résumé
        console.log('\n========================================');
        console.log('📊 RÉSUMÉ DE L\'IMPORTATION');
        console.log('========================================');
        console.log(`👥 Utilisateurs: ${await User.countDocuments()}`);
        console.log(`🎭 Rôles: ${await Role.countDocuments()}`);
        console.log(`🏷️ Labels: ${await Label.countDocuments()}`);
        console.log('========================================\n');

        await mongoose.disconnect();
        console.log('✅ Déconnecté de MongoDB');

    } catch (error) {
        console.error('❌ Erreur:', error);
    }
}

importData();