const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const cellSize = 60;
const rows = 8;
const cols = 5;

let dragging = false;
let currentColor = null;
let currentPath = [];
let gameOver = false;

const points = {
  green: [[0, 1], [4, 7]],
  red: [[1, 3], [4, 1]],
  yellow: [[0, 5], [2, 7]],
  blue: [[0, 0], [2, 0]]
};

let completedPaths = {};

function drawGrid() {
  ctx.strokeStyle = "#1c3f3f";
  ctx.lineWidth = 1;
  for (let i = 0; i <= rows; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * cellSize);
    ctx.lineTo(cols * cellSize, i * cellSize);
    ctx.stroke();
  }
  for (let j = 0; j <= cols; j++) {
    ctx.beginPath();
    ctx.moveTo(j * cellSize, 0);
    ctx.lineTo(j * cellSize, rows * cellSize);
    ctx.stroke();
  }
}

function drawCircle(x, y, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x * cellSize + cellSize / 2, y * cellSize + cellSize / 2, 15, 0, Math.PI * 2);
  ctx.fill();
}

function drawPath(path, color) {
  if (path.length < 2) return;
  ctx.strokeStyle = color;
  ctx.lineWidth = 20;
  ctx.lineCap = "round";
  ctx.beginPath();

  const [startX, startY] = path[0];
  ctx.moveTo(startX * cellSize + cellSize / 2, startY * cellSize + cellSize / 2);

  for (let i = 1; i < path.length; i++) {
    const [x, y] = path[i];
    ctx.lineTo(x * cellSize + cellSize / 2, y * cellSize + cellSize / 2);
  }

  ctx.stroke();
}

function drawAll() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();

  for (let color in completedPaths) {
    drawPath(completedPaths[color], color);
  }

  if (currentPath.length > 1 && currentColor) {
    drawPath(currentPath, currentColor);
  }

  for (const color in points) {
    const [start, end] = points[color];
    drawCircle(...start, color);
    drawCircle(...end, color);
  }
}

function getCellFromCoords(x, y) {
  const rect = canvas.getBoundingClientRect();
  const cellX = Math.floor((x - rect.left) / cellSize);
  const cellY = Math.floor((y - rect.top) / cellSize);
  return [cellX, cellY];
}

function isCellUsed(x, y) {
  for (let color in completedPaths) {
    for (let [px, py] of completedPaths[color]) {
      if (px === x && py === y) return true;
    }
  }
  return false;
}

canvas.addEventListener("mousedown", (e) => {
  if (gameOver) return;
  const [cx, cy] = getCellFromCoords(e.clientX, e.clientY);
  if (cx < 0 || cy < 0 || cx >= cols || cy >= rows) return;

  for (const color in points) {
    for (const [x, y] of points[color]) {
      if (cx === x && cy === y && !completedPaths[color]) {
        dragging = true;
        currentColor = color;
        currentPath = [[x, y]];
        drawAll();
        return;
      }
    }
  }
});
canvas.addEventListener("mousemove", (e) => {
  if (!dragging || gameOver) return;
  const [cx, cy] = getCellFromCoords(e.clientX, e.clientY);
  if (cx < 0 || cy < 0 || cx >= cols || cy >= rows) return;

  const last = currentPath[currentPath.length - 1];
  const dx = Math.abs(cx - last[0]);
  const dy = Math.abs(cy - last[1]);
  const isAdjacent = (dx + dy === 1);
  const alreadyUsed = currentPath.some(([x, y]) => x === cx && y === cy);

  // Check if the cell is a constant point (start or end points of any color)
  const isConstPoint = Object.values(points).some(pairs =>
    pairs.some(([x, y]) => x === cx && y === cy)
  );

  // Allow drawing over a constant point only if it belongs to the current color's start or end point
  const isAllowedConstPoint =
    (cx === points[currentColor][0][0] && cy === points[currentColor][0][1]) ||
    (cx === points[currentColor][1][0] && cy === points[currentColor][1][1]);

  if (isAdjacent && !alreadyUsed && !isCellUsed(cx, cy) && (!isConstPoint || isAllowedConstPoint)) {
    currentPath.push([cx, cy]);
    drawAll();
  }
});


canvas.addEventListener("mouseup", (e) => {
  if (!dragging || gameOver) return;

  const last = currentPath[currentPath.length - 1];
  const [lx, ly] = last;

  const isEndpoint = points[currentColor].some(([x, y]) => x === lx && y === ly);
  const [start, end] = points[currentColor];
  const startMatch = (start[0] === currentPath[0][0] && start[1] === currentPath[0][1]);
  const endMatch = (end[0] === lx && end[1] === ly);
  const reverseStartMatch = (end[0] === currentPath[0][0] && end[1] === currentPath[0][1]);
  const reverseEndMatch = (start[0] === lx && start[1] === ly);

  if ((startMatch && endMatch) || (reverseStartMatch && reverseEndMatch)) {
    completedPaths[currentColor] = [...currentPath];
  }

  dragging = false;
  currentColor = null;
  currentPath = [];
  drawAll();
  checkWinOrLose();
});

function checkWinOrLose() {
  if (Object.keys(completedPaths).length === Object.keys(points).length) {
    celebrate();
  }
}

function celebrate() {
  gameOver = true;
  confettiEffect();
}

function confettiEffect() {
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.top = Math.random() * window.innerHeight + 'px';
    confetti.style.left = Math.random() * window.innerWidth + 'px';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
    confetti.style.opacity = '0.8';
    confetti.style.borderRadius = '50%';
    confetti.style.zIndex = 1000;
    confetti.style.animation = 'fall 2s ease-out forwards';
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 2000);
  }
}

function getRandomFreeCell(usedCells) {
  while (true) {
    const x = Math.floor(Math.random() * cols);
    const y = Math.floor(Math.random() * rows);

    // Check if this cell is already used
    if (!usedCells.some(([ux, uy]) => ux === x && uy === y)) {
      return [x, y];
    }
  }
}


function startGame() {
  dragging = false;
  currentColor = null;
  currentPath = [];
  completedPaths = {};
  gameOver = false;

  // Used cells tracker to avoid overlapping points
  const usedCells = [];

  // Colors list
  const colors = ["green", "red", "yellow", "blue"];

  // Randomize points object
  for (const color of colors) {
    // Generate two distinct random points for each color
    const point1 = getRandomFreeCell(usedCells);
    usedCells.push(point1);
    let point2;
    do {
      point2 = getRandomFreeCell(usedCells);
    } while (point2[0] === point1[0] && point2[1] === point1[1]);
    usedCells.push(point2);

    points[color] = [point1, point2];
  }

  drawAll();
}

// Start the game
startGame();