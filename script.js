// ============================================
// COLLABFLOW — API CONNECTION
// ============================================

const API = 'http://localhost:3000/api';

// ===== AUTH HELPERS =====
function getToken() {
  return localStorage.getItem('token');
}

function getUser() {
  return JSON.parse(localStorage.getItem('user'));
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
  };
}

// Redirect to login if not authenticated
function checkAuth() {
  if (!getToken()) {
    window.location.href = 'login.html';
  }
}

checkAuth();

// ===== DISPLAY LOGGED IN USER =====
function displayUser() {
  const user = getUser();
  if (!user) return;
  document.querySelectorAll('.user-name').forEach(el => el.innerText = user.nom);
  document.querySelectorAll('.avatar-mini').forEach(el => {
    el.innerText = user.nom.substring(0, 2).toUpperCase();
  });
}

// ===== NOTIFICATIONS =====
function showNotification(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i> ${message}`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

// ===== LOGOUT =====
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'login.html';
}

// ===== PROJECTS =====
async function getProjets() {
  try {
    const res = await fetch(`${API}/projects`, { headers: authHeaders() });
    if (res.status === 401) { logout(); return []; }
    return await res.json();
  } catch (err) {
    showNotification('Erreur serveur', 'error');
    return [];
  }
}

async function ajouterProjet(projet) {
  try {
    const res = await fetch(`${API}/projects`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ 
        nomProjet: projet.nom, 
        description: projet.description,
        avancement: projet.avancement || 0
      })
    });
    if (res.ok) showNotification('Projet ajouté avec succès');
    else showNotification('Erreur lors de l\'ajout', 'error');
  } catch (err) {
    showNotification('Erreur serveur', 'error');
  }
}

async function modifierProjet(id, projet) {
  try {
    const res = await fetch(`${API}/projects/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({
        nomProjet: projet.nom,
        description: projet.description,
        avancement: projet.avancement
      })
    });
    if (res.ok) showNotification('Projet modifié');
    else showNotification('Erreur lors de la modification', 'error');
  } catch (err) {
    showNotification('Erreur serveur', 'error');
  }
}

async function supprimerProjet(id) {
  try {
    const res = await fetch(`${API}/projects/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    if (res.ok) showNotification('Projet supprimé');
    else showNotification('Erreur lors de la suppression', 'error');
  } catch (err) {
    showNotification('Erreur serveur', 'error');
  }
}

// ===== TASKS =====
async function getTaches(projectId) {
  try {
    const res = await fetch(`${API}/projects/${projectId}/tasks`, { 
      headers: authHeaders() 
    });
    if (res.status === 401) { logout(); return []; }
    return await res.json();
  } catch (err) {
    showNotification('Erreur serveur', 'error');
    return [];
  }
}

async function ajouterTache(tache, projectId) {
  try {
    const res = await fetch(`${API}/projects/${projectId}/tasks`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ 
        titre: tache.titre, 
        colonne: tache.liste || 'todo'
      })
    });
    if (res.ok) showNotification('Tâche ajoutée au tableau');
    else showNotification('Erreur lors de l\'ajout', 'error');
  } catch (err) {
    showNotification('Erreur serveur', 'error');
  }
}

async function supprimerTache(id, projectId) {
  try {
    const res = await fetch(`${API}/projects/${projectId}/tasks/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    if (res.ok) showNotification('Tâche supprimée');
    else showNotification('Erreur lors de la suppression', 'error');
  } catch (err) {
    showNotification('Erreur serveur', 'error');
  }
}

async function deplacerTache(id, nouvelleListe, projectId) {
  try {
    const res = await fetch(`${API}/projects/${projectId}/tasks/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ colonne: nouvelleListe })
    });
    if (res.ok) showNotification('Tâche déplacée');
    else showNotification('Erreur lors du déplacement', 'error');
  } catch (err) {
    showNotification('Erreur serveur', 'error');
  }
}

// ===== EXPORT =====
window.app = {
  getProjets, ajouterProjet, modifierProjet, supprimerProjet,
  getTaches, ajouterTache, supprimerTache, deplacerTache,
  showNotification, getUser, logout, checkAuth, displayUser
};