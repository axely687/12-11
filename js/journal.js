/**
 * Mente en Equilibrio - Journal Module
 */

function renderJournal(container) {
    container.innerHTML = `
        <div class="view-header">
            <h1>Diario Personal</h1>
            <p>Escribe tus pensamientos y reflexiones con total privacidad.</p>
        </div>

        <div class="journal-layout">
            <div class="journal-editor card">
                <h3>Nueva Entrada</h3>
                <div class="form-group">
                    <input type="text" id="journal-title" class="form-input" placeholder="Título de tu reflexión...">
                </div>
                
                <div class="journal-prompts">
                    <button class="prompt-toggle" id="toggle-prompts">💡 Ideas para escribir</button>
                    <div class="prompts-list hidden" id="prompts-list">
                        <ul>
                            <li>¿Qué fue lo mejor de mi día?</li>
                            <li>¿Qué situación me preocupó y por qué?</li>
                            <li>¿Qué necesito en este momento para estar mejor?</li>
                            <li>¿Qué aprendí hoy sobre mí mismo?</li>
                            <li>¿Por qué cosas me siento agradecido hoy?</li>
                        </ul>
                    </div>
                </div>

                <div class="form-group">
                    <textarea id="journal-content" class="form-input journal-textarea" placeholder="Empieza a escribir aquí..."></textarea>
                    <div class="char-counter"><span id="char-count">0</span> caracteres</div>
                </div>

                <button class="btn-primary full-width" id="save-journal">Guardar en mi Diario</button>
            </div>

            <div class="journal-history card">
                <h3>Entradas Anteriores</h3>
                <div id="journal-list" class="journal-list">
                    <!-- Entradas se cargarán aquí -->
                </div>
            </div>
        </div>
    `;

    const titleInput = document.getElementById('journal-title');
    const contentInput = document.getElementById('journal-content');
    const charCount = document.getElementById('char-count');
    const promptToggle = document.getElementById('toggle-prompts');
    const promptsList = document.getElementById('prompts-list');
    const journalList = document.getElementById('journal-list');

    // Load history
    updateJournalList(journalList);

    // Char counter
    contentInput.addEventListener('input', () => {
        charCount.textContent = contentInput.value.length;
    });

    // Toggle prompts
    promptToggle.addEventListener('click', () => {
        promptsList.classList.toggle('hidden');
    });

    // Save logic
    document.getElementById('save-journal').addEventListener('click', () => {
        const title = titleInput.value.trim();
        const content = contentInput.value.trim();

        if (!content) {
            alert('Por favor, escribe algo en tu diario antes de guardar.');
            return;
        }

        const newEntry = {
            id: Date.now(),
            date: new Date().toISOString(),
            title: title || 'Reflexión sin título',
            content: content
        };

        const db = Storage.getData();
        db.journal.unshift(newEntry);
        Storage.updateKey('journal', db.journal);

        alert('Entrada guardada correctamente.');
        switchView('journal');
    });
}

function updateJournalList(container) {
    const db = Storage.getData();
    
    if (db.journal.length === 0) {
        container.innerHTML = '<p class="empty-state">Aún no tienes entradas en tu diario. Comienza a escribir hoy.</p>';
        return;
    }

    container.innerHTML = db.journal.map(entry => `
        <div class="journal-item">
            <div class="journal-item-header">
                <h4>${entry.title}</h4>
                <span class="entry-date">${new Date(entry.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <p class="entry-preview">${entry.content}</p>
            <div class="entry-actions">
                <button class="btn-text" onclick="viewJournalEntry(${entry.id})">Leer más</button>
                <button class="btn-text danger" onclick="deleteJournalEntry(${entry.id})">Eliminar</button>
            </div>
        </div>
    `).join('');
}

function deleteJournalEntry(id) {
    if (confirm('¿Seguro que deseas eliminar esta entrada del diario?')) {
        const db = Storage.getData();
        db.journal = db.journal.filter(e => e.id !== id);
        Storage.updateKey('journal', db.journal);
        switchView('journal');
    }
}

function viewJournalEntry(id) {
    const db = Storage.getData();
    const entry = db.journal.find(e => e.id === id);
    if (!entry) return;

    // We could use a modal, but for simplicity we'll use an alert or update the editor
    alert(`Título: ${entry.title}\n\nFecha: ${new Date(entry.date).toLocaleString()}\n\nContenido:\n${entry.content}`);
}
