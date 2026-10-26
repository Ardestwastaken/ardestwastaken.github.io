// =============================================================================
// PROJECTS
// Edit this list to add, remove or reorder projects. The cards and the
// pop-up window are built from it automatically.
//
//   image       : thumbnail on the card
//   video       : short clip that plays when you hover over the card
//                 (if the file doesn't exist yet, the image is shown instead)
//   preview     : the ONE image or video at the top of the pop-up.
//                 Leave it out to use the video (or the image if there's no video).
//                 Use 'play' to show the "Play in browser" screen,
//                 or paste a YouTube link to show that video.
//   description : the pop-up text. Mix paragraphs with images and videos:
//                   'A paragraph of text',
//                   { image: './assets/....jpg', caption: 'optional caption' },
//                   { video: './assets/....mp4', caption: 'optional caption' },
//                   { row: ['./a.jpg', './b.mp4'], caption: 'side by side' },
//                   { youtube: 'https://www.youtube.com/watch?v=...' },
//                 Images can also be links to images online (e.g. from itch.io).
//   play        : URL of a playable web build
//   wide        : card takes up two columns in the "All" view
//
// TO ADD A PROJECT: copy this template into the list below (order = order on
// the page), fill it in, and delete the lines you don't need.
//
//   {
//     id: 'my-project',                          // unique, lowercase, no spaces
//     title: 'My Project',
//     category: ['graphics'],                    // any of: 'graphics', 'engines', 'games'
//     tags: ['C++', 'OpenGL'],                   // first 3 show on the card
//     image: './assets/projects/my-project.jpg',
//     video: './assets/videos/my-project.mp4',   // filenames are case-sensitive online!
//     preview: './assets/videos/my-project.mp4', // image or video at the top of the pop-up
//     short: 'One sentence for the card.',
//     description: [
//       'First paragraph for the pop-up.',
//       { image: './assets/projects/my-project-2.jpg', caption: 'What this shows' },
//       'Second paragraph.',
//     ],
//     highlights: ['Feature one', 'Feature two'],
//     links: [{ label: 'GitHub', url: 'https://github.com/Ardestwastaken/...' }],
//   },
// =============================================================================

