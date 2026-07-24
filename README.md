# Martin-Jin.github.io

Source for my personal portfolio site, published via GitHub Pages at
[martin-jin.github.io](https://martin-jin.github.io). It's a single-page timeline of the
engineering (and occasional software) projects I've worked on through my Mechatronics
degree, built as a plain HTML/CSS/JS site with no build step.

## Contents

- [Usage](#usage)
- [How it works](#how-it-works)
- [Adding a project](#adding-a-project)
- [Dependencies](#dependencies)
- [Deployment](#deployment)

## Usage

There's nothing to install or build. Clone the repo and open `index.html` directly in a
browser, or serve the directory statically if you'd rather avoid `file://` quirks:

```bash
git clone https://github.com/Martin-Jin/Martin-Jin.github.io.git
cd Martin-Jin.github.io
python -m http.server 8000   # or: npx serve
```

Then visit `http://localhost:8000`.

## How it works

Three files do all the work:

- **`index.html`** — the page structure and content. Every project is a `.project-card`
  element with its detail copy stored in `data-*` attributes (`data-what`, `data-how`,
  `data-why`, pipe-separated), not hardcoded into the modal markup.
- **`script.js`** — reads those attributes and:
  - populates the detail modal when a card's "View Details" button is clicked
  - sorts each year's projects by month automatically on load, newest first
  - drives the search box and skill filters by matching against a project's title and
    skill pills
  - handles the collapsible year groups and the scroll-based nav/timeline highlighting
- **`style.css`** — one stylesheet, organised by section (nav, timeline, cards, modal,
  sidebar, mobile breakpoint) with a small set of CSS variables at the top for colour and
  sizing.

There's no framework, bundler, or build output — what's in the repo is what ships.

## Adding a project

To add a new project card, copy an existing `.project-card` block under the right
`.year-group` in `index.html` and fill in:

| Attribute | Purpose |
|---|---|
| `data-title` | Modal heading and what search matches against |
| `data-image` | Image shown in the modal (drop the file in `project_resources/`) |
| `data-hours` | Rough time investment, shown in the modal's stats bar |
| `data-resource` | Optional link (repo, PDF, video) — omit if there isn't one |
| `data-what` / `data-how` / `data-why` | Pipe-separated (`\|`) bullet points for each modal section |

The visible card itself just needs a title, a one-line summary, a `.timeline-date`, and
`.pill` elements for skills — `script.js` picks the skills up from those pills
automatically, so there's no separate list to keep in sync.

## Dependencies

None. No npm packages, no CDN scripts, no web fonts pulled in at runtime — everything
needed to render the page is in this repo.

## Deployment

GitHub Pages serves this repo directly from the `main` branch root, so pushing to `main`
is the deploy step. There's no CI pipeline and nothing to rebuild.
