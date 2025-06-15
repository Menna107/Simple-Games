const words = ["computer", "programming", "game", "words", "play", "cat", "dog", "sun", "book", "fish", "cake", "ball", "star", "bird", "milk",
"tree", "home", "moon", "shoe", "blue", "frog", "lamp", "king", "milk", "pen", "car", "train", "plane",
"ship", "house", "garden", "flower", "river", "mountain", "ocean", "sky"];

let originalWord = "";
let scrambledWord = "";

// Scramble a word
function scramble(word) {
  let arr = word.split('');
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.join('');
}

// Render scrambled word as cards
function renderScrambledWord(scrambled) {
  const container = document.getElementById('scrambledContainer');
  container.innerHTML = "";
  for (const char of scrambled) {
    const card = document.createElement('div');
    card.classList.add('letter-card');
    card.textContent = char.toUpperCase();
    container.appendChild(card);
  }
}

function resetGame() {
  originalWord = words[Math.floor(Math.random() * words.length)];
  scrambledWord = scramble(originalWord);

  renderScrambledWord(scrambledWord);

  document.getElementById('guessInput').value = "";
  document.getElementById('result').textContent = "";
}

// Check the user's guess
function checkGuess() {
  const guess = document.getElementById('guessInput').value.toLowerCase();
  const result = document.getElementById('result');

  if (guess === originalWord) {
    result.textContent = "Correct! 🎉";
    result.style.color = "green";
    confettiEffect();
  } else {
    result.textContent = "Try again!";
    result.style.color = "red";
  }
}

// Confetti animation
function confettiEffect() {
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement("div");
    confetti.style.position = "fixed";
    confetti.style.top = Math.random() * window.innerHeight + "px";
    confetti.style.left = Math.random() * window.innerWidth + "px";
    confetti.style.width = "10px";
    confetti.style.height = "10px";
    confetti.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
    confetti.style.opacity = "0.8";
    confetti.style.borderRadius = "50%";
    confetti.style.zIndex = 1000;
    confetti.style.animation = "fall 2s ease-out forwards";
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 2000);
  }
}

window.onload = resetGame;
