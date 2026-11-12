/**
 * Mente en Equilibrio - Statistics Module
 */

function renderStats(container) {
    const db = Storage.getData();
    const emotions = db.emotions || [];

    if (emotions.length === 0) {
        container.innerHTML = `
            <div class="view-header">
                <h1>Tus Estadísticas</h1>
                <p>Analiza tu progreso emocional a lo largo del tiempo.</p>
            </div>
            <div class="card empty-stats">
                <div class="empty-icon">📈</div>
                <h3>Aún no hay suficientes datos</h3>
                <p>Registra tus emociones durante unos días para ver tus gráficos de evolución.</p>
                <button class="btn-primary" onclick="document.querySelector('[data-view=\\'emotions\\']').click()">Registrar mi primera emoción</button>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="view-header">
            <h1>Tus Estadísticas</h1>
            <p>Visualiza cómo ha evolucionado tu bienestar en los últimos días.</p>
        </div>

        <div class="stats-overview">
            <div class="card stat-mini">
                <span class="mini-label">Total de Registros</span>
                <span class="mini-value">${emotions.length}</span>
            </div>
            <div class="card stat-mini">
                <span class="mini-label">Emoción más frecuente</span>
                <span class="mini-value" id="most-frequent-mood">-</span>
            </div>
            <div class="card stat-mini">
                <span class="mini-label">Promedio Intensidad</span>
                <span class="mini-value" id="avg-intensity">-</span>
            </div>
        </div>

        <div class="charts-grid">
            <div class="card chart-card">
                <h3>Evolución de los últimos 7 días</h3>
                <div class="chart-container">
                    <canvas id="line-chart"></canvas>
                </div>
            </div>
            <div class="card chart-card">
                <h3>Distribución de Emociones</h3>
                <div class="chart-container">
                    <canvas id="pie-chart"></canvas>
                </div>
            </div>
        </div>

        <div class="card stats-footer">
            <p><strong>Nota:</strong> Estos gráficos muestran tendencias basadas en tus registros personales. No son diagnósticos médicos. Si sientes que necesitas apoyo profesional, consulta la sección de Ayuda.</p>
        </div>
    `;

    // Process Data
    processStats(emotions);
}

function processStats(emotions) {
    // 1. Most Frequent Mood
    const moodCounts = {};
    let totalIntensity = 0;
    
    emotions.forEach(e => {
        moodCounts[e.mood] = (moodCounts[e.mood] || 0) + 1;
        totalIntensity += e.intensity;
    });

    const sortedMoods = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]);
    document.getElementById('most-frequent-mood').textContent = sortedMoods[0][0];
    document.getElementById('avg-intensity').textContent = (totalIntensity / emotions.length).toFixed(1);

    // 2. Line Chart (Last 7 days)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        last7Days.push(d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }));
    }

    // Map intensities to dates
    const intensityByDay = new Array(7).fill(0);
    const countByDay = new Array(7).fill(0);

    emotions.forEach(e => {
        const eDate = new Date(e.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
        const dayIndex = last7Days.indexOf(eDate);
        if (dayIndex > -1) {
            intensityByDay[dayIndex] += e.intensity;
            countByDay[dayIndex]++;
        }
    });

    const avgIntensityByDay = intensityByDay.map((val, i) => countByDay[i] ? (val / countByDay[i]).toFixed(1) : 0);

    const ctxLine = document.getElementById('line-chart').getContext('2d');
    new Chart(ctxLine, {
        type: 'line',
        data: {
            labels: last7Days,
            datasets: [{
                label: 'Intensidad Emocional Promedio',
                data: avgIntensityByDay,
                borderColor: '#7164D8',
                backgroundColor: 'rgba(113, 100, 216, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 6,
                pointBackgroundColor: '#7164D8'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: { beginAtZero: true, max: 5, ticks: { stepSize: 1 } }
            },
            plugins: { legend: { display: false } }
        }
    });

    // 3. Pie Chart (Mood Distribution)
    const ctxPie = document.getElementById('pie-chart').getContext('2d');
    const moodLabels = sortedMoods.map(m => m[0]);
    const moodData = sortedMoods.map(m => m[1]);
    const colors = ['#7164D8', '#5D50C4', '#4CAF50', '#FF9800', '#F44336', '#9C27B0'];

    new Chart(ctxPie, {
        type: 'doughnut',
        data: {
            labels: moodLabels,
            datasets: [{
                data: moodData,
                backgroundColor: colors.slice(0, moodLabels.length),
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}
