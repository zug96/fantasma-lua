// --- script.js v10 --- Corrige Tamanho da Barra ---

console.log("Script v10 carregado! (Corrige Tamanho Barra)");

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- Carregamento de Imagens ---
let paddleImg = new Image();
let ballImg = new Image();
let imagesLoaded = 0;
const TOTAL_IMAGES = 2;

// --- Variáveis da Bola ---
let ballRadius = 15; // Raio para hitbox e desenho escalado
let ballX, ballY, dx, dy;

// --- Variáveis da Barra (COM TAMANHOS FIXOS PARA GAMEPLAY) ---
let paddleHeight = 20; // Altura desejada para a barra no jogo (ajuste se precisar)
let paddleWidth = 110; // Largura desejada para a barra no jogo (ajuste se precisar)
let paddleX; // Posição X inicial será calculada
const PADDLE_Y_OFFSET = 20;
let paddleY = canvas.height - paddleHeight - PADDLE_Y_OFFSET; // Posição Y fixa
let paddleSpeed = 7;

// --- Variáveis de Controle e Estado ---
let rightPressed = false;
let leftPressed = false;
let gameOver = false;
let score = 0;
let lives = 3;
let animationFrameId;


// --- Função chamada quando CADA imagem termina de carregar ---
function imageLoaded() {
    imagesLoaded++;
    console.log(`Imagem carregada (${imagesLoaded}/${TOTAL_IMAGES}): ${this.src.split('/').pop()}`);
    if (imagesLoaded === TOTAL_IMAGES) {
        // NÃO ajustamos mais paddleWidth/Height aqui para naturalWidth/Height
        // Apenas garantimos que as posições iniciais são calculadas
        console.log("Todas as imagens carregadas, iniciando jogo...");
        resetGame(); // Define posições iniciais usando os tamanhos FIXOS
        gameOver = false;
        gameLoop(); // Inicia o loop de animação
    }
}

// Define .onload ANTES de .src
paddleImg.onload = imageLoaded;
ballImg.onload = imageLoaded;

paddleImg.src = 'imagem_BARRA_jogo-fantasma-e-a-lua.png';
ballImg.src = 'imagem_BOLA_jogo-fantasma-e-a-lua.png';


// --- Listeners e Handlers ---
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("click", mouseClickHandler, false);
function keyDownHandler(e) { if(e.key === "Right" || e.key === "ArrowRight") { rightPressed = true; } else if(e.key === "Left" || e.key === "ArrowLeft") { leftPressed = true; } }
function keyUpHandler(e) { if(e.key === "Right" || e.key === "ArrowRight") { rightPressed = false; } else if(e.key === "Left" || e.key === "ArrowLeft") { leftPressed = false; } }
function mouseClickHandler(e) { if(gameOver) { console.log("Reiniciando..."); resetGame(); gameOver = false; cancelAnimationFrame(animationFrameId); gameLoop(); } }

// --- Função de Reset ---
function resetGame() {
    score = 0;
    lives = 3;
    ballX = canvas.width / 2;
    ballY = canvas.height / 3;
    dx = 3 * (Math.random() < 0.5 ? 1 : -1);
    dy = 3;
    // Usa os valores FIXOS de paddleWidth para centralizar
    paddleX = (canvas.width - paddleWidth) / 2;
    rightPressed = false;
    leftPressed = false;
}

// --- Funções de Desenho ---
function drawBall() {
    // Desenha a imagem da bola ESCALADA para ballRadius * 2
    if (ballImg.naturalWidth > 0) {
        ctx.drawImage(ballImg, ballX - ballRadius, ballY - ballRadius, ballRadius * 2, ballRadius * 2);
    } else { // Fallback
        ctx.beginPath(); ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2); ctx.fillStyle = "#FF0000"; ctx.fill(); ctx.closePath();
    }
}

function drawPaddle() {
     // Desenha a imagem da barra ESCALADA para paddleWidth e paddleHeight definidos
     if (paddleImg.naturalWidth > 0) {
        ctx.drawImage(paddleImg, paddleX, paddleY, paddleWidth, paddleHeight); // Usa as variáveis FIXAS de tamanho
     } else { // Fallback
        ctx.beginPath(); ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight); ctx.fillStyle = "#FF0000"; ctx.fill(); ctx.closePath();
     }
}

// Funções drawScore, drawLives, drawGameOver (Iguais)
function drawScore() { ctx.font = "16px Arial"; ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "left"; ctx.textBaseline = "top"; ctx.fillText("Pontos: " + score, 8, 8); }
function drawLives() { ctx.font = "16px Arial"; ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "right"; ctx.textBaseline = "top"; ctx.fillText("Vidas: " + lives, canvas.width - 8, 8); }
function drawGameOver() { ctx.font = "48px 'Courier New', Courier, monospace"; ctx.fillStyle = "red"; ctx.textAlign = "center"; ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2); ctx.font = "20px 'Courier New', Courier, monospace"; ctx.fillStyle = "white"; ctx.fillText("Clique para reiniciar", canvas.width / 2, canvas.height / 2 + 40); }

// --- Lógica de Movimento e Colisão ---
// Usa as variáveis FIXAS paddleWidth, paddleHeight, ballRadius para colisão
function updateGame() { /* ...código IGUAL ao v9... */ if (ballX + dx > canvas.width - ballRadius || ballX + dx < ballRadius) { dx = -dx; } if (ballY + dy < ballRadius) { dy = -dy; } else if (ballY + dy > canvas.height - ballRadius - PADDLE_Y_OFFSET) { if (ballY + dy >= paddleY - ballRadius) { /* Checa Y */ if (ballX + ballRadius > paddleX && ballX - ballRadius < paddleX + paddleWidth) { /* Checa X */ dy = -dy; score++; /* console.log("Bateu! Pontos:", score); */ } else { if (ballY + dy > canvas.height - ballRadius) { lives--; console.log("Vida perdida! Vidas:", lives); if(lives <= 0) { gameOver = true; console.log("GAME OVER!"); } else { ballX = canvas.width / 2; ballY = canvas.height / 3; dx = 3 * (Math.random() < 0.5 ? 1 : -1); dy = 3; paddleX = (canvas.width - paddleWidth) / 2; } } } } } if (!gameOver){ ballX += dx; ballY += dy; } if(rightPressed) { paddleX += paddleSpeed; if (paddleX + paddleWidth > canvas.width){ paddleX = canvas.width - paddleWidth; } } else if(leftPressed) { paddleX -= paddleSpeed; if (paddleX < 0){ paddleX = 0; } } }


// --- Game Loop Principal ---
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa (fundo vem do CSS)
    drawBall();     // Desenha imagem da bola (escalada)
    drawPaddle();   // Desenha imagem da barra (escalada)
    drawScore();
    drawLives();
    if (!gameOver) {
        updateGame();
        animationFrameId = requestAnimationFrame(gameLoop);
    } else {
        drawGameOver();
    }
}

// --- Inicia o Jogo ---
console.log("Aguardando carregamento das imagens...");
// A inicialização AGUARDA o carregamento das imagens na função imageLoaded()
// E a função imageLoaded agora NÃO mexe mais nos tamanhos fixos da barra.