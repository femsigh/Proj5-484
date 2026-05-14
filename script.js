// Game state variables
let map; // Google Maps instance
let currentQuestionIndex = 0; // Tracks which location the user is guessing
let correctCount = 0; // Number of correct guesses so far
let gameActive = true; // Whether the game is waiting for a guess
let currentRectangle = null; // Currently displayed rectangle (correct answer)
let currentMarker = null; // Currently displayed marker (correct answer)
//exta functionality
let timerInterval;
let timeLeft = 30;
// CSUN Locationss: assigned Asian American Activities Center - B6 + Chicano House - D5 + JD Jacaranda Hall - E5 + Sequoia Hall - E4 + Santa Susana Hall - D2
// Each location has a name, center point, and a bounding rectangle.
// Bounds define the correct area for a double‑click guess.
const locations = [
  // Each object has name, center (for marker), and bounding box (for hit detection)
  {
    name: "Asian American Activities Center - B6",
    center: { lat: 34.24432, lng: -118.53363 },
    bounds: {
      north: 34.24482,
      south: 34.24382,
      east: -118.53293,
      west: -118.53433,
    },
  },
  {
    name: "Chicano House - D5",
    center: { lat: 34.24242, lng: -118.52987 },
    bounds: {
      north: 34.24292,
      south: 34.24192,
      east: -118.52917,
      west: -118.53057,
    },
  },
  {
    name: "JD Jacaranda Hall - E5",
    center: { lat: 34.2411, lng: -118.52829 },
    bounds: {
      north: 34.2416,
      south: 34.2406,
      east: -118.52759,
      west: -118.52899,
    },
  },
  {
    name: "Sequoia Hall - E4",
    center: { lat: 34.24047, lng: -118.52782 },
    bounds: {
      north: 34.24097,
      south: 34.23997,
      east: -118.52712,
      west: -118.52852,
    },
  },
  {
    name: "Santa Susana Hall - D2",
    center: { lat: 34.23785, lng: -118.52942 },
    bounds: {
      north: 34.23835,
      south: 34.23735,
      east: -118.52872,
      west: -118.53012,
    },
  },
];

// Initialize the map – called by Google Maps API when the script loads
function initMap() {
  // Center map on CSUN main campus
  const csunCenter = { lat: 34.2385, lng: -118.529 };

  map = new google.maps.Map(document.getElementById("map"), {
    center: csunCenter,
    zoom: 16, // Close enough to distinguish buildings
    // disableDefaultUI: false,
    zoomControl: false, // Zooming disabled (requirement)
    panControl: false, // Panning disabled (requirement)
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: true,
    draggable: false, // prevents dragging (panning)
    scrollwheel: false, // prevents zooming with mouse wheel
  });

  map.setOptions({ disableDoubleClickZoom: true }); // Disable zoom on double-click
  // Listen for double‑click events to register user guesses
  map.addListener("dblclick", (event) => {
    if (!gameActive) return; // Ignore clicks while feedback is showing
    const clickedLatLng = event.latLng;
    checkGuess(clickedLatLng);
  });
  let savedHigh = localStorage.getItem("csunHighScore");
  if (savedHigh)
    document.getElementById("highScoreDisplay").innerText = savedHigh;
  else document.getElementById("highScoreDisplay").innerText = "0";
  // Load the first location
  loadNextLocation();
}

// Load the next location question and reset the UI for a new guess
function loadNextLocation() {
  // Remove previous rectangle and marker from the map
  if (currentRectangle) {
    currentRectangle.setMap(null);
  }
  if (currentMarker) {
    currentMarker.setMap(null);
  }

  // when all questions have been answered, end the game
  if (currentQuestionIndex >= locations.length) {
    endGame();
    return;
  }

  // Update UI with the name of the location to find
  const currentLoc = locations[currentQuestionIndex];
  document.getElementById("currentLocation").innerHTML =
    `Find: <strong>${currentLoc.name}</strong>`;
  document.getElementById("questionNum").innerText = currentQuestionIndex + 1;
  document.getElementById("message").innerHTML =
    "DOUBLE-Click on the map where you think this location is!";
  document.getElementById("message").style.background = "rgba(0,0,0,0.3)";

  // guess again
  gameActive = true;
  startTimer();
}

// Verify where the clicked point lies inside the current location's rectangle
function checkGuess(clickedPoint) {
  const currentLoc = locations[currentQuestionIndex];
  const bounds = currentLoc.bounds;

  const lat = clickedPoint.lat();
  const lng = clickedPoint.lng();

  const isCorrect =
    lat >= bounds.south &&
    lat <= bounds.north &&
    lng >= bounds.west &&
    lng <= bounds.east;

  if (isCorrect) {
    // CORRECT GUESS
    correctCount++;
    updateScoreDisplay();

    showFeedback("CORRECT! ", "#4CAF50"); // Green feedback

    // Show a green rectangle around the correct location
    drawLocationRectangle(currentLoc.bounds, "#4CAF50", 0.4);
    addMarker(currentLoc.center, "Correct", "#4CAF50");

    clearInterval(timerInterval); // Stop the timer on a correct guess
    // Disable further guesses and move to next question after a short delay
    gameActive = false;
    setTimeout(() => {
      currentQuestionIndex++;
      loadNextLocation();
    }, 2000);
  } else {
    // INCORRECT GUESS – show where the correct location actually is
    showFeedback(
      `Wrong! That's not the ${currentLoc.name}. Showing correct location...`,
      "#f44336",
    ); // Red feedback

    // Draw a red rectangle to reveal the correct area
    drawLocationRectangle(currentLoc.bounds, "#FF0000", 0.5);
    addMarker(currentLoc.center, `Correct: ${currentLoc.name}`, "#FF0000");

    // Move to the next question after a longer delay
    gameActive = false;
    setTimeout(() => {
      currentQuestionIndex++;
      loadNextLocation();
    }, 2500);
  }
}

