const $ = (sel, ctx = document) => ctx.querySelector(sel)
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)]

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
const hasGsap = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined'

$('.footer__year').textContent = new Date().getFullYear()

// ---------------------------------------------------------------------------
// Smooth scroll (Lenis), synced with ScrollTrigger when available
// ---------------------------------------------------------------------------
let lenis = null

if (hasGsap) {
  gsap.registerPlugin(ScrollTrigger)

  // Always start at the top so the intro animation makes sense
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  ScrollTrigger.clearScrollMemory('manual')
  window.scrollTo(0, 0)

  if (!reduceMotion && typeof Lenis !== 'undefined') {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)
    lenis.stop()
  }
}

const scrollToTarget = (target) => {
  const el = target === '#top' ? 0 : $(target)
  if (el === null) return
  if (lenis) lenis.scrollTo(el, { duration: 1.6 })
  else if (el === 0) window.scrollTo({ top: 0, behavior: 'smooth' })
  else el.scrollIntoView({ behavior: 'smooth' })
}

$$('[data-scroll]').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault()
    const target = link.getAttribute('href')
    if (document.body.classList.contains('menu-open')) {
      closeMenu().then(() => scrollToTarget(target))
    } else {
      scrollToTarget(target)
    }
  })
})

// ---------------------------------------------------------------------------
// Projects: cards are generated from PROJECTS (projects.js)
// ---------------------------------------------------------------------------
const grid = $('#project-grid')

// Only use videos that actually exist, so missing recordings fall back to the image
const videoExists = {}
const checkVideo = (url) => {
  if (!url) return Promise.resolve(false)
  if (!(url in videoExists)) {
    videoExists[url] = fetch(url, { method: 'HEAD' }).then((r) => r.ok).catch(() => false)
  }
  return videoExists[url]
}

const el = (tag, className, html) => {
  const node = document.createElement(tag)
  if (className) node.className = className
  if (html !== undefined) node.innerHTML = html
  return node
}

const tagsHtml = (tags) => tags.map((t) => `<span class="tag">${t}</span>`).join('')

function buildCard(project) {
  const card = el('article', 'card')
  card.tabIndex = 0
  card.setAttribute('role', 'button')
  card.setAttribute('aria-label', `Open ${project.title}`)
  card.dataset.category = project.category.join(' ')
  if (project.wide) card.classList.add('card--wide')

  const media = el('div', 'card__media')
  if (project.imageBg) media.style.background = project.imageBg

  if (project.image) {
    const img = el('img', project.imageFit === 'contain' ? 'contain' : '')
    img.src = project.image
    img.alt = project.title
    img.loading = 'lazy'
    media.append(img)
  } else if (project.placeholder) {
    media.append(el('div', 'card__placeholder', `<span>${project.placeholder}</span>`))
  }

  if (project.award) media.append(el('span', 'card__badge', `🏆 ${project.award}`))
  if (project.play) media.append(el('span', 'card__play-hint', '▶ Playable'))

  checkVideo(project.video).then((ok) => {
    if (!ok) return
    const video = el('video')
    video.muted = true
    video.loop = true
    video.playsInline = true

    if (project.image || project.placeholder) {
      // Video sits on top of the image and plays on hover
      video.preload = 'none'
      video.dataset.src = project.video
      media.classList.add('has-video')
      card.addEventListener('pointerenter', () => {
        if (!video.src) video.src = video.dataset.src
        video.play().catch(() => {})
      })
      card.addEventListener('pointerleave', () => video.pause())
    } else {
      // No image: the video is the thumbnail, playing while on screen
      video.preload = 'metadata'
      video.src = project.video
      media.classList.add('video-only')
      inViewVideos.observe(video)
    }
    media.prepend(video)
  })

  const body = el('div', 'card__body')
  body.append(
    el('h3', 'card__title', project.title),
    el('p', 'card__text', project.short),
    el('div', 'card__foot', `<div class="card__tags">${tagsHtml(project.tags.slice(0, 3))}</div><span class="card__more" aria-hidden="true">→</span>`),
  )

  card.append(media, body)
  card.addEventListener('click', () => openModal(project))
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      openModal(project)
    }
  })
  return card
}

