const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const headImage = document.getElementById("headImage");

let snake = [{ x: 150, y: 150 }];
let food = { x: 60, y: 60 };
let dx = 10;
let dy = 0;
let score = 0;
let isPaused = false;
let gameInterval;

function draw() {
  if (isPaused) return;

  // Calcular siguiente cabeza
  const newHead = { x: snake[0].x + dx, y: snake[0].y + dy };

  // Colisiones con paredes o consigo misma
  if (
    newHead.x < 0 || newHead.y < 0 ||
    newHead.x >= canvas.width || newHead.y >= canvas.height ||
    snake.some(p => p.x === newHead.x && p.y === newHead.y)
  ) {
    alert("Game Over");
    resetGame();
    return;
  }

  // Insertar nueva cabeza
  snake.unshift(newHead);

  // Comer comida
  if (newHead.x === food.x && newHead.y === food.y) {
    score++;
    scoreEl.textContent = score;
    food = {
      x: Math.floor(Math.random() * 30) * 10,
      y: Math.floor(Math.random() * 30) * 10
    };
  } else {
    snake.pop();
  }

  // Dibujar escena
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dibujar comida
  ctx.fillStyle = "#FF00FF";
  ctx.shadowColor = "#FF00FF";
  ctx.shadowBlur = 10;
  ctx.fillRect(food.x, food.y, 10, 10);
  ctx.shadowBlur = 0;

  // Dibujar cuerpo (sin la cabeza)
  ctx.fillStyle = "#00FFFF";
  ctx.shadowColor = "#00FFFF";
  ctx.shadowBlur = 8;
  snake.slice(1).forEach(part => ctx.fillRect(part.x, part.y, 10, 10));

  // Dibujar cabeza con imagen o color por defecto
  const head = snake[0];
  if (headImage && headImage.complete && headImage.naturalHeight !== 0) {
    // Dibujar imagen más grande y centrarla sobre la celda (20x20)
    const imgSize = 20;
    const offset = (imgSize - 10) / 2; // centrar respecto a la celda de 10x10
    ctx.drawImage(headImage, head.x - offset, head.y - offset, imgSize, imgSize);
  } else {
    ctx.fillRect(head.x, head.y, 10, 10);
  }

  ctx.shadowBlur = 0;
}

function resetGame() {
  snake = [{ x: 150, y: 150 }];
  dx = 10;
  dy = 0;
  score = 0;
  scoreEl.textContent = score;
  isPaused = false;
  document.getElementById("pause").textContent = "Pausar";
}

function togglePause() {
  isPaused = !isPaused;
  document.getElementById("pause").textContent = isPaused ? "Reanudar" : "Pausar";
}

// Movimiento con teclado
document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp" && dy === 0) { dx = 0; dy = -10; }
  if (e.key === "ArrowDown" && dy === 0) { dx = 0; dy = 10; }
  if (e.key === "ArrowLeft" && dx === 0) { dx = -10; dy = 0; }
  if (e.key === "ArrowRight" && dx === 0) { dx = 10; dy = 0; }
});

// Botones táctiles
document.getElementById("up").addEventListener("click", () => { if (dy === 0) { dx = 0; dy = -10; } });
document.getElementById("down").addEventListener("click", () => { if (dy === 0) { dx = 0; dy = 10; } });
document.getElementById("left").addEventListener("click", () => { if (dx === 0) { dx = -10; dy = 0; } });
document.getElementById("right").addEventListener("click", () => { if (dx === 0) { dx = 10; dy = 0; } });

// Botones de acción
document.getElementById("pause").addEventListener("click", togglePause);
document.getElementById("restart").addEventListener("click", resetGame);

gameInterval = setInterval(draw, 100);
