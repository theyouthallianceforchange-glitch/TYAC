# TYAC — The Youth Alliance For Change

Static site: `index.html` + `style.css` + `script.js` + image assets at the repo root. No build step, no package manager, no backend.

## The two pages

- `index.html` — one-pager with anchor sections `#home`, `#about`, `#blog`, `#contact`.
- `youth.html` — the youth & volunteer hub (own page, not an anchor): `#start` (intro), `#voices` (member stories), `#roles` (what volunteers do), `#signup` (volunteer sign-up). It reuses `style.css`/`script.js` and repeats the header/footer markup, which is the normal cost of a no-build static site — keep the header block in both files in sync.
- Cross-page nav links are plain `href="youth.html"` / `href="index.html#about"`. `script.js` skips any `.nav-link` whose href is not a `#hash`, so the current-page state (`.is-active` + `aria-current="page"`) written into the youth page's nav survives the scroll-spy pass.
- The measuring rail's sheet labels come from `body[data-sheets]="id:sheet:LABEL;…"` (see both pages); without it the registry falls back to the homepage sheets.

## Forms

There are two, and they behave differently:

- **Homepage contact form** posts to `formsubmit.co` (external service, nothing in this repo handles it); `script.js` only fires an `alert()` if a `#name` field exists inside that specific form.
- **Youth sign-up form** (`#signup-form`, also `.styled-form`) has no backend at all: `script.js` composes every field into a `mailto:` link to the TYAC inbox and opens the visitor's own mail client. The `.form-note` under the button says so plainly — do not imply the page submits anything by itself.
- Because `.styled-form` is shared, **any handler keyed off that class must scope its field lookups to its own form** (this is exactly the bug that broke the first version of the youth page: the contact alert read `#name` and threw on the youth page).

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
- Interactions worth not breaking: anchor-based single-page navigation (`#home`, `#about`, `#blog`, `#contact`), scroll-spy active nav link, plotter strip image reveal, custom crosshair cursor, scroll rail, skip link, button ripple, dynamic footer year.

## Performance & assets

- Team portraits are served from `assets/*.webp` (560px wide, ~310KB for all eight, down from ~2.5MB of originals). The originals (`ttt.jpeg`, `mub.jpeg`, …) stay at the repo root, unreferenced. To regenerate, run `sharp` in a throwaway container — never `npm install` inside the repo:
  `docker run --rm -v "$PWD":/work -v /tmp/imopt:/tmp/imopt -w /tmp/imopt node:22-alpine sh -c "npm i sharp --no-audit --no-fund && node opt.js"`
- `style.css` and `script.js` are referenced with a `?v=N` query in `index.html`. **Bump it whenever you edit either file** — otherwise the preview browser serves the cached copy and your change appears to do nothing.
- Only the font weights actually used are loaded: Inter 700/800, IBM Plex Mono 400/500. Using another weight means editing the Google Fonts URL as well.

## Why the reveal is scroll-driven, not observer-driven

Reveals and the plotter print run from `getBoundingClientRect()` checks on a rAF-throttled scroll handler, **not** `IntersectionObserver`. IO callbacks never fire in the Base44 preview iframe (confirmed with a bare test observer on a clearly visible element), which left the crest plate and several cards permanently invisible. Keep the scroll-driven mechanism — never make content depend on an observer to become visible.
