// ============================================
// API CONNECTION — replaces localStorage
// ============================================

const API = 'http://localhost:3000/api';

// Get token from login (stored after authentication)
function getToken() {
  return localStorage.getItem('token');
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
  };
}

// ===== PROJECTS =====
async function getProjets() {
  const res = await fetch(`${API}/projects`, { headers: authHeaders() });
  return await res.json();
}

async function ajouterProjet(projet) {
  await fetch(`${API}/projects`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ nomProjet: projet.nom, description: projet.description })
  });
  showNotification("Projet ajouté");
}

async function modifierProjet(id, projet) {
  await fetch(`${API}/projects/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(projet)
  });
  showNotification("Projet modifié");
}

async function supprimerProjet(id) {
  await fetch(`${API}/projects/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  showNotification("Projet supprimé");
}

// ===== TASKS (for a given project) =====
let currentProjectId = 1; // will be set dynamically later

async function getTaches() {
  const res = await fetch(`${API}/projects/${currentProjectId}/tasks`, {
    headers: authHeaders()
  });
  return await res.json();
}

async function ajouterTache(tache) {
  await fetch(`${API}/projects/${currentProjectId}/tasks`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ titre: tache.titre, colonne: tache.liste })
  });
  showNotification("Tâche ajoutée");
}

async function supprimerTache(id) {
  await fetch(`${API}/projects/${currentProjectId}/tasks/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  showNotification("Tâche supprimée");
}

async function deplacerTache(id, nouvelleListe) {
  await fetch(`${API}/projects/${currentProjectId}/tasks/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ colonne: nouvelleListe })
  });
  showNotification("Tâche déplacée");
}

// ===== NOTIFICATIONS =====
function showNotification(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

// Export
window.app = {
  getProjets, ajouterProjet, modifierProjet, supprimerProjet,
  getTaches, ajouterTache, supprimerTache, deplacerTache,
  showNotification
};