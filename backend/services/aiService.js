const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function estimerDureeTache(nouvelleTache, tachesHistorique) {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        // Préparer l'historique des tâches terminées
        const historique = tachesHistorique
            .filter(t => t.status === 'done' && t.dureeEstimee)
            .slice(0, 10)
            .map(t => `- Titre: "${t.titre}" | Priorité: ${t.priorite} | Durée réelle: ${t.dureeEstimee}h`)
            .join('\n');

        const prompt = `
Tu es un assistant de gestion de projet. Analyse cette nouvelle tâche et estime sa durée en heures.

Historique des tâches terminées du projet :
${historique || 'Aucun historique disponible'}

Nouvelle tâche à estimer :
- Titre: "${nouvelleTache.titre}"
- Description: "${nouvelleTache.description || 'Aucune description'}"
- Priorité: ${nouvelleTache.priorite}

Réponds UNIQUEMENT avec un nombre entier représentant les heures estimées (ex: 2 ou 4 ou 8).
Ne donne aucune explication, juste le nombre.
        `;

        const result = await model.generateContent(prompt);
        const response = result.response.text().trim();
        const heures = parseInt(response);

        if (isNaN(heures) || heures < 1) return 2; // valeur par défaut
        if (heures > 40) return 40; // maximum raisonnable

        return heures;

    } catch (error) {
        console.error('Erreur Gemini:', error.message);
        return null; // retourne null si erreur
    }
}

module.exports = { estimerDureeTache };