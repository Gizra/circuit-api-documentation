---
name: circuit-api-docs
description: Use whenever working in the circuit-api-documentation repo — a static HTML documentation site for the Circuit Auction Backoffice REST API (base URL https://backoffice.ddev.site/api/v1.0/, deployed via GitHub Pages to api.circuitauction.com). Trigger on any task that adds, edits, renames, or removes endpoint pages (e.g. clients/, items/, sales/, orders/, addresses/, consignments/, transactions/, activities/, notes/, addresses/, viewings/, taxonomy/, computed/, queue/, bulk/, shipping/, files/), updates the sidebar, tweaks the shared page chrome, documents Pusher events / authentication / data types / errors, or runs the local preview. Use this even when the user just says "add an endpoint", "document X", "fix the docs page for Y", or shares a path like `clients/create.html` — every page in this repo follows the same hand-written Bootstrap-card template and a corresponding entry in `assets/js/sidebar.js`, and getting those two in sync is the whole job.
---

# Circuit API Documentation

This repo is the public REST API reference for the Circuit Auction Backoffice. It's **a hand-written static HTML site** — no build step, no framework, no generator. Each endpoint is its own `.html` file under a topic folder, and a single shared `assets/js/sidebar.js` builds the left navigation at runtime.

The companion backend lives in a separate repo (circuitauction-backoffice). This repo only documents the API — it does not contain the implementation.

## Repo layout

```
/                          # root pages: authentication, common, errors, data-types,
                           #   payments, exports, messages, public, users, files,
                           #   additional-endpoints, commands, migration, pusher-events,
                           #   api-me, index
<topic>/<action>.html      # one file per endpoint (e.g. clients/create.html)
assets/js/sidebar.js       # shared left-nav (must be edited when adding pages)
assets/css/                # (empty — all styling is inline in each page's <style>)
CNAME                      # api.circuitauction.com
README.md                  # one-line "run locally" instructions
```

Topic folders currently in use: `clients/`, `addresses/`, `consignments/`, `orders/`, `items/`, `sales/`, `transactions/`, `activities/`, `notes/`, `viewings/`, `taxonomy/`, `computed/`, `queue/`, `bulk/`, `shipping/`, `files/`.

## Run locally

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

There is no build, no watcher, no linter. Refresh the browser to see edits.

## Deployment

GitHub Pages, served at **api.circuitauction.com** (see `CNAME`). Anything merged to `main` ships. Treat the repo as production.

## The page template (rigidly consistent — match it)

Every endpoint page follows the same skeleton. Don't invent new structure; copy from a neighbouring file in the same topic folder. The user values visual consistency across the site, so deviations stand out.

Canonical anatomy:

1. `<head>` — Bootstrap 5.3.3 CSS + Prism 1.29.0 CSS from CDN, then an **inline `<style>` block** with the same handful of rules (`body`, `.navbar-brand`, `.main-content`, `pre`, `.copy-btn`, `.endpoint`, `.badge-method`, `.param-table th`). The style block is duplicated in every page on purpose — don't try to externalize it into `assets/css/`. The `<title>` is `<Action> <Resource> - Circuit Auction API`.
2. **Navbar** — fixed-top dark primary, brand text `Circuit Auction API v1.0`, link goes to `index.html` (root pages) or `../index.html` (subfolder pages).
3. **Breadcrumb** — `API > <Topic> > <Action>`. The middle crumb links to the topic's `list.html` (or `index.html` for taxonomy). The last crumb is `active` with `aria-current="page"` and is **not** a link.
4. **`<h1>`** matching the title without the suffix, followed by a `<p class="lead">` one-line summary.
5. **One or more Bootstrap cards** — each card is one HTTP request. The `card-header` carries the method badge + endpoint code, the `card-body` carries `Query Parameters` / `Path Parameters` / `Request Body` / `Example Request` / `Response` as needed.
6. **Closing scripts** in this exact order: `sidebar.js`, Bootstrap bundle, Prism core, Prism autoloader, then the inline copy-button initializer that wraps every `<pre><code>` with a "Copy" button.

If you're editing an existing page, **read it first and mirror its structure**. The right starting template is almost always the closest sibling file (e.g. for `items/update.html`, start from `items/create.html`; for a new `notes/create.html`, start from `clients/create.html`).

### Path depth gotcha

Subfolder pages reference shared assets with `../`:

| From… | sidebar script | navbar brand link |
| --- | --- | --- |
| Root (e.g. `authentication.html`) | `assets/js/sidebar.js` | `index.html` |
| One level deep (e.g. `clients/list.html`) | `../assets/js/sidebar.js` | `../index.html` |

All current topic folders are one level deep. If you ever go deeper, double the `../`.

### Method badge colors

Bootstrap classes used throughout:

| Method | Badge class |
| --- | --- |
| GET | `bg-success` |
| POST | `bg-primary` |
| PUT | `bg-warning` |
| PATCH | `bg-info` |
| DELETE | `bg-danger` |

Always wrap the method in `<span class="badge bg-XXX badge-method">…</span>` next to a `<code class="endpoint">/path</code>`.

### Code-block language hints

Use Prism language classes consistently — the autoloader pulls grammars on demand:

- `language-http` for raw request/response headers
- `language-bash` for cURL examples
- `language-javascript` for fetch examples
- `language-json` for request/response bodies
- `language-text` for plain URL strings

## Adding a new endpoint page (the two-file rule)

You must touch **two** places, or the page won't be reachable:

1. **Create the HTML file** under the right topic folder, copying the closest sibling and adjusting the breadcrumb, `<title>`, `<h1>`, card(s), and example payloads. Leave the `<style>` block, navbar, and closing scripts exactly as the sibling has them.
2. **Add a sidebar entry** in `assets/js/sidebar.js`. Find the `MENU` array, locate the parent topic group, and insert a `{ label: '<Action> <Resource>', href: '<topic>/<file>.html' }` line. Match the existing alignment of `href:` columns inside the group — the file uses padded-spacing for visual lineup. If you're adding a brand-new topic, add a whole new group object with a unique `id:` (the `id` is used to expand the group on pages within that topic).

Forgetting step 2 is the most common mistake: the page works if you hit the URL directly, but nobody can navigate to it.

## Editing the sidebar

`assets/js/sidebar.js` is a small self-contained script. It derives the site root from its own `<script src>` so relative links work at any depth. The `MENU` constant is the only thing you normally edit. Submenus must each carry a unique `id:` (so it can highlight/expand the current section). Don't add framework dependencies — it's intentionally plain vanilla JS.

## Documenting cross-cutting concerns

Some pages are not endpoints but shared reference material — edit these when the change affects every endpoint, not a specific one:

- `common.html` — pagination, sorting, filtering, field-selection query params shared by list endpoints
- `data-types.html` — date / currency / boolean / id conventions
- `errors.html` — error envelope, status codes
- `authentication.html` — `/api/login-token` flow and `Authorization: Bearer` usage
- `pusher-events.html` — real-time WebSocket event catalogue
- `additional-endpoints.html`, `commands.html`, `migration.html` — misc top-level docs
- `index.html` — the landing page; the topic cards and "Available endpoints" counters live here. If you add a whole new topic, bump its card and its count.

## House style for prose

- Lead sentences are short and descriptive (`"Retrieve detailed information for a specific client by ID."`). Match the tone of neighbouring pages.
- Parameter tables use `<table class="table table-sm param-table">` with columns Parameter / Type / Description / Example. The Example column shows the literal URL fragment, wrapped in `<code>`.
- JSON examples are realistic but compact. Use `"..."` to elide deep nesting rather than padding with fake fields.
- Don't introduce emoji or marketing language. The site reads as reference documentation.

## What NOT to do

- **Don't** add a build step, bundler, SCSS, or npm dependency. The site is intentionally zero-tooling so any contributor can edit a page in a browser tab.
- **Don't** extract the inline `<style>` block to a shared stylesheet. It's duplicated in every page on purpose; pages must stand alone if opened directly.
- **Don't** rename existing endpoint files without grepping `assets/js/sidebar.js` and every `href=` across the repo — breadcrumbs and inter-page links are hand-coded.
- **Don't** invent endpoint URLs, payload shapes, or error codes from memory. If you're documenting behaviour you haven't been shown, ask the user or check the backend repo (`circuit-backoffice` skill) rather than guess. Wrong docs are worse than missing docs.
- **Don't** commit unless asked. The site is deployed straight from `main`.

## Quick verification before claiming done

After editing or adding a page:

1. Open the page in a local server (`python3 -m http.server 8080`) and visually confirm the sidebar shows the new entry, the breadcrumb resolves, code blocks have copy buttons, and method badges render.
2. Click each internal link on the page to confirm relative paths are right.
3. `grep -n "href=\"<old-name>" -r .` if you renamed anything.

UI-shaped changes need a real browser check — type-checking and tests don't exist here. If you can't open a browser, say so rather than claim the change works.