const PROJECTS = [
  {
    id: 'gi',
    title: 'Realtime Global Illumination',
    category: ['graphics'],
    tags: ['C++20', 'OpenGL 4.6', 'GLSL', 'Compute'],
    image: './assets/projects/gi-sponza.jpg',
    video: './assets/videos/gi.mp4',
    short: 'Fully dynamic global illumination in Sponza, inspired by Unreal\'s Lumen.',
    description: [
      'SponzaGI is a C++20 / OpenGL 4.6 renderer that lights Crytek Sponza with fully dynamic global illumination. It follows the same ideas as Unreal\'s Lumen, but uses a voxel scene representation for cone traced diffuse and specular GI, with multi-bounce and emissive light.',
      { image: './assets/projects/gi-sponza-2.jpg', caption: 'SponzaGI: material spheres and emissive orbs, lit only by the GI' },
      'Around it sits a full pipeline: cascaded shadow maps, TAA, auto exposure, bloom, AgX tonemapping and volumetric fog. A second jungle scene adds animated water, light shining through leaves, god rays and fireflies at night.',
      'I followed it up with two research renderers: ProbeGI (sphere probe GI with BVH ray tracing in compute shaders, 1.3 to 6.3 ms on a laptop RTX 4070) and LumenLite, a reimplementation of Lumen\'s diffuse pipeline measured against a path-traced reference.',
      { image: './assets/projects/gi-cornell.jpg', caption: 'LumenLite: the path-traced reference it is measured against' },
    ],
    highlights: ['Voxel cone traced GI', 'Multi-bounce + emissives', 'TAA, bloom, AgX', 'Volumetric fog'],
    links: [],
  },
  {
    id: 'voxel',
    title: 'Voxel Engine',
    category: ['graphics', 'engines'],
    tags: ['C++20', 'OpenGL 4.5', 'GLFW'],
    image: './assets/projects/voxel.jpg',
    video: './assets/videos/voxel.mp4',
    short: 'A Minecraft-style voxel engine with chunk streaming and a creative mode.',
    description: [
      'A Minecraft-style voxel engine written in C++20 and OpenGL 4.5. The world is generated and meshed in chunks, with an adjustable render distance and stats for loaded chunks, draw calls and GPU memory.',
      'It plays like creative mode: break and place blocks, pick blocks into a hotbar, browse a creative inventory, fly around and fast-forward the day/night cycle. Your first-person arm swings when you build.',
    ],
    highlights: ['Chunk meshing', 'Block editing', 'Creative inventory', 'Day/night cycle'],
    links: [],
  },
  {
    id: 'ocean',
    title: 'FFT Ocean',
    category: ['graphics'],
    tags: ['C++', 'OpenGL 4.3', 'Compute', 'Tessellation'],
    image: null,
    video: './assets/videos/Ocean.mp4',
    short: 'Realtime ocean from Tessendorf\'s paper, using cascaded FFTs like Sea of Thieves.',
    description: [
      'A realtime ocean renderer following Tessendorf\'s "Simulating Ocean Water" and the cascaded FFT approach used in Sea of Thieves and Atlas. This is the updated version of my earlier water shader project.',
      'The simulation runs fully in compute shaders: a JONSWAP wave spectrum over 3 cascades, a radix-2 inverse FFT in shared memory, and foam that builds up where waves fold over (Jacobian).',
      'Rendering uses screen-space adaptive tessellation, GGX sun highlights, Fresnel sky reflections and subsurface scattering for that teal glow on the wave crests.',
      { image: './assets/water.jpeg', caption: 'A screenshot from early progress' },
    ],
    highlights: ['3 FFT cascades', 'Compute shaders', 'Adaptive tessellation', 'Foam + subsurface scattering'],
    links: [],
  },
  {
    id: 'vulkan',
    title: 'Vulkan Renderer',
    category: ['graphics'],
    tags: ['C++', 'Vulkan', 'GLSL', 'Graphics Programming 2'],
    image: './assets/projects/vulkan.jpg',
    video: './assets/videos/vulkan.mp4',
    short: 'Deferred physically based renderer in Vulkan, rendering glTF Sponza.',
    description: [
      'Built for the Graphics Programming 2 course: a Vulkan renderer that loads the glTF Sponza scene and renders it with deferred shading.',
      'Lighting is physically based (GGX) with directional and point lights, shadow mapping, and image based lighting from an HDRI that is converted to a cubemap and an irradiance map at startup. A final pass applies exposure and tonemapping.',
    ],
    highlights: ['Deferred G-buffer', 'PBR (GGX)', 'Image based lighting', 'Shadow mapping'],
    links: [],
  },
  {
    id: 'qbert',
    title: 'Q*bert · Prog4 Engine',
    category: ['games', 'engines'],
    tags: ['C++', 'SDL3', 'Emscripten', 'Programming 4'],
    image: './assets/projects/qbert-logo.png',
    imageFit: 'contain',
    imageBg: 'linear-gradient(135deg, #2a1846, #120c24)',
    video: './assets/videos/qbert.mp4',
    preview: 'play',
    short: 'My own 2D engine, built on SDL3, running a full Q*bert remake.',
    description: [
      'For Programming 4 I built a 2D game engine on top of SDL3 and used it to remake the 1982 arcade game Q*bert.',
      'The engine uses the patterns from Game Programming Patterns: a component system with parent-child transforms, input through the Command pattern (keyboard and up to 4 Xbox controllers), state machines for the player and Coily, and observers for the HUD and level progress.',
      'It also compiles to WebAssembly with Emscripten, so you can play it right here in the browser (keyboard or controller).',
    ],
    highlights: ['Component system', 'Command-pattern input', 'State machines', 'Web build'],
    play: 'https://ardestwastaken.github.io/Prog4Engine/',
    links: [{ label: 'GitHub', url: 'https://github.com/Ardestwastaken/Prog4Engine' }],
  },
  {
    id: 'burglin-birds',
    title: 'Burglin\' Birds',
    category: ['games'],
    tags: ['Unity', 'Co-op', 'Game Projects'],
    image: 'https://img.itch.zone/aW1hZ2UvNDI4NTM5MC8yNzQ4NDQ4OS5qcGc=/original/JMwoZc.jpg',
    preview: 'https://www.youtube.com/watch?v=V2tHy4DCTNU',
    short: 'A 1–4 player co-op heist game: owls sneaking through a mansion to steal everything.',
    description: [
      'You and up to 3 other owls break into a luxury mansion and try to steal literally everything, from luxury items to the furniture itself. Work together in the dark with your flashlights and carry the heavy loot as a team.',
      { image: 'https://img.itch.zone/aW1hZ2UvNDI4NTM5MC8yNzQ4NDQ5MC5qcGc=/original/7sK8qq.jpg', caption: 'Avoid the security system, or it calls the police' },
      'But stay quiet: the top-of-the-line security system is listening, and if it catches you it contacts the police.',
      { row: [
        'https://img.itch.zone/aW1hZ2UvNDI4NTM5MC8yNzQ4NDQ4OC5qcGc=/original/IOtir2.jpg',
        'https://img.itch.zone/aW1hZ2UvNDI4NTM5MC8yNzQ4NDQ5MS5qcGc=/original/F1G1xy.jpg',
      ] },
      'Made with a team in the 4th semester at Howest DAE for the course Game Projects, and released on itch.io where it\'s playable right in the browser.',
    ],
    highlights: ['1–4 player co-op', 'Stealth & noise system', 'Team project', 'Playable in browser'],
    links: [{ label: 'Play on itch.io', url: 'https://belgus.itch.io/burglinbirds' }],
  },
  {
    id: 'beep',
    title: 'Beep & Bumper',
    category: ['games'],
    tags: ['Unity', 'Game Jam', 'Team of 10'],
    award: 'Winner',
    image: './assets/allidoiswin.jpg',
    video: './assets/stan.mp4',
    preview: './assets/stan.mp4',
    short: 'A game jam game made with a team of 10. We won!',
    description: [
      'A game jam project built with 9 other people, which is a lot for a jam, but we made it work.',
      { image: './assets/beepbumper.jpg', caption: 'In-game screenshot' },
      'We even managed to win!',
      { image: './assets/allidoiswin.jpg', caption: 'Taking 1st place on stage' },
    ],
    highlights: ['Game jam winner', 'Team of 10'],
    links: [{ label: 'itch.io', url: 'https://bramd98.itch.io/beep-bumper' }],
  },
  {
    id: 'celeste',
    title: 'Celeste',
    category: ['games'],
    tags: ['C++', 'Programming 2'],
    image: null,
    video: './assets/celeste.mp4',
    short: 'A recreation of Celeste, including its 3D menu.',
    description: [
      'For my Programming 2 assignment at the end of first year I recreated Celeste, including its 3D menu system.',
      { video: './assets/celeste2.mp4' },
    ],
    highlights: ['Platformer movement', '3D menu'],
    links: [{ label: 'GitHub', url: 'https://github.com/Ardestwastaken/CelesteV2' }],
  },
]
