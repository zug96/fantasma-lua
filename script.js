// --- script.js v4 --- Colisão Barra-Bola e Game Over ---

console.log("Script v4 carregado! (Colisão e Game Over)");

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- Variáveis da Bola ---
let ballRadius = 10;
let ballX = canvas.width / 2;
let ballY = canvas.height / 3; // Começar um pouco mais acima
let dx = 3; // Velocidade X
let dy = 3; // Velocidade Y (começar caindo)

// --- Variáveis da Barra ---
let paddleHeight = 15;
let paddleWidth = 100;
let paddleX = (canvas.width - paddleWidth) / 2;
const PADDLE_Y_OFFSET = 20; // Distância da borda inferior
let paddleY = canvas.height - paddleHeight - PADDLE_Y_OFFSET;
let paddleSpeed = 7;

// --- Variáveis de Controle ---
let rightPressed = false;
let leftPressed = false;

// --- Variável de Estado do Jogo --- <<< NOVO
let gameOver = false;
let animationFrameId; // Para referência futura se quisermos parar/cancelar a animação

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

// --- NOVA Função para Desenhar Game Over ---
function drawGameOver() {
    ctx.font = "48px 'Courier New', Courier, monospace";
    ctx.fillStyle = "red";
    ctx.textAlign = "center"; // Centraliza o texto horizontalmente
    // Desenha o texto no meio do canvas
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);

    // Adiciona instrução para reiniciar
    ctx.font = "20px 'Courier New', Courier, monospace";
    ctx.fillStyle = "white";
    ctx.fillText("Pressione F5 para reiniciar", canvas.width / 2, canvas.height / 2 + 40);
}

// --- Lógica de Movimento e Colisão ---

function updateGame() {
    // Colisão com paredes laterais (Esquerda/Direita)
    if (ballX + dx > canvas.width - ballRadius || ballX + dx < ballRadius) {
        dx = -dx;
    }

    // Colisão com parede superior
    if (ballY + dy < ballRadius) {
        dy = -dy; // Rebate no topo
    }
    // Verifica colisão com a parte INFERIOR (Barra ou Fim de Jogo)
    else if (ballY + dy > canvas.height - ballRadius - PADDLE_Y_OFFSET) {
        // Verifica se está na altura da barra (ou quase passando)
        if (ballY + dy > paddleY - ballRadius) {
            // Verifica se a bola está HORIZONTALMENTE sobre a barra
            if (ballX > paddleX && ballX < paddleX + paddleWidth) {
                // COLIDIU COM A BARRA!
                dy = -dy; // Inverte a direção vertical
                console.log("Bateu na barra!");
                // Opcional: Poderíamos adicionar um pequeno ajuste em 'dx' ou 'dy'
                // para tornar o ângulo de rebatida mais interessante, mas fica pra depois.
            } else {
                // Passou da altura da barra mas NÃO estava sobre ela horizontalmente
                // Verifica se realmente saiu da tela por baixo
                 if (ballY + dy > canvas.height - ballRadius) {
                    gameOver = true; // Define o estado de fim de jogo
                    console.log("GAME OVER!");
                 }
            }
        }
        // Se ainda não chegou na altura exata da barra, continua caindo (não faz nada aqui)
    }


    // Move a bola somente se o jogo não acabou
    if (!gameOver) {
        ballX += dx;
        ballY += dy;
    }


    // Move a barra (paddle)
    if(rightPressed) {
        paddleX += paddleSpeed;
        // Impede a barra de sair pela direita
        if (paddleX + paddleWidth > canvas.width){ paddleX = canvas.width - paddleWidth; }
    }
    else if(leftPressed) {
        paddleX -= paddleSpeed;
        // Impede a barra de sair pela esquerda
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

    // 3. Atualiza posições e estado do jogo
    updateGame(); // Agora inclui verificação de colisão com barra e game over

    // 4. Verifica se o jogo acabou
    if (gameOver) {
        // Se sim, desenha a mensagem de Game Over e PARA o loop
        drawGameOver();
        // Poderíamos usar cancelAnimationFrame(animationFrameId) se tivéssemos guardado o ID,
        // mas simplesmente retornar já impede a próxima chamada a requestAnimationFrame.
        return;
    }

    // 5. Pede ao navegador para chamar gameLoop novamente (continua a animação)
    animationFrameId = requestAnimationFrame(gameLoop); // Guarda o ID se quisermos cancelar depois
}

// --- Inicia o Jogo ---
console.log("Iniciando game loop com colisão e game over...");
gameLoop(); // Inicia a animação