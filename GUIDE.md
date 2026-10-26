# Portfolio guide

How this site works, how to change it, and how to build one like it from scratch.

1. [What it's built with](#1-what-its-built-with)
2. [Setup](#2-setup)
3. [Everyday recipes](#3-everyday-recipes)
4. [How each part works](#4-how-each-part-works)
5. [Build it yourself from scratch](#5-build-it-yourself-from-scratch)
6. [Publishing checklist](#6-publishing-checklist)
7. [Troubleshooting](#7-troubleshooting)
8. [Adding Tailwind later (optional)](#8-adding-tailwind-later-optional)

---

## 1. What it's built with

**No framework.** The site is plain HTML, CSS and JavaScript, plus three small libraries for animation:

| Library | What it does | Where it's used |
|---|---|---|
| [GSAP](https://gsap.com) + ScrollTrigger | Animates things, and starts animations when you scroll to them | Loader, hero, titles, cards |
| [Lenis](https://lenis.darkroom.engineering) | Smooth scrolling | Whole page |
| [SplitType](https://github.com/lukePeavey/SplitType) | Splits text into letters/words so each can be animated | "Overview.", "Projects." |

They load from the internet with `<script src="https://...">` at the bottom of `index.html`, so there's nothing to install
and **no build step**: what's in the folder is exactly what GitHub Pages serves.

### Why not Tailwind?

Tailwind is great, but for this site it would make things *harder*, not easier:

- Tailwind needs a **build step**. You run a tool that scans your HTML and generates the CSS, and you have to remember to
  run it before every push. (The "Play CDN" version without a build step is meant for testing, not real sites.)
- Most of the styling here is for **cards that JavaScript creates**, so the Tailwind classes would end up inside JavaScript
  strings, which is harder to read than one CSS file.
- Tailwind doesn't give you "prefabs" (reusable components) either. That comes from frameworks like React or Astro, which
  add even more tooling.

The "prefab" in this site is the combination of **a data list** (`projects.js`) and **a template function**
(`buildCard` in `script.js`). That's the same idea that React components are built on, without any tooling.
See [section 8](#8-adding-tailwind-later-optional) if you want to try Tailwind anyway.

### The files

```
index.html     structure: header, hero, about, empty project grid, contact, pop-up shell
style.css      look: colours, fonts, layout, hover effects, phone layout
projects.js    your projects as data  ← you edit this most
script.js      behaviour: builds cards from projects.js, pop-up, filters, animations
assets/        images (assets/projects/) and videos (assets/videos/)
preview.bat    double-click to preview locally
```

---

## 2. Setup

1. Install [VS Code](https://code.visualstudio.com) (free).
2. In VS Code: *File → Open Folder* → this folder.
3. Recommended: install the **Live Server** extension (Extensions tab, search "Live Server"). Right-click `index.html`
   → *Open with Live Server*. The page **reloads automatically** every time you save a file.
   Alternatively, double-click `preview.bat` and refresh the browser yourself.
4. Push with GitHub Desktop as usual. It's live on https://ardestwastaken.github.io a minute later.

> Why a "server" and not just double-clicking `index.html`? Some browser features (like checking whether a video file
> exists) don't work from `file://` addresses.

---

## 3. Everyday recipes

### Add a project
1. Put a screenshot in `assets/projects/` (JPG, about 1600 px wide, under 500 KB, see [image tips](#image-and-video-tips)).
2. Open `projects.js`, copy the **template** from the comment at the top, and paste it into the list where you want it
   to appear (the order of the list is the order on the page).
3. Fill it in, then save. Done: the card, filter, pop-up and animations all work automatically.

### Add a video to a project
1. Record (Win + Alt + R), trim and compress it (see [image tips](#image-and-video-tips)).
2. Save it as the exact path in that project's `video:` line, e.g. `assets/videos/voxel.mp4`.

It plays on hover on the card and in the pop-up. Until the file exists, the card shows the image instead.

### Choose what's at the top of the pop-up
Add a `preview:` line to the project with the image or video you want:

```js
preview: './assets/stan.mp4',           // a video (plays muted, with controls)
preview: './assets/beepbumper.jpg',     // or an image
preview: 'play',                        // or the "Play in browser" screen (needs a play: URL)
preview: 'https://youtu.be/V2tHy4DCTNU', // or a YouTube video (any YouTube link works)
```

Without `preview:`, it uses the project's `video` (if the file exists), otherwise its `image`.

### Put images or videos between the text
`description` is a list. Plain text becomes a paragraph; `{ ... }` entries become media:

```js
description: [
  'First paragraph.',
  { image: './assets/beepbumper.jpg', caption: 'In-game screenshot' },   // caption is optional
  'Second paragraph.',
  { video: './assets/videos/boss-fight.mp4' },                           // loops like a GIF
  { row: ['./assets/a.jpg', './assets/b.mp4'], caption: 'Side by side' }, // 2+ next to each other
  { youtube: 'https://www.youtube.com/watch?v=V2tHy4DCTNU' },             // a YouTube video
  'Last paragraph.',
],
```

Don't forget the comma after each entry. Videos between the text play muted and on loop while you can see them. If a
video file doesn't exist yet, it's simply left out. See the Beep & Bumper project for a full example.

### Change colours
At the top of `style.css`:

```css
:root {
  --bg: #0b0d12;      /* page background */
  --card: #151922;    /* cards */
  --text: #eeeae4;    /* main text */
  --accent: #c9a978;  /* gold: buttons, highlights, "De Smet" */
}
```

Change a value, save, and the whole site follows. Pick colours with any colour picker (search "color picker" on Google).

### Change fonts
1. Pick fonts on [Google Fonts](https://fonts.google.com) and copy the `<link>` they give you.
2. Replace the Google Fonts `<link>` in `index.html`.
3. Change `--font-display` (headings) and `--font-body` (text) at the top of `style.css`.

### Change text
All the fixed text (hero, about, contact) is in `index.html`. Search for the sentence (Ctrl + F) and change it.
Project text is in `projects.js`.

### Add a filter category
1. In `index.html`, copy a filter button, e.g. `<button class="filter" data-filter="games" ...>Games</button>`,
   and change `games` to your new category name (both places).
2. In `projects.js`, add that name to the `category` list of the projects that belong in it.

### Add a link button in a project's pop-up
In `projects.js`: `links: [{ label: 'GitHub', url: 'https://...' }, { label: 'Trailer', url: 'https://...' }]`

### Make a card wide (two columns)
Add `wide: true` to the project. Tip: in a 3-column grid, a wide card plus a normal card fills a row exactly.

---

## 4. How each part works

### The page structure (`index.html`)
Each part of the page is a `<section>` with an `id`, e.g. `<section id="projects">`. Links like `href="#projects"`
jump to it. The project grid is **empty** in the HTML (`<div class="grid" id="project-grid">`): JavaScript fills it.

### Layout (`style.css`)
Three tools do almost all of the layout:

- **Flexbox** for rows: `display: flex; gap: 1rem;`, used for the header, buttons and tags.
- **Grid** for the cards: `display: grid; grid-template-columns: repeat(3, 1fr);` (3 equal columns).
- **Responsive sizes**: `font-size: clamp(4.4rem, 9vw, 11.5rem)` means "9% of the screen width, but never smaller than
  4.4rem or bigger than 11.5rem". That keeps your name readable on both phones and big screens.

Phone layouts are switched with media queries:

```css
@media (max-width: 700px) {
  .grid { grid-template-columns: 1fr; }  /* one column on phones */
}
```

(`html { font-size: 62.5% }` makes `1rem = 10px`, so `1.6rem` = 16px. Easy maths.)

### The "prefab": data + template (`projects.js` + `script.js`)
`projects.js` is just a list of objects:

```js
const PROJECTS = [
  { title: 'Voxel Engine', short: 'A Minecraft-style engine', image: './assets/projects/voxel.jpg' },
]
```

`buildCard(project)` in `script.js` is the template. It receives one project and returns a card element:

```js
function buildCard(project) {
  const card = document.createElement('article')   // make a new element
  card.className = 'card'                          // give it the .card styles
  card.innerHTML = `
    <img src="${project.image}">
    <h3>${project.title}</h3>
    <p>${project.short}</p>`                       // fill in this project's data
  card.addEventListener('click', () => openModal(project))  // click → pop-up
  return card
}

PROJECTS.forEach((p) => grid.append(buildCard(p)))  // one card per project
```

(The real `buildCard` does a bit more: badges, videos and tags.) **Change the template once and every card changes.**
Add data and you get a new card. That's the whole trick.

### The pop-up (`openModal` / `closeModal` in `script.js`)
There's one hidden `<div class="modal">` at the bottom of `index.html`. `openModal(project)` fills it for the clicked
project and fades it in:
- `pickPreview()` decides what goes at the top (your `preview:`, or a fallback), and `showPreview()` puts it there.
- `buildDescription()` walks through the `description` list: text becomes a `<p>`, and `{ image }` / `{ video }` /
  `{ row }` entries become a `<figure>` with the media and an optional caption. `closeModal()` fades it out and empties the media (which stops
videos and the game). It closes on ✕, on a click outside, or on Escape.

### Filters
Each card stores its categories, e.g. `data-category="graphics engines"`. Clicking a filter button hides the cards that
don't have that category (`.card.is-hidden { display: none }`).

### Animations (GSAP)
Three commands cover almost everything:

```js
gsap.to('.box', { x: 100, duration: 1 })     // animate FROM how it is now TO this
gsap.from('.box', { y: 40, opacity: 0 })     // animate FROM this TO how it is now (great for "appear")
gsap.timeline()                               // play animations one after another
  .to('.a', { opacity: 1 })
  .to('.b', { opacity: 1 })
```

**ScrollTrigger** starts an animation when you scroll to it:

```js
gsap.from('.card', {
  y: 50, opacity: 0,
  stagger: 0.1,                                   // each card starts 0.1s after the previous one
  scrollTrigger: { trigger: '.grid', start: 'top 90%' }  // when the grid's top reaches 90% down the screen
})
```

Add `scrub: true` and the animation follows your scroll position instead of playing once. That's how the Overview text
lights up word by word.

**The letter-by-letter titles:** SplitType wraps every letter in a `<span>`, CSS hides whatever falls outside each word
(`overflow: hidden`), and GSAP slides the letters up from below (`yPercent: 110` → `0`).

**Accessibility:** `script.js` checks `prefers-reduced-motion` and skips the animations for people who turned motion
off in their system settings.

### Videos on cards
For each project, `checkVideo()` asks the server "does this file exist?" (a cheap `HEAD` request). If it does, a muted,
looping `<video>` is placed over the image and plays on hover. If not, nothing happens and the image stays.

### The Q*bert game
The game is a separate website (your Prog4Engine repo's GitHub Page, built by its GitHub Actions workflow). The pop-up
shows it in an `<iframe>`, a window into another web page, scaled down to fit with CSS `transform: scale(...)`.

---

## 5. Build it yourself from scratch

A practice route: make a new folder and rebuild a simplified version in 8 steps.
Keep `index.html` open with Live Server so you see every change.

### Step 1: The skeleton
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>My Portfolio</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <header class="header"><a href="#top">Alexander</a> <a href="#projects">Projects</a></header>

  <section class="hero" id="top">
    <h1>Hi, I'm <span class="accent">Alexander</span></h1>
    <p>Game & graphics programmer</p>
  </section>

  <section id="projects">
    <h2>Projects.</h2>
    <div class="grid" id="project-grid"></div>
  </section>

  <script src="projects.js"></script>
  <script src="script.js"></script>
</body>
</html>
```

### Step 2: Base styles (`style.css`)
```css
:root { --bg: #0b0d12; --card: #151922; --text: #eeeae4; --accent: #c9a978; }
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: var(--bg); color: var(--text); font-family: sans-serif; }
.accent { color: var(--accent); }

.hero { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; padding: 0 5vw; }
.hero h1 { font-size: clamp(40px, 8vw, 110px); }

section { padding: 100px 5vw; }
```

### Step 3: The card grid
```css
.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.card { background: var(--card); border-radius: 20px; overflow: hidden; cursor: pointer; transition: transform .3s; }
.card:hover { transform: translateY(-6px); }
.card img { width: 100%; aspect-ratio: 16 / 10; object-fit: cover; display: block; }
.card h3, .card p { padding: 0 20px; }
.card h3 { margin-top: 16px; }
.card p { margin: 8px 0 20px; opacity: .7; }

@media (max-width: 700px) { .grid { grid-template-columns: 1fr; } }
```

### Step 4: The data (`projects.js`)
```js
const PROJECTS = [
  { title: 'Voxel Engine', short: 'Minecraft-style engine', image: 'voxel.jpg' },
  { title: 'FFT Ocean',    short: 'Realtime ocean',         image: 'ocean.jpg' },
  { title: 'Q*bert',       short: 'My own 2D engine',       image: 'qbert.png' },
]
```

### Step 5: The template (`script.js`)
```js
const grid = document.querySelector('#project-grid')

function buildCard(project) {
  const card = document.createElement('article')
  card.className = 'card'
  card.innerHTML = `<img src="${project.image}" alt=""><h3>${project.title}</h3><p>${project.short}</p>`
  card.addEventListener('click', () => alert(project.title))   // pop-up comes in step 6
  return card
}

PROJECTS.forEach((p) => grid.append(buildCard(p)))
```

Save: three cards appear. Add a fourth project to the list and it appears too. **This is the core idea of the site.**

### Step 6: A pop-up
Add to `index.html` (before the scripts):
```html
<div class="modal" hidden>
  <div class="modal__panel">
    <button class="modal__close">✕</button>
    <h3 class="modal__title"></h3>
    <p class="modal__text"></p>
  </div>
</div>
```
CSS:
```css
.modal { position: fixed; inset: 0; background: rgba(0,0,0,.8); display: grid; place-items: center; }
.modal[hidden] { display: none; }
.modal__panel { background: var(--card); padding: 40px; border-radius: 20px; max-width: 700px; }
```
JS (replace the `alert` from step 5 with `openModal(project)`):
```js
const modal = document.querySelector('.modal')

function openModal(project) {
  modal.querySelector('.modal__title').textContent = project.title
  modal.querySelector('.modal__text').textContent = project.short
  modal.hidden = false
}

modal.querySelector('.modal__close').addEventListener('click', () => (modal.hidden = true))
```

### Step 7: Animations
Add GSAP before your own scripts in `index.html`:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
```
Then at the bottom of `script.js`:
```js
gsap.registerPlugin(ScrollTrigger)

gsap.from('.hero h1', { y: 60, opacity: 0, duration: 1.2, ease: 'expo.out' })

gsap.from('.card', {
  y: 50, opacity: 0, duration: 0.8, stagger: 0.1,
  scrollTrigger: { trigger: '.grid', start: 'top 85%' },
})
```
Play with `duration`, `ease` (see the [ease visualizer](https://gsap.com/docs/v3/Eases)) and `stagger`.

### Step 8: Publish
Make a GitHub repo called `<your-username>.github.io`, put the files in it, push. Live at
`https://<your-username>.github.io`.

From here, compare your version with this site's files to see how each extra (filters, videos, loader, smooth scroll)
is added on top. Each one is a separate block in `script.js` with a comment header.

---

## 6. Publishing checklist

Before you push:

- [ ] **Filenames match exactly, including capitals.** Windows ignores case, **GitHub Pages doesn't**: `Ocean.mp4` ≠
      `ocean.mp4`. Tip: always use lowercase names without spaces (`my-project.jpg`, not `Screenshot 2026-10-13.png`).
- [ ] **Images are small:** JPG, ~1600 px wide, under ~500 KB each.
- [ ] **Videos are small:** under ~20 MB each. GitHub warns above 50 MB and refuses files above 100 MB.
- [ ] You checked it once in the local preview, on a narrow window too (or press F12 → phone icon in Chrome).
- [ ] If you changed `style.css`, `script.js` or `projects.js`: raise the `?v=` number on those links in `index.html`,
      so visitors' browsers load the new versions instead of old saved copies.

### Image and video tips
- **Screenshots:** PNG screenshots are huge. Save as JPG, or open in Paint → *Resize* to 1600 px wide → *Save as JPEG*.
  [Squoosh](https://squoosh.app) (in the browser) is great for this too.
- **Videos:** record with Win + Alt + R, then compress with [HandBrake](https://handbrake.fr) (free):
  preset *Web → "Social 25 MB 2 Minutes 1080p30"*, untick audio if you don't need it. Keep clips 10–20 seconds.
  Hide debug UI first (F1 in most of your renderers).

---

## 7. Troubleshooting

| Problem | Likely cause |
|---|---|
| Works locally, image/video missing online | Filename capitals don't match (see checklist) |
| Page is blank / nothing animates | A typo in `projects.js` (a missing comma or quote). Press F12 → *Console* to see the error and its line number |
| Card shows but no video | The `video:` path doesn't match the file, or the file is still uploading |
| Changes don't show online | Wait 1–2 minutes after pushing, then hard-refresh with Ctrl + F5 |
| Site looks broken/unstyled right after a push | The browser mixed the new page with old saved CSS/JS. Raise the `?v=` number on `style.css`, `projects.js` and `script.js` in `index.html` (e.g. `?v=2` → `?v=3`) and push again |
| Changes don't show locally | Make sure you're using `preview.bat` (its server tells the browser never to cache). If you started `python -m http.server` yourself, the browser keeps old copies: press Ctrl + F5 |

The F12 console is your best friend: almost every problem shows up there as a red error with a file name and line number.

---

## 8. Adding Tailwind later (optional)

If you want to learn Tailwind, try it on a **new practice page** first instead of converting this site.

The no-Node way, using the Tailwind standalone CLI:

1. Download `tailwindcss-windows-x64.exe` from the
   [Tailwind releases page](https://github.com/tailwindlabs/tailwindcss/releases/latest), rename it to `tailwindcss.exe`
   and put it in your practice folder.
2. Create `input.css` containing:
   ```css
   @import "tailwindcss";
   ```
3. Run this in that folder. It watches your HTML and rebuilds `output.css` whenever you save:
   ```
   tailwindcss.exe -i input.css -o output.css --watch
   ```
4. Link `output.css` in your HTML and style with classes:
   ```html
   <article class="rounded-2xl bg-slate-900 p-6 transition hover:-translate-y-1">
     <h3 class="text-2xl font-semibold">Voxel Engine</h3>
     <p class="mt-2 text-slate-400">A Minecraft-style engine</p>
   </article>
   ```
5. Commit `output.css` along with your HTML (GitHub Pages just serves it).

Once you're comfortable, the natural next step for reusable "prefabs" is [Astro](https://astro.build): you write a
`ProjectCard.astro` component once and use it like `<ProjectCard title="..." />`, and it works well with Tailwind and
GitHub Pages. That does need Node.js and a GitHub Actions deploy, though.
