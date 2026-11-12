/**
 * Mente en Equilibrio - Main Application Orchestrator
 */

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    // UI Elements
    const sidebar = document.getElementById('sidebar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileCloseBtn = document.getElementById('mobile-close');
    const themeToggle = document.getElementById('theme-toggle');
    const navItems = document.querySelectorAll('.sidebar-nav li, .sidebar-footer li');
    const headerGreeting = document.getElementById('header-greeting');
    const headerDate = document.getElementById('header-date');

    // State
    const db = Storage.getData();
    
    // Set Theme
    document.documentElement.setAttribute('data-theme', db.user.theme || 'light');
    
    // Set Header Info
    headerGreeting.textContent = `¡Hola, ${db.user.name}!`;
    updateHeaderDate(headerDate);

    // Navigation Logic
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const view = item.getAttribute('data-view');
            if (view) {
                switchView(view);
                
                // Update active state
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                
                // Close sidebar on mobile
                if (window.innerWidth <= 992) {
                    sidebar.classList.remove('active');
                }
            }
        });
    });

    // Mobile Menu Toggles
    mobileMenuBtn.addEventListener('click', () => sidebar.classList.add('active'));
    mobileCloseBtn.addEventListener('click', () => sidebar.classList.remove('active'));

    // Theme Toggle
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        Storage.updateKey('user', { ...Storage.getData().user, theme: newTheme });
    });

    // Load Default View
    switchView('dashboard');
}

/**
 * Switch between different application views
 */
function switchView(viewName) {
    const container = document.getElementById('view-container');
    container.innerHTML = '<div class="loader">Cargando...</div>';

    // Small delay to simulate smooth loading and ensure DOM updates
    setTimeout(() => {
        switch (viewName) {
            case 'dashboard':
                renderDashboard(container);
                break;
            case 'emotions':
                renderEmotions(container);
                break;
            case 'journal':
                renderJournal(container);
                break;
            case 'breathing':
                renderBreathing(container);
                break;
            case 'wellness':
                renderWellness(container);
                break;
            case 'stats':
                renderStats(container);
                break;
            case 'settings':
                renderSettings(container);
                break;
            default:
                container.innerHTML = '<h2>Vista en construcción</h2>';
        }
    }, 100);
}

function updateHeaderDate(element) {
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    const dateStr = new Date().toLocaleDateString('es-ES', options);
    element.textContent = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
}

/**
 * Dashboard View Renderer
 */
function renderDashboard(container) {
    const db = Storage.getData();
    const emotionsCount = db.emotions.length;
    const journalCount = db.journal.length;
    
    // Motivating phrases
    const phrases = [
        "Tu salud mental es una prioridad. Tu felicidad es esencial. Tu cuidado personal es una necesidad.",
        "No tienes que controlar tus pensamientos; solo tienes que dejar de dejar que ellos te controlen a ti.",
        "A veces, lo más productivo que puedes hacer es relajarte.",
        "Está bien no estar bien todo el tiempo.",
        "Cada día es una nueva oportunidad para cuidar de ti."
    ];
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];

    container.innerHTML = `
        <div class="view-header">
            <h1>Resumen de Bienestar</h1>
            <p>Aquí tienes un vistazo de tu progreso.</p>
        </div>

        <div class="dashboard-grid">
            <div class="card motivation-card">
                <div class="card-content">
                    <h3>Frase del día</h3>
                    <p class="quote">"${randomPhrase}"</p>
                </div>
                <div class="card-icon">✨</div>
            </div>

            <div class="stats-row">
                <div class="card stat-card">
                    <span class="stat-value">${emotionsCount}</span>
                    <span class="stat-label">Emociones registradas</span>
                </div>
                <div class="card stat-card">
                    <span class="stat-value">${journalCount}</span>
                    <span class="stat-label">Entradas en el diario</span>
                </div>
            </div>

            <div class="card action-card" onclick="document.querySelector('[data-view=\\'emotions\\']').click()">
                <div class="action-info">
                    <h3>¿Cómo te sientes ahora?</h3>
                    <p>Registra tu emoción para hacer un seguimiento.</p>
                </div>
                <button class="btn-primary">Registrar</button>
            </div>

            <div class="quick-access">
                <div class="card access-item" onclick="document.querySelector('[data-view=\\'breathing\\']').click()">
                    <span>🧘</span>
                    <p>Respiración</p>
                </div>
                <div class="card access-item" onclick="document.querySelector('[data-view=\\'wellness\\']').click()">
                    <span>✨</span>
                    <p>Actividades</p>
                </div>
                <div class="card access-item" onclick="document.querySelector('[data-view=\\'journal\\']').click()">
                    <span>📖</span>
                    <p>Escribir</p>
                </div>
            </div>
        </div>
    `;
}

/**
 * Settings View Renderer
 */
function renderSettings(container) {
    const db = Storage.getData();
    
    container.innerHTML = `
        <div class="view-header">
            <h1>Configuración</h1>
            <p>Personaliza tu experiencia.</p>
        </div>

        <div class="settings-content">
            <div class="card">
                <h3>Perfil de Usuario</h3>
                <div class="form-group">
                    <label>Nombre</label>
                    <input type="text" id="settings-name" value="${db.user.name}" class="form-input">
                </div>
                <button class="btn-primary" id="save-profile">Guardar Cambios</button>
            </div>

            <div class="card">
                <h3>Datos Locales</h3>
                <p>Tus datos se guardan exclusivamente en este navegador.</p>
                <div class="settings-actions">
                    <button class="btn-secondary" id="export-data">📥 Exportar JSON</button>
                    <button class="btn-danger" id="reset-data">🗑️ Eliminar Todo</button>
                </div>
            </div>
        </div>
    `;

    // Event Listeners for Settings
    document.getElementById('save-profile').addEventListener('click', () => {
        const newName = document.getElementById('settings-name').value;
        if (newName.trim()) {
            db.user.name = newName;
            Storage.updateKey('user', db.user);
            document.getElementById('header-greeting').textContent = `¡Hola, ${newName}!`;
            document.getElementById('user-avatar').textContent = newName.charAt(0).toUpperCase();
            alert('Perfil actualizado correctamente.');
        }
    });

    document.getElementById('export-data').addEventListener('click', () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "mente_en_equilibrio_data.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    });

    document.getElementById('reset-data').addEventListener('click', () => {
        if (confirm('¿Estás seguro de que deseas eliminar todos tus datos? Esta acción no se puede deshacer.')) {
            Storage.clearAll();
        }
    });
}
