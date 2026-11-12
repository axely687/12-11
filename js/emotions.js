/**
 * Mente en Equilibrio - Emotions Module
 */

function renderEmotions(container) {
    container.innerHTML = `
        <div class="view-header">
            <h1>¿Cómo te sientes hoy?</h1>
            <p>Registra tu estado de ánimo para conocerte mejor.</p>
        </div>

        <div class="emotions-form-container">
            <div class="card">
                <h3>Selecciona una emoción</h3>
                <div class="emotion-selector" id="emotion-selector">
                    <div class="emotion-option" data-mood="Muy bien" data-emoji="🤩">
                        <span class="emoji">🤩</span>
                        <span class="label">Muy bien</span>
                    </div>
                    <div class="emotion-option" data-mood="Bien" data-emoji="😊">
                        <span class="emoji">😊</span>
                        <span class="label">Bien</span>
                    </div>
                    <div class="emotion-option" data-mood="Tranquilo" data-emoji="😌">
                        <span class="emoji">😌</span>
                        <span class="label">Tranquilo</span>
                    </div>
                    <div class="emotion-option" data-mood="Más o menos" data-emoji="😐">
                        <span class="emoji">😐</span>
                        <span class="label">Más o menos</span>
                    </div>
                    <div class="emotion-option" data-mood="Triste" data-emoji="😔">
                        <span class="emoji">😔</span>
                        <span class="label">Triste</span>
                    </div>
                    <div class="emotion-option" data-mood="Estresado" data-emoji="😫">
                        <span class="emoji">😫</span>
                        <span class="label">Estresado</span>
                    </div>
                </div>

                <div class="intensity-selector hidden" id="intensity-group">
                    <h3>¿Con qué intensidad?</h3>
                    <div class="range-container">
                        <input type="range" id="emotion-intensity" min="1" max="5" value="3">
                        <div class="range-labels">
                            <span>Leve</span>
                            <span>Moderada</span>
                            <span>Fuerte</span>
                        </div>
                    </div>
                </div>

                <div class="note-container hidden" id="note-group">
                    <h3>¿Quieres agregar una nota? (Opcional)</h3>
                    <textarea id="emotion-note" class="form-input" placeholder="Cuéntanos un poco más sobre cómo te sientes..."></textarea>
                    <button class="btn-primary full-width" id="save-emotion">Guardar Registro</button>
                </div>
            </div>

            <div class="card recent-emotions">
                <h3>Registros Recientes</h3>
                <div id="recent-emotions-list" class="emotions-list">
                    <!-- Registros se cargarán aquí -->
                </div>
            </div>
        </div>
    `;

    let selectedMood = null;
    let selectedEmoji = null;

    const emotionOptions = document.querySelectorAll('.emotion-option');
    const intensityGroup = document.getElementById('intensity-group');
    const noteGroup = document.getElementById('note-group');
    const recentList = document.getElementById('recent-emotions-list');

    // Load recent emotions
    updateRecentEmotionsList(recentList);

    emotionOptions.forEach(option => {
        option.addEventListener('click', () => {
            // UI Toggle
            emotionOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            
            selectedMood = option.getAttribute('data-mood');
            selectedEmoji = option.getAttribute('data-emoji');
            
            // Show next steps
            intensityGroup.classList.remove('hidden');
            noteGroup.classList.remove('hidden');
            
            // Scroll to bottom of form
            noteGroup.scrollIntoView({ behavior: 'smooth', block: 'end' });
        });
    });

    document.getElementById('save-emotion').addEventListener('click', () => {
        if (!selectedMood) return;

        const intensity = document.getElementById('emotion-intensity').value;
        const note = document.getElementById('emotion-note').value;

        const newEmotion = {
            id: Date.now(),
            date: new Date().toISOString(),
            mood: selectedMood,
            emoji: selectedEmoji,
            intensity: parseInt(intensity),
            note: note
        };

        const db = Storage.getData();
        db.emotions.unshift(newEmotion); // Add to beginning
        Storage.updateKey('emotions', db.emotions);

        // Feedback and Reset
        alert('Registro guardado correctamente.');
        switchView('emotions'); // Refresh view
    });
}

function updateRecentEmotionsList(container) {
    const db = Storage.getData();
    const recent = db.emotions.slice(0, 5);

    if (recent.length === 0) {
        container.innerHTML = '<p class="empty-state">No hay registros recientes.</p>';
        return;
    }

    container.innerHTML = recent.map(item => `
        <div class="emotion-item">
            <div class="item-emoji">${item.emoji}</div>
            <div class="item-details">
                <div class="item-top">
                    <span class="item-mood">${item.mood}</span>
                    <span class="item-date">${formatRelativeDate(item.date)}</span>
                </div>
                <div class="item-intensity">Intensidad: ${item.intensity}/5</div>
                ${item.note ? `<p class="item-note">${item.note}</p>` : ''}
            </div>
            <button class="delete-btn" onclick="deleteEmotion(${item.id})">&times;</button>
        </div>
    `).join('');
}

function deleteEmotion(id) {
    if (confirm('¿Eliminar este registro?')) {
        const db = Storage.getData();
        db.emotions = db.emotions.filter(e => e.id !== id);
        Storage.updateKey('emotions', db.emotions);
        switchView('emotions');
    }
}

function formatRelativeDate(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diff = now - date;
    const diffInMinutes = Math.floor(diff / (1000 * 60));

    if (diffInMinutes < 1) return 'Justo ahora';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Hace ${diffInHours} horas`;

    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}
