// --- script.js v6 --- Adiciona Vidas ---

console.log("Script v6 carregado! (Com Vidas)");

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- Variáveis da Bola ---
let ballRadius = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height / 3;
let dx = 3;
let dy = 3; // Começar caindo

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
let score = 0;
let lives = 3; // <<< VARIÁVEL DAS VIDAS (começa com 3)

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

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Pontos: " + score, 8, 8);
}

// --- NOVA Função para Desenhar as Vidas ---
function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "right"; // Alinha à direita
    ctx.textBaseline = "top";
    // Desenha no canto superior direito com uma margem
    ctx.fillText("Vidas: " + lives, canvas.width - 8, 8);
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
        if (ballY + dy >= paddleY - ballRadius) { // Verifica se está na altura ou abaixo da barra
            if (ballX > paddleX && ballX < paddleX + paddleWidth) {
                // COLIDIU COM A BARRA!
                dy = -dy;
                score++;
                console.log("Bateu na barra! Pontos:", score);
            } else {
                 // Passou da altura da barra E NÃO estava sobre ela = Perde Vida / Game Over
                 if (ballY + dy > canvas.height - ballRadius) { // Confirma que realmente saiu por baixo
                    lives--; // <<< PERDE UMA VIDA
                    console.log("Vida perdida! Vidas restantes:", lives);
                    if(lives <= 0) { // Verifica se acabaram as vidas
                        gameOver = true; // <<< FIM DE JOGO REAL
                        console.log("GAME OVER!");
                    } else {
                        // Ainda tem vidas: Reseta a posição da bola e da barra
                        ballX = canvas.width / 2;
                        ballY = canvas.height / 3; // Posição inicial segura
                        // Inverte ou randomiza a direção X inicial para variar
                        dx = 3 * (Math.random() < 0.5 ? 1 : -1);
                        dy = 3; // Sempre começa caindo após perder vida
                        paddleX = (canvas.width - paddleWidth) / 2; // Centraliza barra
                    }
                 }
            }
        }
    }


    // Move a bola somente se o jogo não acabou
    if (!gameOver) {
        ballX += dx;
        ballY += dy;
    }

    // Move a barra (paddle)
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
    drawScore();
    drawLives(); // <<< DESENHA AS VIDAS AQUI

    // 3. Atualiza posições e estado do jogo
    if (!gameOver) {
        updateGame();
    } else {
        // Se o jogo acabou, desenha a mensagem de Game Over e PARA o loop
        drawGameOver();
        // cancelAnimationFrame(animationFrameId); // Descomente se quiser parar explicitamente
        return; // Sai da função gameLoop
    }

    // 4. Pede ao navegador para chamar gameLoop novamente
    animationFrameId = requestAnimationFrame(gameLoop);
}

// --- Inicia o Jogo ---
console.log("Iniciando game loop com vidas...");
gameLoop(); // Inicia a animação