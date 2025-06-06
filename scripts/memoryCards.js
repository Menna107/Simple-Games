const fruits = ['🍎', '🍌', '🍇', '🍓', '🍍', '🍉', '🍒', '🥝'];
let cardValues = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;

let timer = 0;
let timerInterval;
let timerStarted = false;

function startGame() {
  const board = document.getElementById('game-board');
  board.innerHTML = '';
  cardValues = shuffle([...fruits, ...fruits]);

  cardValues.forEach(animal => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.animal = animal;
    card.textContent = '';
    card.addEventListener('click', flipCard);
    board.appendChild(card);
  });

  firstCard = null;
  secondCard = null;
  lockBoard = false;
  matchedPairs = 0;
  timer = 0;
  timerStarted = false;
  clearInterval(timerInterval);
  updateTimer();

  // Reset timer div style & make it visible
  const timerDiv = document.getElementById('timer');
  timerDiv.style.color = 'white';
  timerDiv.style.display = 'block';

  // Remove old win message if any
  const oldMessage = document.getElementById('win-message');
  if (oldMessage) oldMessage.remove();
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function flipCard() {
  if (lockBoard || this === firstCard) return;

  if (!timerStarted) {
    timerStarted = true;
    timerInterval = setInterval(() => {
      timer++;
      updateTimer();
    }, 1000);
  }

  this.classList.add('flipped');
  this.textContent = this.dataset.animal;

  if (!firstCard) {
    firstCard = this;
  } else {
    secondCard = this;
    lockBoard = true;

    if (firstCard.dataset.animal === secondCard.dataset.animal) {
      firstCard.removeEventListener('click', flipCard);
      secondCard.removeEventListener('click', flipCard);
      matchedPairs++;
      firstCard = null;
      secondCard = null;
      lockBoard = false;

      if (matchedPairs === fruits.length) {
        clearInterval(timerInterval);
        celebrate();
      }
    } else {
      setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        firstCard.textContent = '';
        secondCard.textContent = '';
        firstCard = null;
        secondCard = null;
        lockBoard = false;
      }, 1000);
    }
  }
}

function updateTimer() {
  document.getElementById('timer').textContent = `Time: ${timer}s`;
}

function celebrate() {
  const timerDiv = document.getElementById('timer');
  timerDiv.textContent = `🎉 Congratulations! You won in ${timer} seconds!`;
  timerDiv.style.color = 'lime';

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

// Add confetti animation CSS
const style = document.createElement('style');
style.textContent = `
@keyframes fall {
  to {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
  }
}`;
document.head.appendChild(style);

// Start game initially
startGame();
