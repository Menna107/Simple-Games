// search.js

// List of games with their page URLs
const games = [
  { name: "tic tac toe", url: "tic-tac-toe.html" },
  { name: "memory cards", url: "memory-cards.html" },
  { name: "word scramble", url: "word-scramble.html" },
  { name: "guess the movie", url: "guess-the-movie.html" },
  { name: "flow free", url: "flow-free.html" },
];

// Function to handle the search
function handleSearch() {
  const input = document.querySelector(".search-input").value.trim().toLowerCase();

  if (!input) {
    alert("Please enter a game name to search.");
    return;
  }

  // Find game that includes the search text
  const game = games.find(g => g.name.includes(input));

  if (game) {
    // Redirect to the game page
    window.location.href = game.url;
  } else {
    alert("Sorry, no game found with that name.");
  }
}

// Add event listeners after the page loads
window.addEventListener("DOMContentLoaded", () => {
  const searchButton = document.querySelector(".search-button");
  const searchInput = document.querySelector(".search-input");

  // On button click
  searchButton.addEventListener("click", handleSearch);

  // On Enter key press inside input
  searchInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  });
});
