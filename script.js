console.log("Script carregado!"); // Mensagem para verificar no console do navegador

// Pega a referência do elemento <canvas> do HTML pelo ID
const canvas = document.getElementById('gameCanvas');

// Pega o "contexto" de desenho 2D do canvas
// É através do 'ctx' que vamos desenhar formas, imagens, etc.
const ctx = canvas.getContext('2d');

// Verifica se o canvas e o contexto foram obtidos com sucesso
if (canvas && ctx) {
    console.log("Canvas e contexto 2D obtidos com sucesso!");

    // Define a cor do preenchimento para branco
    ctx.fillStyle = 'white';

    // Desenha um retângulo preenchido
    // ctx.fillRect(x, y, largura, altura);
    ctx.fillRect(50, 50, 100, 100); // Um quadrado branco 100x100 na posição (50, 50)

    console.log("Retângulo desenhado no canvas.");

} else {
    console.error("Não foi possível obter o canvas ou o contexto 2D.");
}