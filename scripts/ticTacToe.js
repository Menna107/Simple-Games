let board = ["", "", "", "", "", "", "", "", ""];
    let currentPlayer = "X";
    let gameOver = false;

    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // columns
      [0, 4, 8],
      [2, 4, 6], // diagonals
    ];

    const cells = document.querySelectorAll(".cell");
    const status = document.getElementById("status");

    // Initialize event listeners
    cells.forEach((cell) => {
      cell.addEventListener("click", () => {
        const index = cell.dataset.index;
        if (!board[index] && !gameOver) {
          board[index] = currentPlayer;
          cell.textContent = currentPlayer;
          cell.classList.add(currentPlayer.toLowerCase()); // add class "x" or "o"
          checkWinner();
          if (!gameOver) {
            switchPlayer();
            updateStatus();
          }
        }
      });
    });

    function checkWinner() {
      for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (
          board[a] &&
          board[a] === board[b] &&
          board[a] === board[c]
        ) {
          celebrate(board[a]);
          gameOver = true;
          return;
        }
      }

      if (!board.includes("")) {
        status.textContent = "It's a tie! Try again.";
        status.style.color = "orange";
        gameOver = true;
      }
    }

    function switchPlayer() {
      currentPlayer = currentPlayer === "X" ? "O" : "X";
    }

    function updateStatus() {
      status.textContent = `${currentPlayer}'s turn`;
      status.style.color = currentPlayer === "X" ? "#e74c3c" : "#3498db";
    }

    function celebrate(winner) {
      status.textContent = `🎉 ${winner} wins! Congrats! 🎉`;
      status.style.color = winner === "X" ? "#e74c3c" : "#3498db";
      confettiEffect();
    }

    function resetGame() {
      board = ["", "", "", "", "", "", "", "", ""];
      gameOver = false;
      currentPlayer = "X";
      cells.forEach((cell) => {
        cell.textContent = "";
        cell.classList.remove("x");
        cell.classList.remove("o");
      });
      updateStatus();
    }

    // Confetti effect from your other game:
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

    // Initial status update
    updateStatus();