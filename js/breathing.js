/**
 * Mente en Equilibrio - Breathing Module
 */

function renderBreathing(container) {
    container.innerHTML = `
        <div class="view-header">
            <h1>Ejercicios de Respiración</h1>
            <p>Tómate un momento para calmar tu mente y relajar tu cuerpo.</p>
        </div>

        <div class="breathing-container card">
            <div class="breathing-circle-container">
                <div class="breathing-circle" id="breathing-circle"></div>
                <div class="breathing-text" id="breathing-text">Listo para empezar</div>
            </div>

            <div class="breathing-controls">
                <div class="timer-display" id="timer-display">02:00</div>
                <div class="controls-row">
                    <button class="btn-primary" id="start-breathing">Comenzar</button>
                    <button class="btn-secondary hidden" id="stop-breathing">Detener</button>
                </div>
                <p class="breathing-instruction">Sigue el movimiento del círculo: expande al inhalar, contrae al exhalar.</p>
            </div>
        </div>

        <div class="card info-card">
            <h3>¿Por qué respirar conscientemente?</h3>
            <p>La respiración profunda ayuda a reducir el estrés, mejora la concentración y permite que tu sistema nervioso se relaje de forma natural.</p>
        </div>
    `;

    const circle = document.getElementById('breathing-circle');
    const text = document.getElementById('breathing-text');
    const timerDisplay = document.getElementById('timer-display');
    const startBtn = document.getElementById('start-breathing');
    const stopBtn = document.getElementById('stop-breathing');

    let timerInterval = null;
    let breathingInterval = null;
    let timeLeft = 120; // 2 minutes

    function updateTimer() {
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        timerDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            stopExercise();
            alert('¡Excelente trabajo! Has completado tu sesión de respiración.');
        }
        timeLeft--;
    }

    function startBreathingCycle() {
        let cycle = 0;
        const phases = [
            { text: 'Inhala...', class: 'inhale', duration: 4000 },
            { text: 'Mantén...', class: 'hold', duration: 2000 },
            { text: 'Exhala...', class: 'exhale', duration: 4000 }
        ];

        function nextPhase() {
            const phase = phases[cycle % phases.length];
            text.textContent = phase.text;
            circle.className = 'breathing-circle ' + phase.class;
            
            breathingInterval = setTimeout(() => {
                cycle++;
                nextPhase();
            }, phase.duration);
        }

        nextPhase();
    }

    function stopExercise() {
        clearInterval(timerInterval);
        clearTimeout(breathingInterval);
        timerInterval = null;
        breathingInterval = null;
        
        circle.className = 'breathing-circle';
        text.textContent = 'Sesión terminada';
        startBtn.classList.remove('hidden');
        stopBtn.classList.add('hidden');
        timeLeft = 120;
    }

    startBtn.addEventListener('click', () => {
        startBtn.classList.add('hidden');
        stopBtn.classList.remove('hidden');
        
        timeLeft = 120;
        updateTimer();
        timerInterval = setInterval(updateTimer, 1000);
        startBreathingCycle();
    });

    stopBtn.addEventListener('click', stopExercise);
}