// Draw a semi‑transparent rectangle on the map to indicate the correct area
function drawLocationRectangle(bounds, color, opacity) {
  if (currentRectangle) {
    currentRectangle.setMap(null);
  }

  currentRectangle = new google.maps.Rectangle({
    strokeColor: color,
    strokeOpacity: 0.9,
    strokeWeight: 3,
    fillColor: color,
    fillOpacity: opacity,
    map: map,
    bounds: bounds,
  });
}

// Place a marker at the exact center of the location (for feedback)
function addMarker(position, title, color) {
  if (currentMarker) {
    currentMarker.setMap(null);
  }

  // Use Google's standard coloured marker dots (green for correct, red for wrong)
  const markerIcon = {
    url: `http://maps.google.com/mapfiles/ms/icons/${color === "#4CAF50" ? "green" : "red"}-dot.png`,
    scaledSize: new google.maps.Size(40, 40),
  };

  currentMarker = new google.maps.Marker({
    position: position,
    map: map,
    title: title,
    icon: markerIcon,
    animation: google.maps.Animation.DROP,
  });

  // Automatically pan the map so the correct spot is visible
  map.panTo(position);
}

// Display a temporary message with a coloured background (also triggers a CSS pulse animation)
function showFeedback(message, color) {
  const msgDiv = document.getElementById("message");
  msgDiv.innerHTML = message;
  msgDiv.style.background = color;
  msgDiv.style.color = "white";
  msgDiv.classList.add("pulse-animation");

  // Remove the animation class after it finishes to allow re‑triggering
  setTimeout(() => {
    msgDiv.classList.remove("pulse-animation");
  }, 500);
}

// Update the score display in the info panel
function updateScoreDisplay() {
  document.getElementById("correctCount").innerText = correctCount;
}

// End the game: show final score and deactivate guessing
function endGame() {
  gameActive = false;
  clearInterval(timerInterval);
  const total = locations.length;
  const message = `GAME OVER!\nYou got ${correctCount} out of ${total} correct!`;

  document.getElementById("message").innerHTML = message;
  document.getElementById("message").style.background = "#9C27B0";
  document.getElementById("currentLocation").innerHTML =
    `Final Score: ${correctCount}/${total}`;
  updateHighScore();
  // If the player got a perfect score, add a celebratory marker
  if (correctCount === total) {
    addMarker({ lat: 34.2385, lng: -118.529 }, "PERFECT SCORE!", "#4CAF50");
  }
}

// Reset the game to the first question, clearing all visual feedback
function resetGame() {
  clearInterval(timerInterval);
  currentQuestionIndex = 0;
  correctCount = 0;
  gameActive = true;
  updateScoreDisplay();

  // Clear the map of any rectangles or markers
  if (currentRectangle) {
    currentRectangle.setMap(null);
    currentRectangle = null;
  }
  if (currentMarker) {
    currentMarker.setMap(null);
    currentMarker = null;
  }

  // Reposition the map view back to the center of CSUN
  map.setCenter({ lat: 34.2385, lng: -118.529 });
  map.setZoom(16);

  // Start over from the first location
  loadNextLocation();
}
// EXTRA FUNC. :Timer function
function startTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timeLeft = 30;
  document.getElementById("timerDisplay").innerText = timeLeft;
  timerInterval = setInterval(() => {
    if (!gameActive) return;
    timeLeft--;
    document.getElementById("timerDisplay").innerText = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      showFeedback(" Time's up! Showing correct location...", "#ff9800");
      const currentLoc = locations[currentQuestionIndex];
      drawLocationRectangle(currentLoc.bounds, "#FF0000", 0.5);
      addMarker(currentLoc.center, `✓ Correct: ${currentLoc.name}`, "#FF0000");
      gameActive = false;
      setTimeout(() => {
        currentQuestionIndex++;
        loadNextLocation();
      }, 2000);
    }
  }, 1000);
}

// EXTRA FUNC. :High score
function updateHighScore() {
  let highScore = localStorage.getItem("csunHighScore");
  if (!highScore) highScore = 0;
  if (correctCount > parseInt(highScore)) {
    localStorage.setItem("csunHighScore", correctCount);
    highScore = correctCount;
    showFeedback(" NEW HIGH SCORE! ", "#FFD700");
  }
  document.getElementById("highScoreDisplay").innerText = highScore;
}

// Attach the reset button event listener after the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const resetBtn = document.getElementById("resetBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", resetGame);
  }
});

// Make the initialization function globally accessible for the Google Maps callback
window.initMap = initMap;