const inViewVideos = new IntersectionObserver((entries) => {
  entries.forEach(({ target, isIntersecting }) => {
    if (isIntersecting) target.play().catch(() => {})
    else target.pause()
  })
}, { threshold: 0.2 })

const cards = PROJECTS.map((p) => {
  const card = buildCard(p)
  grid.append(card)
  return card
})

// Filters
const filters = $$('.filter')

filters.forEach((btn) => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter
    filters.forEach((b) => {
      b.classList.toggle('is-active', b === btn)
      b.setAttribute('aria-selected', b === btn)
    })

    const apply = () => {
      cards.forEach((card, i) => {
        const show = filter === 'all' || card.dataset.category.split(' ').includes(filter)
        card.classList.toggle('is-hidden', !show)
        card.classList.toggle('card--wide', filter === 'all' && !!PROJECTS[i].wide)
      })
    }

    if (!hasGsap || reduceMotion) return apply()

    gsap.to(grid, {
      opacity: 0,
      y: 10,
      duration: 0.2,
      onComplete: () => {
        apply()
        ScrollTrigger.refresh()
        gsap.set(cards, { clearProps: 'opacity,transform' })
        gsap.to(grid, { opacity: 1, y: 0, duration: 0.35 })
        gsap.from(cards.filter((c) => !c.classList.contains('is-hidden')), {
          y: 30, opacity: 0, duration: 0.5, stagger: 0.05, ease: 'power3.out',
        })
      },
    })
  })
})

// ---------------------------------------------------------------------------
// Project pop-up
// ---------------------------------------------------------------------------
const modal = $('.modal')
const modalMedia = $('.modal__media')
let lastFocus = null

const isVideo = (src) => /\.(mp4|webm|mov)$/i.test(src)

// Turns any YouTube link (watch, youtu.be or embed) into an embed URL, or null if it isn't one
const youTubeEmbed = (url) => {
  const id = (url || '').match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/)
  return id ? `https://www.youtube.com/embed/${id[1]}?rel=0` : null
}

const buildYouTube = (url, title) => {
  const frame = el('iframe', 'youtube')
  frame.src = youTubeEmbed(url)
  frame.title = title
  frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen'
  frame.allowFullscreen = true
  return frame
}

// What goes at the top of the pop-up: the project's `preview` if it's set (and the file
// exists), otherwise the play screen, its video, its image, or a placeholder (in that order)
async function pickPreview(project) {
  const p = project.preview
  if (p === 'play' && project.play) return { type: 'play' }
  if (youTubeEmbed(p)) return { type: 'youtube', src: p }
  if (p && !isVideo(p)) return { type: 'image', src: p }
  if (p && (await checkVideo(p))) return { type: 'video', src: p }
  if (project.play) return { type: 'play' }
  if (await checkVideo(project.video)) return { type: 'video', src: project.video }
  if (project.image) return { type: 'image', src: project.image }
  return { type: 'placeholder' }
}

// One image or video inside the description. Videos play while visible, like a GIF,
// and remove themselves if the file doesn't exist (yet)
function buildInlineMedia(src, alt) {
  if (isVideo(src)) {
    const v = el('video')
    Object.assign(v, { src, muted: true, loop: true, playsInline: true, preload: 'metadata' })
    v.addEventListener('error', () => {
      const figure = v.closest('figure')
      v.remove()
      if (figure && !figure.querySelector('img, video')) figure.remove()
    })
    inViewVideos.observe(v)
    return v
  }
  const img = el('img')
  img.src = src
  img.alt = alt
  img.loading = 'lazy'
  return img
}

