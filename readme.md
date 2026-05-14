# CSUN Location Guessing Game

## Project Description

Web-based location guessing game using the Google Maps JavaScript API.
Find five specific locations on the CSUN campus.
For each location, the user double-clicks on the map where they think the building is. After each guess, the map shows a green rectangle for a correct answer or a red rectangle (on the correct location) for a wrong answer.
The game tracks the score, includes a 30-second timer per question, and stores the highest score in the browser.

- All panning and zooming are disabled.
- Double-click guessing,
- Disabled panning/zooming,
- Visual feedback (green/red rectangles),
- Five locations (assigned: Asian American Activities Center - B6),
- final score display,
- reset button,
- two extra features (timer and persistent high score).

## Files

- `index.html` – Structure of the web page, UI elements, and Google Maps API script.
- `style.css` – Visual styling (layout, colors, animations).
- `script.js` – Game logic, Google Maps integration, event handling, timer, and high score.


-Double-click to guess:  `map.addListener("dblclick", ...)` in `initMap()` calls `checkGuess()`. 
-Panning disabled: `draggable: false` in map options. 
-Zooming disabled:`zoomControl: false`, `scrollwheel: false`, `disableDoubleClickZoom: true`. 
-Correct guess = green rectangle on correct location: `drawLocationRectangle()` with green color and opacity. 
-Incorrect guess = red rectangle on correct location: `drawLocationRectangle()` with red color and opacity on the correct bounds. 
-Prompt correct or wrong:  `showFeedback()` changes the message div. 

-CSUN Locations: assigned Asian American Activities Center - B6 + Chicano House - D5 + JD Jacaranda Hall - E5 + Sequoia Hall - E4 + Santa Susana Hall - D2

-After 5 guesses, show final score:  `endGame()` calculates and displays score, stops timer, updates high score. 
-Reset button: `resetGame()` clears state, resets UI, reloads first location. 
-Extra feature 1: Timer: `startTimer()` counts down 30 seconds; if time runs out, automatically marks wrong. 
Extra feature 2: High score: `localStorage` stores the best score across sessions. 



### index.html

- Contains a container div with an info panel (score-area, location prompt, message, reset button) and a map div (`id="map"`).
- Loads Google Maps API with callback `initMap` and a restricted API key.
- Includes external CSS and JavaScript files.

### style.css

- Global reset for consistent box-sizing.
- Dark red background and white container card with rounded corners.
- Flexbox used for layout in `.info-panel` and `.score-area`.
- Hover effect on reset button.
- Simple pulse animation for feedback messages.
- Map container fixed at 600px height.

### script.js 

- `initMap()` – Creates the Google Map centered on CSUN, disables pan/zoom, attaches double-click listener, loads high score from localStorage, and calls `loadNextLocation()`.
- `loadNextLocation()` – Clears previous rectangle/marker, updates UI prompt, resets game state, and starts the timer.
- `checkGuess(clickedPoint)` – Compares click coordinates with current location’s bounding box. If correct: increments score, green rectangle, success message. If wrong: red rectangle on the correct location, failure message. Moves to next question after a delay.
- `drawLocationRectangle(bounds, color, opacity)` – Creates a `google.maps.Rectangle` to highlight the correct area.
- `addMarker(position, title, color)` – Places a marker at the center of the location (green for correct, red for incorrect).
- `showFeedback(message, color)` – Updates the message div and triggers a CSS pulse animation.
- `updateScoreDisplay()` – Refreshes the displayed correct count.
- `startTimer()` – Uses `setInterval` to count down from 30 seconds. On timeout, automatically marks the guess as wrong and reveals the correct rectangle.
- `updateHighScore()` – Compares current score with stored high score; updates `localStorage` if a new record is set.
- `resetGame()` – Resets all game variables, clears shapes, recenters map, and reloads the first location.
- `endGame()` – Shows final score, stops timer, updates high score, and optionally adds a celebration marker for a perfect score.

Key Google Maps objects: `google.maps.Map`, `google.maps.Rectangle`, `google.maps.Marker`, event listeners, and coordinate extraction methods.

## Note on Location Bounds

Each location’s `bounds` object defines a rectangle (north, south, east, west) that determines a correct guess. The values were derived from the building’s center coordinates obtained from Google Maps, adding/subtracting about 0.0005 degrees latitude and 0.0007 degrees longitude. This creates sized hit area around each building.

## Links Used for This Project

Below are all the external resources, documentation, and tools referenced or used while building the CSUN Location Guessing Game.

### Google Maps Platform & API Documentation

- [Google Maps JavaScript API Overview](https://developers.google.com/maps/documentation/javascript/overview)
- [Get an API Key](https://developers.google.com/maps/documentation/javascript/get-api-key)
- [Maps JavaScript API Reference – Map](https://developers.google.com/maps/documentation/javascript/reference/map)
- [Maps JavaScript API Reference – Rectangle](https://developers.google.com/maps/documentation/javascript/reference/polygon#Rectangle)
- [Maps JavaScript API Reference – Marker](https://developers.google.com/maps/documentation/javascript/reference/marker)
- [Events in Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/events)
- [Shapes (Rectangles, Polylines, Polygons, Circles)](https://developers.google.com/maps/documentation/javascript/shapes)
- [Rectangle Simple Example](https://developers.google.com/maps/documentation/javascript/examples/rectangle-simple)
- [Disabling UI Controls (zoom, pan, etc.)](https://developers.google.com/maps/documentation/javascript/controls)
- [Localization (language & region parameters)](https://developers.google.com/maps/documentation/javascript/localization)
- [Loading the Maps JavaScript API (async, defer)](https://developers.google.com/maps/documentation/javascript/load-maps-js-api)
- [Error Messages (InvalidKeyMapError, RefererNotAllowedMapError)](https://developers.google.com/maps/documentation/javascript/error-messages)

### API Key

- [Google Cloud Console](https://console.cloud.google.com/)
- [Creating and Restricting API Keys](https://cloud.google.com/docs/authentication/api-keys)
- [HTTP Referrer Restrictions for API Keys](https://cloud.google.com/docs/authentication/api-keys#http_referrers)

### Coordinate Acquisition

- [Google Maps](https://maps.google.com) – right‑click to get latitude/longitude

### Local Web Server (Testing)
used with `python3 -m http.server 8000`

### Local Storage (High Score)

- [MDN Web Docs – Window.localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

### CSS & Design

- [CSS Flexbox Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout/Basic_Concepts_of_Flexbox)
- [CSS Animations (Keyframes, Pulse)](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations)

### JavaScript Timer

- [MDN setInterval](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)
