// --- script.js v3 --- Controle da Barra ---

console.log("Script v3 carregado! (Com controle de teclado)");

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- Variáveis da Bola ---
let ballRadius = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let dx = 3;
let dy = -3;

// --- Variáveis da Barra ---
let paddleHeight = 15;
let paddleWidth = 100;
let paddleX = (canvas.width - paddleWidth) / 2; // Começa centralizado
const PADDLE_Y_OFFSET = 20;
let paddleY = canvas.height - paddleHeight - PADDLE_Y_OFFSET;
let paddleSpeed = 7; // Velocidade de movimento da barra

// --- Variáveis de Controle --- << NOVO
let rightPressed = false;
let leftPressed = false;

// --- Listeners de Evento do Teclado --- << NOVO
// Adiciona 'ouvintes' que chamam funções quando teclas são pressionadas/soltas
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

// Função chamada quando uma tecla é PRESSIONADA << NOVO
function keyDownHandler(e) {
    // Verifica qual tecla foi (usando e.key para compatibilidade moderna)
    if(e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if(e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

// Função chamada quando uma tecla é SOLTA << NOVO
function keyUpHandler(e) {
    if(e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if(e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}

// --- Funções de Desenho ---

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#DDDDFF"; // Cor da lua
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
    ctx.fillStyle = "#AAAAFF"; // Cor da barra
    ctx.fill();
    ctx.closePath();
}

// --- Lógica de Movimento e Colisão (Bola) ---

function updateGame() {
    // Move a bola
    ballX += dx;
    ballY += dy;

    // Colisão com paredes laterais (Esquerda/Direita)
    if (ballX + dx > canvas.width - ballRadius || ballX + dx < ballRadius) {
        dx = -dx;
    }

    // Colisão com parede superior E inferior (Temporário)
    if (ballY + dy > canvas.height - ballRadius || ballY + dy < ballRadius) {
        dy = -dy;
    }

    // --- Lógica de Movimento da Barra --- << NOVO (dentro do update geral)
    if(rightPressed) {
        paddleX += paddleSpeed;
        // Impede a barra de sair pela direita
        if (paddleX + paddleWidth > canvas.width){
            paddleX = canvas.width - paddleWidth;
        }
    }
    else if(leftPressed) {
        paddleX -= paddleSpeed;
        // Impede a barra de sair pela esquerda
        if (paddleX < 0){
            paddleX = 0;
        }
    }
    // --- Fim da Lógica da Barra ---
}

// --- Game Loop Principal ---

function gameLoop() {
    // 1. Limpa o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 2. Desenha os elementos
    drawBall();
    drawPaddle();

    // 3. Atualiza posições e verifica colisões/input
    updateGame(); // Agora inclui movimento da barra

    // 4. Pede ao navegador para chamar gameLoop novamente
    requestAnimationFrame(gameLoop);
}

// --- Inicia o Jogo ---
console.log("Iniciando game loop com controle...");
gameLoop(); // Inicia a animação