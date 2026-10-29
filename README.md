# Martin-Jin.github.io

Source for the personal portfolio site of Martin Jin, published through GitHub Pages at
[martin-jin.github.io](https://martin-jin.github.io). The site is a single-page record of the
engineering projects completed during a Mechatronics degree and of experience in the F:SAE:47
autonomous team. It is built as plain HTML, CSS and JavaScript with no build step.

## Contents

- [Usage](#usage)
- [How It Works](#how-it-works)
- [Adding a Project](#adding-a-project)
- [Adding a Career Entry](#adding-a-career-entry)
- [Dependencies](#dependencies)
- [Deployment](#deployment)

## Usage

There's nothing to install or build. Clone the repo and open `index.html` directly in a browser.
Alternatively, serve the folder so that `file://` restrictions do not apply:

```bash
git clone https://github.com/Martin-Jin/Martin-Jin.github.io.git
cd Martin-Jin.github.io
python -m http.server 8000   # or: npx serve
```

Then visit `http://localhost:8000`. The header shows Home, Projects, Careers and Links. Projects
and Careers share one content position: choosing either replaces the other, while Links stays
after the selected content.

## How It Works

Three files do all the work:

- **`index.html`** – the page structure and content. Every project is a `.project-card` and every
  career entry is a `.career-card`. Each stores its detail text in `data-*` attributes (`data-what`,
  `data-how` and `data-why`, separated by `|`) instead of in the modal markup.
- **`script.js`** – reads those attributes and:
  - fills the detail modal when a card's "View Details" button is clicked
  - sorts each project year by month on load, newest first
  - drives the search box and the skill filters, which match a project's title and skill pills
  - switches between the project and career views, keeps hash navigation and browser history in
    sync, and highlights the current header and project-year links while scrolling
- **`style.css`** – one stylesheet, organised by section (navigation, timeline, cards, modal,
  sidebar, mobile breakpoint). A small set of CSS variables at the top sets colour and sizing.

Media lives in one folder per project or role, so everything a card uses sits together:

- **`projects/<project-slug>/`** – the cover image, plus any PDF or video linked from that project.
- **`careers/<role-slug>/`** – the photos, videos and video posters for one career entry.
- **`images/`** – the profile photo.

The Can'tviz screenshot is stored as `projects/cantviz-quizzes/cover.png`, with the rest of that
project's media. Keep future media in its project or role folder.

There's no framework, bundler or build output. What is in the repo is what ships.

## Adding a Project

1. Create `projects/<project-slug>/` and add the cover image as `cover.jpg` or `cover.png`. Resize
   photos to about 1600 px on the long side first, since the page loads them directly.
2. Copy an existing `.project-card` block under the right `.year-group` in `index.html`.
3. Fill in the attributes in the table below, then give the visible card a title, a one-line
   summary, a `.timeline-date` and `.pill` elements for skills.
4. Reload the page. Open the card's modal, then try the search box and the filters.

| Attribute | Purpose |
|---|---|
| `data-title` | Modal heading, and what search matches against |
| `data-image` | Image shown in the modal (the file in the project's folder) |
| `data-images` | Optional comma-separated gallery, shown as a slider that takes priority over `data-image` |
| `data-image-captions` | Optional captions for the gallery images, separated by `\|` in the same order |
| `data-image-fit` | Set to `contain` to show a whole screenshot instead of cropping it |
| `data-hours` | Rough time investment, shown in the modal's stats bar |
| `data-live` | Optional link to the live app, shown as the accent button |
| `data-resource` and `data-resource-label` | Optional second link (repo, PDF or video) and its button text |
| `data-what`, `data-how` and `data-why` | Pipe-separated (`\|`) sentences for each modal section |
| `data-next` | Optional pipe-separated sentences for a "Next Steps" modal section, hidden when absent |

`script.js` reads the skills from the `.pill` elements, so there's no separate list to keep in sync.
However, the filter buttons and the "Project Highlights" list in the sidebar are written by hand in
`index.html`. A new skill category therefore needs a new filter button.

## Adding a Career Entry

1. Create `careers/<role-slug>/` and add the photos, videos and a poster image for each video.
2. Copy the `.career-card` block under a `.year-group` in the `#careers` section. Add a new
   `.year-group` with its own `id` (for example `career-year-2027`) for a new year.
3. Fill in `data-title`, `data-role`, `data-images`, `data-image-captions` (one caption per image,
   separated by `|`), `data-what`, `data-how` and `data-why`. The modal shows the role where a project
   shows its hours.
4. Add each video as a `<video controls preload="none" poster="…">` inside `.career-media`. Setting
   `preload="none"` stops the page downloading large videos until they are played.

## Dependencies

None. No npm packages, no CDN scripts, no web fonts pulled in at runtime. Everything needed to render
the page is in this repo.

## Deployment

GitHub Pages serves this repo directly from the `main` branch root, so pushing to `main` is the
deploy step. There's no CI pipeline and nothing to rebuild. Pages can take a minute or two to update
after a push.
