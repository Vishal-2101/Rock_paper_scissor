# Rock · Paper · Scissors

A small, accessible, responsive Rock-Paper-Scissors web game built with plain HTML/CSS/JS.

Features
- Clean responsive UI with animations
- Keyboard controls: R = Rock, P = Paper, S = Scissors
- Persistent score using localStorage
- Sound toggle (minimal beeps)
- Accessible buttons and aria-live results

How to run
1. Open `index.html` in a browser (double-click or right-click -> Open with).
2. Or run a simple static server (Python 3):

```powershell
python -m http.server 8000
# then open http://localhost:3000 in your browser
```

Notes & next steps
- Add better sounds, animations, and a reset confirmation.
- Add unit tests for the game logic.
- Package as Electron app or PWA if you want offline install.

New features added
- Match modes: Select Endless, Best of 3, or Best of 5 using the Mode dropdown. Best-of modes will end the match when a side reaches the required wins.
- Animations: Toggle confetti animations on wins using the Animations checkbox.
- Improved sounds: lightweight WebAudio synth used for short tones. Toggle Sound on/off.
- Tests: A small test suite for game logic is included. To run tests:

```powershell
npm test
```

This runs a minimal Node test runner that executes `test/game.test.js`.

Additional new features
- Canvas confetti: uses `canvas-confetti` (via CDN) for smoother confetti animations. If offline, the app falls back to a lightweight DOM confetti.
- Match summary modal: when a best-of match ends you'll see a modal summary and the app auto-resets after a short delay (or you can reset using the modal button).
- Volume control: slider for finer sound control.
Note: This build is configured for single-player only. Multiplayer/hotseat UI and logic have been removed.
