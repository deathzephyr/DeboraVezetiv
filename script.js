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
reveal(); // Chama uma vez para verificar itens já visíveis

// 3. EFEITO DE PRIMAVERA (APENAS PÉTALAS)
const canvas = document.getElementById('petalCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let petals = [];

// Ajustar tamanho do canvas
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Classe da Pétala
class Petal {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * -height; // Começa acima da tela
        this.size = Math.random() * 10 + 5;
        this.speedY = Math.random() * 1 + 0.5;
        this.speedX = Math.random() * 2 - 1;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 2 - 1;
        // Tons de rosa e branco
        const colors = ['#ffc0cb', '#ffb7b2', '#ff9aa2', '#ffffff'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random() * 0.5 + 0.3;
    }

    update() {
        this.y += this.speedY;
        this.x += Math.sin(this.y * 0.01) + this.speedX * 0.5; // Movimento de balanço
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
        
        // Desenhar formato de pétala
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(this.size / 2, -this.size / 2, this.size, 0, 0, this.size);
        ctx.bezierCurveTo(-this.size, 0, -this.size / 2, -this.size / 2, 0, 0);
        ctx.fill();
        
        ctx.restore();
    }
}

// Criar pétalas iniciais
const petalCount = window.innerWidth < 768 ? 20 : 40;
for (let i = 0; i < petalCount; i++) {
    petals.push(new Petal());
}

// Loop de animação
function animate() {
    ctx.clearRect(0, 0, width, height);

    // Atualizar e desenhar pétalas
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

// Abrir/Fechar Painel
settingsBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Impede que o clique feche imediatamente
    settingsPanel.classList.toggle('hidden');
});

// Fechar painel se clicar fora
document.addEventListener('click', (e) => {
    if (!settingsPanel.contains(e.target) && !settingsBtn.contains(e.target)) {
        settingsPanel.classList.add('hidden');
    }
});

// Controlar Opacidade
opacitySlider.addEventListener('input', (e) => {
    const val = e.target.value;
    // Atualiza a variável CSS global
    document.documentElement.style.setProperty('--glass-alpha', val);
});

// Controlar Layout (Fileiras)
window.changeLayout = function(type) {
    const grids = document.querySelectorAll('.grid-container');
    let gridTemplate = '';

    switch(type) {
        case '1':
            gridTemplate = '1fr';
            break;
        case '2':
            gridTemplate = 'repeat(2, 1fr)';
            break;
        case '3':
            gridTemplate = 'repeat(3, 1fr)';
            break;
        case 'auto':
            gridTemplate = 'repeat(auto-fit, minmax(280px, 1fr))';
            break;
    }

    // Aplica a todos os containers
    grids.forEach(grid => {
        grid.style.gridTemplateColumns = gridTemplate;
    });
};
