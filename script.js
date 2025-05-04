// --- script.js v5 --- Adiciona Pontuação ---

console.log("Script v5 carregado! (Com Pontuação)");

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- Variáveis da Bola ---
let ballRadius = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height / 3;
let dx = 3;
let dy = 3;

// --- Variáveis da Barra ---
let paddleHeight = 15;
let paddleWidth = 100;
let paddleX = (canvas.width - paddleWidth) / 2;
const PADDLE_Y_OFFSET = 20;
let paddleY = canvas.height - paddleHeight - PADDLE_Y_OFFSET;
let paddleSpeed = 7;

// --- Variáveis de Controle ---
let rightPressed = false;
let leftPressed = false;

// --- Variáveis de Estado do Jogo ---
let gameOver = false;
let animationFrameId;
let score = 0; // <<< VARIÁVEL DA PONTUAÇÃO

// --- Listeners de Evento do Teclado ---
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.key === "Right" || e.key === "ArrowRight") { rightPressed = true; }
    else if(e.key === "Left" || e.key === "ArrowLeft") { leftPressed = true; }
}

function keyUpHandler(e) {
    if(e.key === "Right" || e.key === "ArrowRight") { rightPressed = false; }
    else if(e.key === "Left" || e.key === "ArrowLeft") { leftPressed = false; }
}

// --- Funções de Desenho ---

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#DDDDFF"; // Lua
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
    ctx.fillStyle = "#AAAAFF"; // Barra/Fantasma
    ctx.fill();
    ctx.closePath();
}

// --- NOVA Função para Desenhar a Pontuação ---
function drawScore() {
    ctx.font = "16px Arial"; // Define a fonte
    ctx.fillStyle = "#FFFFFF"; // Define a cor (branco)
    ctx.textAlign = "left"; // Alinha texto à esquerda
    ctx.textBaseline = "top"; // Alinha pelo topo
    // Desenha o texto no canto superior esquerdo com uma pequena margem
    ctx.fillText("Pontos: " + score, 8, 8);
}

function drawGameOver() {
    ctx.font = "48px 'Courier New', Courier, monospace";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
    ctx.font = "20px 'Courier New', Courier, monospace";
    ctx.fillStyle = "white";
    ctx.fillText("Pressione F5 para reiniciar", canvas.width / 2, canvas.height / 2 + 40);
}

// --- Lógica de Movimento e Colisão ---

function updateGame() {
    // Colisão com paredes laterais
    if (ballX + dx > canvas.width - ballRadius || ballX + dx < ballRadius) {
        dx = -dx;
    }

    // Colisão com parede superior
    if (ballY + dy < ballRadius) {
        dy = -dy;
    }
    // Verifica colisão com a parte INFERIOR
    else if (ballY + dy > canvas.height - ballRadius - PADDLE_Y_OFFSET) {
        if (ballY + dy > paddleY - ballRadius) {
            if (ballX > paddleX && ballX < paddleX + paddleWidth) {
                // COLIDIU COM A BARRA!
                dy = -dy;
                score++; // <<< INCREMENTA PONTUAÇÃO AQUI
                console.log("Bateu na barra! Pontos:", score);
            } else {
                 if (ballY + dy > canvas.height - ballRadius) {
                    gameOver = true;
                    console.log("GAME OVER!");
                 }
            }
        }
    }

    // Move a bola
    if (!gameOver) {
        ballX += dx;
        ballY += dy;
    }

    // Move a barra
    if(rightPressed) {
        paddleX += paddleSpeed;
        if (paddleX + paddleWidth > canvas.width){ paddleX = canvas.width - paddleWidth; }
    }
    else if(leftPressed) {
        paddleX -= paddleSpeed;
        if (paddleX < 0){ paddleX = 0; }
    }
}

// --- Game Loop Principal ---

function gameLoop() {
    // 1. Limpa o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 2. Desenha os elementos
    drawBall();
    drawPaddle();
    drawScore(); // <<< DESENHA A PONTUAÇÃO AQUI

    // 3. Atualiza posições e estado do jogo
    if (!gameOver) {
        updateGame();
    } else {
        drawGameOver();
        return; // Para o loop
    }

    // 4. Pede ao navegador para chamar gameLoop novamente
    animationFrameId = requestAnimationFrame(gameLoop);
}

// --- Inicia o Jogo ---
console.log("Iniciando game loop com pontuação...");
gameLoop(); // Inicia a animação