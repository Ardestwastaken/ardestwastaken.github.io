# Alexander De Smet: Portfolio

Personal portfolio, hosted on GitHub Pages.

Built with plain HTML/CSS/JS plus:

- [GSAP](https://gsap.com/) + ScrollTrigger for animations, pinned sections and horizontal project slides
- [Lenis](https://lenis.darkroom.engineering/) for smooth scrolling
- [SplitType](https://github.com/lukePeavey/SplitType) for letter/word text animations

All libraries load from a CDN, so there is no build step: push and it's live.

**New here? Read [GUIDE.md](GUIDE.md)** for how everything works and how to change it.

## Preview locally

Double-click `preview.bat` (needs Python), or run:

```bash
python -m http.server 8000
```

then open http://localhost:8000.

## Editing

- Projects: `projects.js`. Each entry becomes a card and a pop-up.
- Project videos: drop a file at the `video` path of a project (e.g. `assets/videos/voxel.mp4`).
  Until the file exists, the card just shows the image.
- Other content: `index.html`
- Colours / fonts: the variables at the top of `style.css`
- Animations: `script.js`
