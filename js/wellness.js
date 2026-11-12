/**
 * Mente en Equilibrio - Wellness Module
 */

function renderWellness(container) {
    const db = Storage.getData();
    const completedTasks = db.wellness.completedTasks || [];

    const activities = [
        { id: 'task-1', title: 'Pausa Consciente', desc: 'Tómate 5 minutos para observar tu entorno sin juzgar.', icon: '🧘', color: '#E3F2FD' },
        { id: 'task-2', title: 'Descanso Digital', desc: 'Apaga las pantallas 30 minutos antes de dormir.', icon: '📵', color: '#F3E5F5' },
        { id: 'task-3', title: 'Pequeño Logro', desc: 'Reconoce algo que hayas hecho bien hoy, por pequeño que sea.', icon: '🏆', color: '#E8F5E9' },
        { id: 'task-4', title: 'Hidratación', desc: 'Bebe un vaso de agua con plena conciencia.', icon: '💧', color: '#E0F7FA' },
        { id: 'task-5', title: 'Gratitud', desc: 'Escribe tres cosas por las que estés agradecido.', icon: '🙏', color: '#FFF3E0' },
        { id: 'task-6', title: 'Movimiento', desc: 'Estira tu cuerpo durante 2 minutos.', icon: '🚶', color: '#FCE4EC' }
    ];

    container.innerHTML = `
        <div class="view-header">
            <h1>Actividades de Bienestar</h1>
            <p>Pequeñas acciones diarias que hacen una gran diferencia.</p>
        </div>

        <div class="wellness-grid">
            ${activities.map(task => `
                <div class="card wellness-card ${completedTasks.includes(task.id) ? 'completed' : ''}" data-task-id="${task.id}">
                    <div class="wellness-icon" style="background-color: ${task.color}">${task.icon}</div>
                    <div class="wellness-info">
                        <h3>${task.title}</h3>
                        <p>${task.desc}</p>
                    </div>
                    <div class="wellness-check">
                        <div class="checkbox-ui"></div>
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="card info-card help-section">
            <h3>Ayuda y Orientación</h3>
            <p>Recuerda que no estás solo. Si sientes que tus emociones te sobrepasan, hablar con alguien de confianza es el primer paso.</p>
            <ul class="help-tips">
                <li>Habla con un amigo o familiar cercano.</li>
                <li>Contacta a un orientador escolar o profesor.</li>
                <li>Si lo necesitas, busca ayuda de un profesional de la salud mental.</li>
            </ul>
            <p class="disclaimer"><strong>Importante:</strong> Esta aplicación es una herramienta de apoyo y reflexión, pero no reemplaza el diagnóstico ni el tratamiento de un psicólogo o psiquiatra.</p>
        </div>
    `;

    // Toggle Task Completion
    document.querySelectorAll('.wellness-card').forEach(card => {
        card.addEventListener('click', () => {
            const taskId = card.getAttribute('data-task-id');
            const index = completedTasks.indexOf(taskId);

            if (index > -1) {
                completedTasks.splice(index, 1);
                card.classList.remove('completed');
            } else {
                completedTasks.push(taskId);
                card.classList.add('completed');
            }

            db.wellness.completedTasks = completedTasks;
            db.wellness.lastUpdate = new Date().toISOString();
            Storage.updateKey('wellness', db.wellness);
        });
    });
}
