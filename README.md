design_rasp — Raspberry Pi UI (vanilla frontend)

This folder contains a small frontend prototype built for a 5" Raspberry Pi display (800×480).
It was implemented in plain JavaScript and CSS so it can be copied to a Raspberry Pi and served without any build step. 

Files inside: 
- `index.html` — entry point. Loads fonts (Google Fonts by default) and `styles.css`.
- `styles.css` — layout, theme and responsive CSS optimized for 800×480. 
- `app.vanilla.js` — UI logic in vanilla JS: rendering, event handlers, simple state, help and report modals. 
- `preview.sh` — small script to run a local static server for preview (uses `python3 -m http.server`).

How to preview -

Quick method:

1. In a terminal, while located inside the `design_rasp` folder, run these commands:

`chmod +x preview.sh`   (only needed once)

`./preview.sh`

This starts a static server on port 8001; open `http://localhost:8001` in your browser.

If that does not open the demo, try one of these alternatives (run from the `design_rasp` folder):

`python3 -m http.server 8001 --bind 127.0.0.1`  (explicit Python 3)

`python -m http.server 8001`  (if `python` is Python 3 on your system)

`npx http-server . -p 8001`  (Node alternative, needs Node/npm)

Notes
- If you run the static server on a remote machine (for example the Raspberry Pi), open the demo on another device using the Pi's IP address, e.g. `http://192.168.1.42:8001`.
- If the page falls back to system fonts, your machine may be offline or blocking Google Fonts; see the Fonts note above to self-host fonts for offline use.

The UI will try to fetch `/report?period=week` on the same origin. If no backend is available, the UI uses a fallback sample dataset.

Notes:
- Zero-dependency: there are no build steps and no node/npm requirements for the frontend.
- Fonts: If you need offline deployment, download the Montserrat/Slabo font files and host them locally; then update `index.html`.

Last updated: November 2025
