# TYAC website — working notes

Plain static site: `index.html`, `style.css`, `script.js` plus image assets at the
repo root. No build step, no package manager, no framework.

## Running it (Base44 sandbox)

```
docker compose -f docker-compose.base44.yml up -d --build
```

- `Dockerfile.base44` only installs `live-server` (dev tooling). The site source is
  bind-mounted into `/app`, so edits to `index.html` / `style.css` / `script.js`
  appear on reload without rebuilding.
- The site is served on host port 3000 (`http://localhost:3000/`).
- Live reload polls (CHOKIDAR_USEPOLLING=true) because bind mounts don't always
  emit filesystem events in the sandbox.

## Verifying

- `docker compose -f docker-compose.base44.yml ps` — `web` should be healthy.
- `curl -s http://localhost:3000/` should return the TYAC HTML.
- The contact email `theyouthallianceforchange@gmail.com` appears as a clickable
  `mailto:` link in the contact sidebar (`#contact`) and in the footer, and as the
  FormSubmit form action.

## Quirks

- `index.html` uses CRLF line endings; keep that in mind when scripting edits.
- `script.js` keeps the native FormSubmit POST (no `preventDefault`), so the contact
  form redirects to formsubmit.co after submitting.
