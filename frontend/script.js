// ============================================
// COLLABFLOW — API CONNECTION & UTILITIES
// ============================================

const API_URL = 'http://localhost:3002/api';

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
        return false;
    }
    return true;
}

// ===== NOTIFICATIONS =====
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${message}`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// ===== DISPLAY LOGGED IN USER =====
async function displayUser() {
    if (!checkAuth()) return;
    try {
        const response = await fetch(`${API_URL}/auth/profil`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        if (response.ok) {
            const user = await response.json();
            document.querySelectorAll('.user-name').forEach(el => el.innerText = user.nom);
            document.querySelectorAll('.avatar-mini').forEach(el => {
                el.innerText = user.nom?.charAt(0).toUpperCase() || '👤';
            });
        }
    } catch (error) {
        console.error('Erreur chargement user:', error);
    }
}

// ===== LOGOUT =====
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// ===== ESCAPE HTML =====
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, m => {
        const escapes = { '&': '&amp;', '<': '&lt;', '>': '&gt;' };
        return escapes[m];
    });
}

// ===== FORMAT DATE =====
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
}

// ===== EXPORT =====
window.app = {
    API_URL,
    getToken,
    getUser,
    authHeaders,
    checkAuth,
    showNotification,
    displayUser,
    logout,
    escapeHtml,
    formatDate
};