# AGENTS.md

## Project Overview
TYAC (The Youth Alliance For Change) is a static HTML/CSS/JS website. No backend, no build step, no package manager, no external dependencies.

## Running the App
- Served via `docker-compose.base44.yml` using `nginx:alpine` on host port 3000.
- Source is bind-mounted read-only into the container; edits appear on browser refresh (no rebuild needed).
- Start: `docker compose -f docker-compose.base44.yml up -d`
- Health check: `curl -s http://localhost:3000/`

## Structure
- `index.html` — single-page site (Home, About, Blog, Contact sections)
- `style.css` — all styling
- `script.js` — nav highlighting, scroll reveal, form alert, button ripple
- Images: `*.jpg` / `*.jpeg` — leadership photos and logo
- Contact form posts to FormSubmit (`https://formsubmit.co/...`) — no server-side handling needed.

## No Secrets Required
This app has no external service credentials. It runs entirely from static files.