// A description is a list of entries:
//   'Some text'                                  → a paragraph
//   { image: 'path.jpg', caption: '...' }       → an image (caption optional)
//   { video: 'path.mp4', caption: '...' }       → a looping video
//   { row: ['a.jpg', 'b.mp4'], caption: '...' } → images/videos side by side
//   { youtube: 'https://youtu.be/...' }          → a YouTube video
function buildDescription(project) {
  const frag = document.createDocumentFragment()
  project.description.forEach((entry) => {
    if (typeof entry === 'string') {
      frag.append(el('p', '', entry))
      return
    }
    const figure = el('figure', 'modal__figure')
    const media = el('div', entry.row ? 'modal__figure-media is-row' : 'modal__figure-media')
    if (entry.youtube) {
      media.append(buildYouTube(entry.youtube, entry.caption || project.title))
    } else {
      const sources = entry.row || [entry.image || entry.video]
      sources.forEach((src) => media.append(buildInlineMedia(src, entry.caption || project.title)))
    }
    figure.append(media)
    if (entry.caption) figure.append(el('figcaption', '', entry.caption))
    frag.append(figure)
  })
  return frag
}

function showPreview(project, item) {
  modalMedia.innerHTML = ''
  modalMedia.style.background = project.imageBg || '#000'

  if (item.type === 'video') {
    const v = el('video')
    Object.assign(v, { src: item.src, controls: true, autoplay: true, muted: true, loop: true, playsInline: true })
    modalMedia.append(v)
  } else if (item.type === 'youtube') {
    modalMedia.append(buildYouTube(item.src, project.title))
  } else if (item.type === 'image') {
    const img = el('img', project.imageFit === 'contain' && item.src === project.image ? 'contain-bg' : '')
    img.src = item.src
    img.alt = project.title
    modalMedia.append(img)
  } else if (item.type === 'play') {
    const poster = el('div', 'modal__play')
    poster.innerHTML = `
      ${project.image ? `<img src="${project.image}" alt="" class="${project.imageFit === 'contain' ? 'contain-bg' : ''}">` : ''}
      <button class="btn btn--solid modal__play-btn"><span>▶ Play in browser</span></button>
      <span class="modal__play-note">Keyboard or controller needed</span>`
    modalMedia.append(poster)
    $('.modal__play-btn', poster).addEventListener('click', () => {
      modalMedia.innerHTML = ''
      // The game renders at a fixed 1024x576, so scale the frame to fit the pop-up
      const frame = el('iframe', 'modal__game')
      frame.src = project.play
      frame.title = `${project.title} (playable)`
      frame.allow = 'fullscreen; gamepad; autoplay'
      modalMedia.append(frame)
      fitGame()
      frame.addEventListener('load', () => frame.focus())
      frame.focus()
    })
  } else {
    modalMedia.append(el('div', 'card__placeholder', `<span>${project.placeholder || project.title}</span>`))
  }
}

async function openModal(project) {
  lastFocus = document.activeElement

  showPreview(project, await pickPreview(project))
  $('.modal__tags').innerHTML = tagsHtml(project.tags) + (project.award ? `<span class="tag" style="color:var(--accent-2)">🏆 ${project.award}</span>` : '')
  $('.modal__title').textContent = project.title
  $('.modal__text').replaceChildren(buildDescription(project))
  $('.modal__highlights').innerHTML = (project.highlights || []).map((h) => `<li>${h}</li>`).join('')

  const links = (project.links || []).map((l) => `<a href="${l.url}" target="_blank" rel="noopener" class="btn btn--ghost"><span>${l.label} ↗</span></a>`)
  $('.modal__links').innerHTML = links.join('')

  // Open
  modal.setAttribute('aria-hidden', 'false')
  document.body.classList.add('modal-open')
  lenis?.stop()
  $('.modal__panel').scrollTop = 0

  if (hasGsap && !reduceMotion) {
    gsap.set(modal, { visibility: 'visible' })
    gsap.to('.modal__backdrop', { opacity: 1, duration: 0.4 })
    gsap.fromTo('.modal__panel', { opacity: 0, y: 60, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'expo.out' })
  } else {
    modal.style.visibility = 'visible'
    $('.modal__backdrop').style.opacity = 1
    $('.modal__panel').style.opacity = 1
  }
  $('.modal__close').focus({ preventScroll: true })
}

function fitGame() {
  const frame = $('.modal__game', modalMedia)
  if (frame) frame.style.transform = `scale(${modalMedia.clientWidth / 1024})`
}

