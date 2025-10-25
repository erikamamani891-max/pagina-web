// Configuración del canvas
const canvas = document.getElementById('artCanvas');
const ctx = canvas.getContext('2d');

// Configurar tamaño del canvas
canvas.width = Math.min(window.innerWidth * 0.9, 1200);
canvas.height = Math.min(window.innerHeight * 0.6, 600);

// Variables de estado
let mode = 0;
const modes = ['Círculos Concéntricos', 'Espiral Cósmica', 'Partículas Mágicas', 'Ondas Psicodélicas'];
let colorScheme = 0;
const colorSchemes = [
    ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'],
    ['#00D9FF', '#7000FF', '#FF00E5', '#00FFA3'],
    ['#FFD93D', '#FF6B35', '#6BCB77', '#4D96FF'],
    ['#F72585', '#7209B7', '#3A0CA3', '#4361EE']
];
let particles = [];
let autoAnimate = false;
let animationFrame = 0;

// Elementos del DOM
const changeModeBtn = document.getElementById('changeMode');
const changeColorBtn = document.getElementById('changeColor');
const clearCanvasBtn = document.getElementById('clearCanvas');
const autoAnimateCheckbox = document.getElementById('autoAnimate');
const modeDisplay = document.getElementById('modeDisplay');
const particleCountDisplay = document.getElementById('particleCount');

// Clase Partícula
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 2;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = colorSchemes[colorScheme][Math.floor(Math.random() * 4)];
        this.life = 100;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= 1;
        if (this.size > 0.2) this.size -= 0.05;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.life / 100;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

// Función para dibujar círculos concéntricos
function drawConcentricCircles(x, y) {
    const colors = colorSchemes[colorScheme];
    for (let i = 0; i < 5; i++) {
        ctx.strokeStyle = colors[i % colors.length];
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, (i + 1) * 20, 0, Math.PI * 2);
        ctx.stroke();
    }
}

// Función para dibujar espiral
function drawSpiral(x, y) {
    const colors = colorSchemes[colorScheme];
    ctx.strokeStyle = colors[Math.floor(Math.random() * colors.length)];
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let angle = 0; angle < Math.PI * 4; angle += 0.1) {
        const radius = angle * 5;
        const spiralX = x + Math.cos(angle) * radius;
        const spiralY = y + Math.sin(angle) * radius;
        
        if (angle === 0) {
            ctx.moveTo(spiralX, spiralY);
        } else {
            ctx.lineTo(spiralX, spiralY);
        }
    }
    ctx.stroke();
}

// Función para crear partículas
function createParticles(x, y) {
    for (let i = 0; i < 5; i++) {
        particles.push(new Particle(x, y));
    }
}

// Función para dibujar ondas
function drawWaves(x, y) {
    const colors = colorSchemes[colorScheme];
    ctx.strokeStyle = colors[Math.floor(Math.random() * colors.length)];
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    for (let i = 0; i < canvas.width; i += 10) {
        const waveY = y + Math.sin((i + x) * 0.05) * 30;
        if (i === 0) {
            ctx.moveTo(i, waveY);
        } else {
            ctx.lineTo(i, waveY);
        }
    }
    ctx.stroke();
}

// Actualizar y dibujar partículas
function updateParticles() {
    particles = particles.filter(particle => particle.life > 0);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    particleCountDisplay.textContent = `Partículas: ${particles.length}`;
}

// Eventos del mouse
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    switch(mode) {
        case 0:
            drawConcentricCircles(x, y);
            break;
        case 1:
            drawSpiral(x, y);
            break;
        case 2:
            createParticles(x, y);
            break;
        case 3:
            drawWaves(x, y);
            break;
    }
});

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Efecto especial en clic
    for (let i = 0; i < 20; i++) {
        createParticles(x, y);
    }
});

// Eventos de botones
changeModeBtn.addEventListener('click', () => {
    mode = (mode + 1) % modes.length;
    modeDisplay.textContent = `Modo: ${modes[mode]}`;
});

changeColorBtn.addEventListener('click', () => {
    colorScheme = (colorScheme + 1) % colorSchemes.length;
});

clearCanvasBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = [];
    particleCountDisplay.textContent = 'Partículas: 0';
});

autoAnimateCheckbox.addEventListener('change', (e) => {
    autoAnimate = e.target.checked;
    if (autoAnimate) {
        animate();
    }
});

// Animación automática
function animate() {
    if (!autoAnimate) return;
    
    animationFrame++;
    
    // Crear arte automáticamente
    if (animationFrame % 5 === 0) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        
        switch(mode) {
            case 0:
                drawConcentricCircles(x, y);
                break;
            case 1:
                drawSpiral(x, y);
                break;
            case 2:
                createParticles(x, y);
                break;
            case 3:
                drawWaves(x, y);
                break;
        }
    }
    
    updateParticles();
    requestAnimationFrame(animate);
}

// Loop de animación para partículas
function particleLoop() {
    if (mode === 2 || particles.length > 0) {
        updateParticles();
    }
    requestAnimationFrame(particleLoop);
}

particleLoop();

// Redimensionar canvas
window.addEventListener('resize', () => {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    tempCtx.drawImage(canvas, 0, 0);
    
    canvas.width = Math.min(window.innerWidth * 0.9, 1200);
    canvas.height = Math.min(window.innerHeight * 0.6, 600);
    
    ctx.drawImage(tempCanvas, 0, 0);
});

// Mensaje inicial
ctx.font = '24px Segoe UI';
ctx.fillStyle = '#667eea';
ctx.textAlign = 'center';
ctx.fillText('¡Mueve el mouse para crear arte!', canvas.width / 2, canvas.height / 2);
