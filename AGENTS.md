# TYAC — The Youth Alliance For Change

Static site: `index.html` + `style.css` + `script.js` + image assets at the repo root. No build step, no package manager, no backend.

## Running it here (Base44 dev environment)

```
docker compose -f docker-compose.base44.yml up -d
```

- Serves the repo root through `live-server` (Node 22 alpine) on host port **3000**, bind-mounted from the repo, so edits appear without rebuilding.
- Healthcheck: `GET /index.html` must return 200.
- `npm` cache lives in the `web_cache` volume; there are no project dependencies to install.
- Logs: `docker compose -f docker-compose.base44.yml logs -f web`

## Verifying changes

```
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/
```

Then check the preview. `live-server` injects a reload script, but if a change does not appear, force a preview refresh.

## Gotchas

- All asset paths are **relative to the repo root** and referenced directly in `index.html` (e.g. `yac.jpg`, `ttt.jpeg`). Renaming or moving an image breaks the page silently.
- The contact form posts to `formsubmit.co` and is *not* handled by any code here; `script.js` only runs an `alert()` on submit. The inputs have `id`s but no `name` attributes, so FormSubmit receives no fields — left as-is deliberately.
- The crest (`yac.jpg`) is a JPEG with a light-grey (#e6e6e6) background, so it is always presented on a white/framed plate rather than directly on the linen page background.
- Design system lives in CSS custom properties at the top of `style.css` (linen `#F2F0ED`, graphite `#1A1B1F`, burnished oak `#8C7356`, slate steel `#5E6266`; Inter for headings, IBM Plex Mono for body/spec text).
- Interactions worth not breaking: anchor-based single-page navigation (`#home`, `#about`, `#blog`, `#contact`), scroll-spy active nav link, plotter strip image reveal, custom crosshair cursor, scroll rail, button ripple, dynamic footer year.
