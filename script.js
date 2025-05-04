// --- script.js v7 --- Reinício Após Game Over ---

console.log("Script v7 carregado! (Com Reinício)");

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- Variáveis da Bola ---
let ballRadius = 10;
let ballX, ballY; // Posições serão definidas no início/reset
let dx, dy; // Velocidades serão definidas no início/reset

// --- Variáveis da Barra ---
let paddleHeight = 15;
let paddleWidth = 100;
let paddleX; // Posição será definida no início/reset
const PADDLE_Y_OFFSET = 20;
let paddleY = canvas.height - paddleHeight - PADDLE_Y_OFFSET; // Y é fixo
let paddleSpeed = 7;

// --- Variáveis de Controle ---
let rightPressed = false;
let leftPressed = false;

// --- Variáveis de Estado do Jogo ---
let gameOver = false;
let score = 0;
let lives = 3;
let animationFrameId;

// --- Listeners de Evento ---
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("click", mouseClickHandler, false); // <<< NOVO LISTENER DE CLIQUE

// --- Handlers de Evento ---
function keyDownHandler(e) {
    if(e.key === "Right" || e.key === "ArrowRight") { rightPressed = true; }
    else if(e.key === "Left" || e.key === "ArrowLeft") { leftPressed = true; }
}

function keyUpHandler(e) {
    if(e.key === "Right" || e.key === "ArrowRight") { rightPressed = false; }
    else if(e.key === "Left" || e.key === "ArrowLeft") { leftPressed = false; }
}

// --- NOVA Função Handler de Clique ---
function mouseClickHandler(e) {
    // Só faz algo se o jogo tiver acabado
    if(gameOver) {
        console.log("Clique detectado após Game Over. Reiniciando...");
        resetGame(); // Chama a função para resetar as variáveis
        gameOver = false; // Define que o jogo não está mais acabado
        gameLoop(); // Reinicia o loop de animação
    }
}

// --- NOVA Função para Resetar o Jogo ---
function resetGame() {
    score = 0;
    lives = 3;
    ballX = canvas.width / 2;
    ballY = canvas.height / 3;
    // Direção X inicial aleatória, Y sempre caindo
    dx = 3 * (Math.random() < 0.5 ? 1 : -1);
    dy = 3;
    paddleX = (canvas.width - paddleWidth) / 2;
    rightPressed = false; // Garante que as teclas não fiquem 'presas'
    leftPressed = false;
    // gameOver já será setado como false no handler
}

// --- Funções de Desenho ---
function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#DDDDFF"; ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
    ctx.fillStyle = "#AAAAFF"; ctx.fill();
    ctx.closePath();
}

function drawScore() {
    ctx.font = "16px Arial"; ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "left"; ctx.textBaseline = "top";
    ctx.fillText("Pontos: " + score, 8, 8);
}

function drawLives() {
    ctx.font = "16px Arial"; ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "right"; ctx.textBaseline = "top";
    ctx.fillText("Vidas: " + lives, canvas.width - 8, 8);
}

function drawGameOver() {
    ctx.font = "48px 'Courier New', Courier, monospace"; ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
    ctx.font = "20px 'Courier New', Courier, monospace"; ctx.fillStyle = "white";
    // Mudança na instrução
    ctx.fillText("Clique para reiniciar", canvas.width / 2, canvas.height / 2 + 40);
}

// --- Lógica de Movimento e Colisão ---
function updateGame() {
    // Colisão com paredes laterais
    if (ballX + dx > canvas.width - ballRadius || ballX + dx < ballRadius) { dx = -dx; }
    // Colisão com parede superior
    if (ballY + dy < ballRadius) { dy = -dy; }
    // Verifica colisão com a parte INFERIOR
    else if (ballY + dy > canvas.height - ballRadius - PADDLE_Y_OFFSET) {
        if (ballY + dy >= paddleY - ballRadius) {
            if (ballX > paddleX && ballX < paddleX + paddleWidth) {
                dy = -dy; score++; console.log("Bateu! Pontos:", score);
            } else {
                 if (ballY + dy > canvas.height - ballRadius) {
                    lives--; console.log("Vida perdida! Vidas:", lives);
                    if(lives <= 0) {
                        gameOver = true; console.log("GAME OVER!");
                    } else {
                        // Reseta posições parciais (bola/barra) ao perder vida
                        ballX = canvas.width / 2; ballY = canvas.height / 3;
                        dx = 3 * (Math.random() < 0.5 ? 1 : -1); dy = 3;
                        paddleX = (canvas.width - paddleWidth) / 2;
                    }
                 }
            }
        }
    }

    // Move a bola (somente se não for game over - verificação já no loop principal)
    ballX += dx;
    ballY += dy;

    // Move a barra
    if(rightPressed) {
        paddleX += paddleSpeed;
        if (paddleX + paddleWidth > canvas.width){ paddleX = canvas.width - paddleWidth; }
    } else if(leftPressed) {
        paddleX -= paddleSpeed;
        if (paddleX < 0){ paddleX = 0; }
    }
}

// --- Game Loop Principal ---
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();

    if (!gameOver) {
        updateGame();
        // Continua o loop apenas se o jogo não acabou
        animationFrameId = requestAnimationFrame(gameLoop);
    } else {
        // Se o jogo acabou, desenha a mensagem e PARA aqui.
        // O loop só será reiniciado pelo clique do mouse.
        drawGameOver();
    }
}

// --- Inicia o Jogo ---
console.log("Iniciando jogo com reinício...");
resetGame(); // <<< CHAMA resetGame para definir posições/velocidades iniciais
gameOver = false; // Garante que começa não-game over
gameLoop(); // Inicia a animação