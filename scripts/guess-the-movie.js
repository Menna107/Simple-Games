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
  "كباريه",
  "تيتو",
  "إبراهيم الأبيض",
  "واحد صفر",
  "البدلة",
  "الفيل الأزرق 2",
  "كارما",
  "ولاد رزق",
  "إكس لارج",
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

  displayedMovie.forEach(char => {
    const letterCard = document.createElement("div");
    letterCard.classList.add("letter-card");

    if (char === " ") {
      letterCard.style.border = "none";
      letterCard.style.background = "transparent";
      letterCard.textContent = " ";
      letterCard.style.width = "30px";
      letterCard.style.boxShadow = "none";
    } else {
      letterCard.textContent = char;
    }

    filmDiv.appendChild(letterCard);
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

  if (chosenMovie.includes(letter)) {
    for (let i = 0; i < chosenMovie.length; i++) {
      if (chosenMovie[i] === letter) {
        displayedMovie[i] = letter;
      }
    }
    updateMovieDisplay();

    if (!displayedMovie.includes("-")) {
      messageP.style.color = "green";
      messageP.textContent = "🎉 Congratulations! You guessed the movie correctly!";
      disableAllLetterCards();
      confettiEffect();
    }
  } else {
    wrongLetters.push(letter);
    attemptsLeft--;
    updateWrongLetters();

    if (attemptsLeft === 0) {
      messageP.style.color = "red";
      messageP.textContent = `You lost! Try again later.`;
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
    confetti.style.animation = `fall 2s ease-out forwards`;
    confetti.style.animationDelay = `${Math.random() * 2}s`;

    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 3000);
  }
}

startGame();
