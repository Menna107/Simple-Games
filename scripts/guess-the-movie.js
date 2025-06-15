const movies = [
  "جعلتني مجرما",
  "صعيدي في الجامعة الامريكية",
  "اللمبي",
  "الجزيرة",
  "عمارة يعقوبيان",
  "الكنز",
  "الفيل الازرق",
  "حسن ومرقص",
  "البحث عن ليلى",
  "سهر الليالي",
  "تيتو",
  "ابراهيم الابيض",
  "واحد صفر",
  "البدلة",
  "الفيل الأزرق 2",
  "كارما",
  "ولاد رزق",
  "اكس لارج",
  "تراب الماس"
];

const arabicLetters = [
  "ا", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر", "ز", "س",
  "ش", "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ك", "ل", "م",
  "ن", "ه", "و", "ي", "ة", "ء", "ؤ"
];

let chosenMovie = "";
let displayedMovie = [];
let wrongLetters = [];
let attemptsLeft = 9;
let usedMovies = [];

const messageP = document.getElementById("message");
const lettersContainer = document.getElementById("lettersContainer");
const filmDiv = document.querySelector(".film");
const wrongWordsList = document.getElementById("wrongWordsList");
const restartBtn = document.querySelector(".start-button");

filmDiv.style.direction = "rtl";

function normalize(text) {
  return text
    .replace(/أ|إ|آ/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ً|ٌ|ٍ|َ|ُ|ِ|ّ|ْ/g, "");
}

function startGame() {
  if (usedMovies.length === movies.length) {
    alert("You've guessed all movies! The list will reset.");
    usedMovies = [];
  }

  do {
    chosenMovie = movies[Math.floor(Math.random() * movies.length)];
  } while (usedMovies.includes(chosenMovie));

  usedMovies.push(chosenMovie);

  displayedMovie = [];
  wrongLetters = [];
  attemptsLeft = 9;
  messageP.textContent = "";

  for (let char of chosenMovie) {
    if (char === " ") {
      displayedMovie.push(" ");
    } else {
      displayedMovie.push("-");
    }
  }

  updateMovieDisplay();
  updateWrongLetters();
  fillLettersContainer();
}
function updateMovieDisplay() {
  filmDiv.innerHTML = "";

  displayedMovie.forEach((char, index) => {
    const letterCard = document.createElement("div");
    letterCard.classList.add("letter-card");

    if (char === " ") {
      const dotDiv = document.createElement("div");
      dotDiv.textContent = ".";
      dotDiv.style.color = "#00ffcc";
      dotDiv.style.fontWeight = "bold";
      dotDiv.style.fontSize = "20px";
      dotDiv.style.margin = "0 8px";
      dotDiv.style.display = "flex";
      dotDiv.style.alignItems = "center";
      dotDiv.style.justifyContent = "center";
      dotDiv.style.border = "none";
      dotDiv.style.background = "transparent";
      dotDiv.style.boxShadow = "none";
      filmDiv.appendChild(dotDiv);
    } else {
      letterCard.textContent = char;
      filmDiv.appendChild(letterCard);
    }
  });
}

function updateWrongLetters() {
  const cards = wrongWordsList.querySelectorAll(".filmCard");
  cards.forEach(card => {
    card.textContent = "";
    card.style.backgroundColor = "#fff";
  });

  wrongLetters.forEach((letter, index) => {
    if (index < cards.length) {
      cards[index].textContent = letter;
      cards[index].style.backgroundColor = "#ff4444";
      cards[index].style.color = "#fff";
      cards[index].style.fontWeight = "bold";
      cards[index].style.display = "flex";
      cards[index].style.justifyContent = "center";
      cards[index].style.alignItems = "center";
      cards[index].style.fontSize = "24px";
      cards[index].style.borderRadius = "8px";
      cards[index].style.boxShadow = "0 2px 6px rgba(255, 0, 0, 0.4)";
    }
  });

  let attemptsInfo = document.querySelector(".attempts-info");
  if (!attemptsInfo) {
    attemptsInfo = document.createElement("p");
    attemptsInfo.classList.add("attempts-info");
    wrongWordsList.parentNode.appendChild(attemptsInfo);
  }
  attemptsInfo.textContent = `You have only ${attemptsLeft} attempts left!`;
  attemptsInfo.style.marginTop = "10px";
  attemptsInfo.style.fontWeight = "bold";
  attemptsInfo.style.color = "#00ffcc";
}

function fillLettersContainer() {
  lettersContainer.innerHTML = "";

  arabicLetters.forEach((letter) => {
    const letterCard = document.createElement("div");
    letterCard.classList.add("letter-card");
    letterCard.textContent = letter;

    letterCard.addEventListener("click", () => {
      handleLetterClick(letter, letterCard);
    });

    lettersContainer.appendChild(letterCard);
  });
}

function handleLetterClick(letter, cardElement) {
  cardElement.style.pointerEvents = "none";
  cardElement.style.opacity = "0.5";

  if (normalize(chosenMovie).includes(normalize(letter))) {
    for (let i = 0; i < chosenMovie.length; i++) {
      if (normalize(chosenMovie[i]) === normalize(letter)) {
        displayedMovie[i] = chosenMovie[i];
      }
    }
    updateMovieDisplay();

    if (!displayedMovie.includes("-")) {
      messageP.style.color = "green";
      messageP.textContent = `🎉 Congratulations! You guessed the movie correctly! It was: ${chosenMovie}`;
      disableAllLetterCards();
      confettiEffect();
    }
  } else {
    if (!wrongLetters.includes(letter)) {
      wrongLetters.push(letter);
      attemptsLeft--;
    }
    updateWrongLetters();

    if (attemptsLeft === 0) {
      messageP.style.color = "red";
      messageP.textContent = `You lost! The movie was: ${chosenMovie}`;
      revealMovie();
      disableAllLetterCards();
    }
  }
}

function disableAllLetterCards() {
  const filmCard = lettersContainer.querySelectorAll(".letter-card");
  filmCard.forEach((filmCard) => {
    filmCard.style.pointerEvents = "none";
    filmCard.style.opacity = "0.5";
  });
}

function revealMovie() {
  displayedMovie = chosenMovie.split("");
  updateMovieDisplay();
}

restartBtn.addEventListener("click", startGame);

function confettiEffect() {
  if (!document.getElementById("confetti-style")) {
    const style = document.createElement('style');
    style.id = "confetti-style";
    style.textContent = `
      @keyframes fall {
        to {
          transform: translateY(100vh) rotate(720deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

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
    confetti.style.animation = `fall ${2 + Math.random() * 2}s ease-out forwards`;
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 4000);
  }
}

startGame();