window.addEventListener('resize', fitGame)

function closeModal() {
  if (modal.getAttribute('aria-hidden') === 'true') return
  modal.setAttribute('aria-hidden', 'true')

  const done = () => {
    modal.style.visibility = 'hidden'
    modalMedia.innerHTML = '' // stops videos and the game iframe
    $('.modal__text').innerHTML = ''
    document.body.classList.remove('modal-open')
    lenis?.start()
    lastFocus?.focus({ preventScroll: true })
  }

  if (hasGsap && !reduceMotion) {
    gsap.to('.modal__backdrop', { opacity: 0, duration: 0.3 })
    gsap.to('.modal__panel', { opacity: 0, y: 40, duration: 0.3, ease: 'power2.in', onComplete: done })
  } else {
    done()
  }
}

$$('[data-close]').forEach((x) => x.addEventListener('click', closeModal))
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal()
})

// ---------------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------------
const copyBtn = $('.contact__copy')

copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(copyBtn.dataset.copy)
    copyBtn.textContent = 'Copied ✓'
  } catch {
    copyBtn.textContent = copyBtn.dataset.copy
  }
  setTimeout(() => (copyBtn.textContent = 'Copy email'), 2000)
})

// No backend on GitHub Pages, so the form opens the visitor's mail app pre-filled
$('.contact__form').addEventListener('submit', (e) => {
  e.preventDefault()
  const data = new FormData(e.target)
  const subject = encodeURIComponent(`Portfolio contact from ${data.get('name')}`)
  const body = encodeURIComponent(data.get('message'))
  window.location.href = `mailto:alexander.desmet@student.howest.be?subject=${subject}&body=${body}`
})

// ---------------------------------------------------------------------------
// Everything below needs GSAP. Without it the page simply shows statically.
// ---------------------------------------------------------------------------
const header = $('.header')
const menu = $('.menu')
const burger = $('.header__burger')
let menuTl = null

function openMenu() {
  document.body.classList.add('menu-open')
  burger.setAttribute('aria-expanded', 'true')
  menu.setAttribute('aria-hidden', 'false')
  lenis?.stop()
  if (menuTl) menuTl.timeScale(1).play()
  else Object.assign(menu.style, { visibility: 'visible', clipPath: 'none' })
}

function closeMenu() {
  document.body.classList.remove('menu-open')
  burger.setAttribute('aria-expanded', 'false')
  menu.setAttribute('aria-hidden', 'true')
  lenis?.start()
  if (menuTl) return menuTl.timeScale(1.6).reverse().then()
  menu.style.visibility = 'hidden'
  return Promise.resolve()
}

burger.addEventListener('click', () => {
  document.body.classList.contains('menu-open') ? closeMenu() : openMenu()
})

