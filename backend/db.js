const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://trello-cluster:uQxOLjYHsft0eqKj@cluster0.2ph4joa.mongodb.net/trello-app?retryWrites=true&w=majority&appName=Cluster0');
        console.log(`✅ MongoDB connecté: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Erreur MongoDB: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;