// 1. CÁLCULO DE IDADE
document.addEventListener('DOMContentLoaded', () => {
    const birthDate = new Date('2009-03-23'); 
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    const ageDisplay = document.getElementById('age-display');
    if (ageDisplay) {
        ageDisplay.textContent = `${age} Anos`;
    }

    // Inicializar o Player de Vídeo
    initVideoPlayer();
});

// 2. ANIMAÇÃO DE ENTRADA AO ROLAR
window.addEventListener('scroll', reveal);
function reveal(){
    var reveals = document.querySelectorAll('.reveal');
    for(var i = 0; i < reveals.length; i++){
        var windowheight = window.innerHeight;
        var revealtop = reveals[i].getBoundingClientRect().top;
        var revealpoint = 100;

        if(revealtop < windowheight - revealpoint){
            reveals[i].classList.add('active');
        }
    }
}
reveal(); 

// 3. EFEITO DE PRIMAVERA (APENAS PÉTALAS)
const canvas = document.getElementById('petalCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let petals = [];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Petal {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * -height; 
        this.size = Math.random() * 10 + 5;
        this.speedY = Math.random() * 1 + 0.5;
        this.speedX = Math.random() * 2 - 1;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 2 - 1;
        const colors = ['#ffc0cb', '#ffb7b2', '#ff9aa2', '#ffffff'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random() * 0.5 + 0.3;
    }

    update() {
        this.y += this.speedY;
        this.x += Math.sin(this.y * 0.01) + this.speedX * 0.5; 
        this.rotation += this.rotationSpeed;

        if (this.y > height) {
            this.y = -20;
            this.x = Math.random() * width;
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(this.size / 2, -this.size / 2, this.size, 0, 0, this.size);
        ctx.bezierCurveTo(-this.size, 0, -this.size / 2, -this.size / 2, 0, 0);
        ctx.fill();
        
        ctx.restore();
    }
}

const petalCount = window.innerWidth < 768 ? 20 : 40;
for (let i = 0; i < petalCount; i++) {
    petals.push(new Petal());
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    petals.forEach(petal => {
        petal.update();
        petal.draw();
    });
    requestAnimationFrame(animate);
}
animate();

// ==========================================
// 4. CONFIGURAÇÕES (ENGRENAGEM)
// ==========================================

const settingsBtn = document.getElementById('settings-btn');
const settingsPanel = document.getElementById('settings-panel');
const opacitySlider = document.getElementById('opacity-slider');

settingsBtn.addEventListener('click', (e) => {
    e.stopPropagation(); 
    settingsPanel.classList.toggle('hidden');
});

document.addEventListener('click', (e) => {
    if (!settingsPanel.contains(e.target) && !settingsBtn.contains(e.target)) {
        settingsPanel.classList.add('hidden');
    }
});

opacitySlider.addEventListener('input', (e) => {
    const val = e.target.value;
    document.documentElement.style.setProperty('--glass-alpha', val);
});

window.changeLayout = function(type) {
    const grids = document.querySelectorAll('.grid-container');
    let gridTemplate = '';

    switch(type) {
        case '1': gridTemplate = '1fr'; break;
        case '2': gridTemplate = 'repeat(2, 1fr)'; break;
        case '3': gridTemplate = 'repeat(3, 1fr)'; break;
        case 'auto': gridTemplate = 'repeat(auto-fit, minmax(280px, 1fr))'; break;
    }

    grids.forEach(grid => {
        grid.style.gridTemplateColumns = gridTemplate;
    });
};

// ==========================================
// 5. LÓGICA DO PLAYER DE VÍDEO
// ==========================================
function initVideoPlayer() {
    const video = document.getElementById('mainVideo');
    const centerPlayBtn = document.getElementById('centerPlayBtn');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const progressArea = document.getElementById('progressArea');
    const progressBar = document.getElementById('progressBar');
    const videoTime = document.getElementById('videoTime');
    
    // Ícones SVG
    const playIcon = document.getElementById('playIcon');
    const pauseIcon = document.getElementById('pauseIcon');

    function togglePlay() {
        if (video.paused) {
            video.play();
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
            centerPlayBtn.style.display = 'none'; // Esconde o botão grande
        } else {
            video.pause();
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
            centerPlayBtn.style.display = 'flex'; // Mostra o botão grande
        }
    }

    // Event Listeners
    centerPlayBtn.addEventListener('click', togglePlay);
    playPauseBtn.addEventListener('click', togglePlay);
    video.addEventListener('click', togglePlay); // Clicar no video também pausa

    // Atualizar barra de progresso
    video.addEventListener('timeupdate', () => {
        const progress = (video.currentTime / video.duration) * 100;
        progressBar.style.width = `${progress}%`;
        
        // Atualizar timer
        let currentMin = Math.floor(video.currentTime / 60);
        let currentSec = Math.floor(video.currentTime % 60);
        if (currentSec < 10) currentSec = `0${currentSec}`;
        
        let durationMin = Math.floor(video.duration / 60) || 0;
        let durationSec = Math.floor(video.duration % 60) || 0;
        if (durationSec < 10) durationSec = `0${durationSec}`;

        videoTime.textContent = `${currentMin}:${currentSec} / ${durationMin}:${durationSec}`;
    });

    // Clicar na barra para avançar/retroceder
    progressArea.addEventListener('click', (e) => {
        const progressWidth = progressArea.clientWidth;
        const clickedOffsetX = e.offsetX;
        const duration = video.duration;
        
        video.currentTime = (clickedOffsetX / progressWidth) * duration;
    });
            }