if (!hasGsap) {
  $('.loader').remove()
  document.body.classList.remove('is-loading')
} else {
  // Header: hide on scroll down, show on scroll up
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      const y = self.scroll()
      header.classList.toggle('is-scrolled', y > 40)
      header.classList.toggle('is-hidden', self.direction === 1 && y > 400 && !document.body.classList.contains('menu-open'))
    },
  })

  // Mobile menu animation
  const menuLinks = $$('.menu__link span')
  gsap.set(menuLinks, { yPercent: 110 })
  menuTl = gsap.timeline({ paused: true })
    .set(menu, { visibility: 'visible' })
    .to(menu, { clipPath: 'circle(150% at calc(100% - 4.4rem) 4.4rem)', duration: 0.8, ease: 'power3.inOut' })
    .to(menuLinks, { yPercent: 0, duration: 0.7, stagger: 0.07, ease: 'power3.out' }, '-=0.35')
    .from('.menu__foot', { opacity: 0, y: 20, duration: 0.5 }, '-=0.4')

  // Split text
  const canSplit = typeof SplitType !== 'undefined'
  const titles = canSplit ? $$('[data-split]').map((t) => new SplitType(t, { types: 'words, chars' })) : []
  const scrubText = $('[data-scrub-text]')
  if (canSplit && scrubText) new SplitType(scrubText, { types: 'words' })

  // Intro: loader then hero
  const heroLines = $$('.hero__line')

  if (reduceMotion) {
    $('.loader').remove()
    document.body.classList.remove('is-loading')
  } else {
    gsap.set(heroLines, { yPercent: 110 })
    gsap.set('[data-hero]', { opacity: 0, y: 24 })
    gsap.set(header, { opacity: 0 })
    gsap.set('.hero__bg-img', { scale: 1.15 })

    const playHero = () => {
      document.body.classList.remove('is-loading')
      lenis?.start()

      gsap.timeline({ defaults: { ease: 'expo.out' } })
        .to('.hero__bg-img', { scale: 1, duration: 2 }, 0)
        .to(heroLines, { yPercent: 0, duration: 1.3, stagger: 0.09 }, 0.1)
        .to(header, { opacity: 1, duration: 1 }, 0.4)
        .to('[data-hero]', { opacity: 1, y: 0, duration: 1.1, stagger: 0.08 }, 0.45)
    }

    gsap.timeline({ onComplete: () => $('.loader').remove() })
      .to('.loader__bar span', { scaleX: 1, duration: 1.1, ease: 'power2.inOut' })
      .to(['.loader__name', '.loader__bar'], { opacity: 0, y: -20, duration: 0.4, ease: 'power2.in' })
      .to('.loader', { yPercent: -100, duration: 0.9, ease: 'expo.inOut' }, '-=0.1')
      .add(playHero, '-=0.5')

    // Hero parallax
    gsap.to('.hero__bg-img', {
      yPercent: 12,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    })

    // Section titles: letters slide up
    titles.forEach((split) => {
      gsap.from(split.chars, {
        yPercent: 110,
        duration: 1,
        stagger: 0.03,
        ease: 'expo.out',
        scrollTrigger: { trigger: split.elements[0], start: 'top 88%' },
      })
    })

    // Generic fade-up
    $$('[data-reveal]').forEach((r) => {
      gsap.from(r, {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: r, start: 'top 90%' },
      })
    })

    // About text lights up word by word
    if (scrubText && canSplit) {
      gsap.to($$('.word', scrubText), {
        opacity: 1,
        stagger: 0.1,
        ease: 'none',
        scrollTrigger: { trigger: scrubText, start: 'top 80%', end: 'bottom 50%', scrub: true },
      })
    }

    // Portrait: the circle pops in, then the badge slides up
    gsap.timeline({ scrollTrigger: { trigger: '.portrait', start: 'top 85%' } })
      .from('.portrait__circle', { scale: 0.6, opacity: 0, duration: 1.1, ease: 'back.out(1.6)' })
      .from('.portrait__badge', { y: 15, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.5')

    // Project cards come in as they scroll into view
    gsap.set(cards, { y: 50, opacity: 0 })
    ScrollTrigger.batch(cards, {
      start: 'top 92%',
      once: true,
      onEnter: (batch) => gsap.to(batch, { y: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: 'power3.out', clearProps: 'transform' }),
    })

    // Contact title
    gsap.from('[data-line]', {
      yPercent: 110,
      duration: 1.2,
      stagger: 0.1,
      ease: 'expo.out',
      scrollTrigger: { trigger: '.contact__title', start: 'top 88%' },
    })
  }

  // Magnetic buttons (desktop)
  if (finePointer && !reduceMotion) {
    $$('.magnetic').forEach((btn) => {
      const inner = btn.querySelector('span')
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect()
        const x = e.clientX - r.left - r.width / 2
        const y = e.clientY - r.top - r.height / 2
        gsap.to(btn, { x: x * 0.25, y: y * 0.35, duration: 0.5, ease: 'power3.out' })
        gsap.to(inner, { x: x * 0.1, y: y * 0.15, duration: 0.5, ease: 'power3.out' })
      })
      btn.addEventListener('pointerleave', () => {
        gsap.to([btn, inner], { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' })
      })
    })
  }

  window.addEventListener('load', () => {
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
    else window.scrollTo(0, 0)
    ScrollTrigger.refresh()
  })
}
