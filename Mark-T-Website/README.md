# Handoff: Brush-line personal site (Home, Freediving, Sound, Journal, Editor)

## Overview
A personal website whose navigation is a hand-painted brush drawing. The Home page paints one of ~22 symbols (ensō, wave, maple leaf, lotus, octopus…) as calligraphic brush strokes; coloured strokes end in dots that are the links to the site's sections (Freediving, Sound, Journal). Pages hand off to each other with continuous animated transitions: lines fly into a small dot-nav in the top-right, the Freediving page floods in as water, colours are "absorbed" back into the nav dots on the way home. Freediving is a vertical dive log: a rope descends from a buoy, journal entries hang on it by depth, and a small pink squid lives beside the line. Sound and Journal are placeholder pages ("In progress") sharing the same nav. A Site Editor manages the journal data.

Repo on record: `marktalevski/fistrice` (branch `main`); it was empty when this project started.

## About the Design Files
The files in this bundle are **design references created in HTML**: prototypes that show the intended look and behaviour. They are not production code to copy directly. Recreate them in the target codebase's environment using its established patterns. If there is no codebase yet, a good fit is **Astro or Next.js** (static pages, client islands) with each page's painting done in a single `<canvas>` driven by `requestAnimationFrame`. The prototypes are `.dc.html` "Design Components": each opens directly in a browser via `support.js` (a small runtime that mounts a template plus a logic class). In each file the logic is a single `class Component` inside `<script type="text/x-dc">`, and nearly all of the drawing logic is plain canvas JavaScript you can port almost line for line.

## Fidelity
**High-fidelity.** Colours, type, timings and motion are final unless noted under "Open items". Match the brush rendering, timing curves and transitions closely; they are the product.

---

## Screens / Views

### 1. Home (`Home - Brush Lines v2.dc.html`)
**Purpose:** landing page; discover the section links hidden in a painted symbol.

**Layout**
- Full-viewport fixed stage, `overflow:hidden`, background `#f5f3ee` (paper).
- One full-size `<canvas>` (DPR-aware, `pointer-events:none`) paints everything. A paper-grain tile (220×220 noise, multiplied at α .35) goes over the top every frame.
- Symbol geometry: centre `cx = W/2`, radius `R = min(W*(W<720 ? .19 : .26), H*.27)`, `cy = H/2 − R*.22`. Shapes are authored in unit coordinates (roughly x ∈ [−2.5, 2.1], y ∈ [−1.2, 1.7]) and scaled by R.
- Absolutely positioned DOM `<button>`s sit over the canvas at the dots: Freediving, Sound, Journal, plus a hidden 44×44 "Shuffle symbol" button on the black ink head (clicking it paints a new random symbol).

**Components**
- **Brush lines:** seven lines (`LINES`). The black ink line (`#141414`, width ≈9 px) draws the symbol. Six coloured lines, each ≈9 px wide:

  | Line | Colour | Role |
  |---|---|---|
  | 1 | red `rgb(232,34,44)` | Sound |
  | 2 | yellow `rgb(255,196,0)` | Journal |
  | 3 | blue `rgb(24,88,224)` | Freediving |
  | 4 | orange `rgb(255,118,18)` | decorative |
  | 5 | green `rgb(22,168,82)` | decorative |
  | 6 | purple `rgb(138,64,214)` | decorative |

  Each shape can override where the coloured lines go (`colorPaths` per shape: lotus petals, wave spirals, octopus tentacles, maple veins, headphone cups…). Each line ends in a filled dot of its colour (r ≈7–8 px).
- **Stroke rendering** (keep this; it's what makes it look like paint):
  1. Lines are built as quads along a centreline, with per-point width (pressure: a heavier landing that eases over the first ~12%, and a *harai* taper over the last 50–150 px).
  2. Each line is turned into an opacity mask with max/darken blending, so self-overlaps don't double up. It is then composited as `page·(1−m) + colour·m`. Lines blend translucently with one another.
  3. **Paint texture** (`streaks()`), drawn in stroke space so it follows every curve:
     - Ridges lit from the upper left: a pale highlight on the edge facing the light and a soft shadow on the far edge; they swap as the stroke turns.
     - Two or three same-hue stripes, slightly lighter or deeper, that drift across the stroke and swell and thin.
     - A richer, heavier first ~18% (the loaded brush).
     - Dry-brush paper gaps opening over the last 45% of coloured strokes. Black ink stays solid.
  4. The composited stroke canvas is cached by a geometry signature and re-used when nothing moved. Target ≤3 ms per frame.
- **Labels:** Newsreader italic, weight 300, 24 px, letter-spacing −0.01em, `#141414`.
- **Wave symbol:** a black breaking wave with a spiral curl. Blue rides inside it and curls into the heart of the crest (Freediving dot at the centre). Five small staggered waves (red, orange, green, yellow, purple) each rise to a crest and end in a clockwise spiral, with the dot at the spiral's centre.
- **Maple symbol:** a black leaf outline with five lobes, coloured veins from the base to each lobe tip (dots at the tips) and a purple stem.

**Shape list** (prop `shape`; default `random`): enso, spiral, triforce, triskele, wave, maple, octopus, hangul, spring, mountain, vinyl, camera, book, onsen, lotus, coffee, headphones, plane, gameboy, longfins, egg, samurai.

### 2. Freediving (`Freediving v2.dc.html`)
**Purpose:** a dive log read as a descent.

**Layout:** full viewport. The water surface sits at `SY = max(H*.26, 190)` and the left gutter at `LX = 26` (or 56 when W ≥ 720). A buoy (orange `rgb(255,118,18)` ellipse 44×26 with a cream `#f6efe0` band) and a red flag (`rgb(232,34,44)`, 22×14 with a cream diagonal) float on three surface wave lines: black, light blue `rgb(0,158,224)` and deep blue `rgb(34,86,186)`. The rope runs down from the buoy, and entries hang on it by depth (`metersPerEntry` = 3 m by default). The water darkens with depth (`darken` prop). The top-right dot nav lists Home · Freediving · Sound · Journal, with Korean alternates (홈 · 프리다이빙 · 소리 · 일기).

**Squid:** pink `rgb(244,138,172)`, drawn on canvas (`drawOcto`). It wanders beside the line.

**Props:** `intro` (true), `motion` (true; set it false for the reduced-motion version), `darken` (true), `gris` (false), `metersPerEntry` (3).

### 3. Sound / 4. Journal (`Sound.dc.html`, `Journal.dc.html`)
Placeholder pages: a centred `h1` ("Sound" / "Journal") with "In progress" beneath, a canvas background and the shared top-right dot nav (`aria-current="page"` on the active item). Fonts: Newsreader and Noto Serif KR (500/600) for the Korean labels.

### 5. Site Editor (`Site Editor.dc.html`)
An internal tool for editing the journal data in `site-data.js`.

**Layout:** a header with "Editor", "Open site ↗", a save/storage note, and Export JSON / Import / Reset to sample. Below it, Name and Intro inputs, then a sidebar with three line tabs (up / right / down, each with a count), "+ New entry", and the entry list; the main area holds the entry form (Title, subtitle, body, tags, image).

**Palette:** `#f2f0e9` bg, `#10232c` ink, `#1f6f86` accent, `#b5502c` / `#8a3a1c` warm accents, `#5b6b70` / `#4a5b61` muted text, `#ebe8df` / `#dfe9e8` panels. Fonts: Familjen Grotesk (UI), Newsreader, JetBrains Mono.

---

## Interactions & Behavior

**Home intro:** the ink line draws first, then the coloured lines follow, each with its own delay and speed. Labels and buttons become active once their line has finished (`readyT`), with a 0.5 s fade.

**Shuffle:** clicking the ink head morphs the current symbol into a new random one: the old strokes un-draw and the new ones draw on.

**Home → Freediving:**
- The lines leave as streams into the top-right nav dots.
- The three surface wave lines carry straight over to Freediving.
- The orange and red lines pass through where the buoy and flag will be; the colour spreads out from where each line enters, and the outline fades in with it.
- The water rises in as a tide (about 2 s). Nav labels fade in over 0.9 s.
- Navigation saves the nav-dot positions to `sessionStorage['nav-from']` so the next page can continue the motion.

**Freediving intro (squid):**
1. 0–1.7 s: swims in, uncoloured, from the bottom right to mid-screen.
2. A red line pours from the Sound nav dot into it (1.3 s); it turns pink and its eyes become ^^ with blush.
3. A big loop: radius `max(50, min(170, W*.2, (H − y − 70)/2))`, 2.1 s.
4. With no stop, it carries on out of the loop to its place beside the rope (1.5 s, ease-out).

**Freediving → Home ("absorb"):**
- The black and two blue surface lines lift off one after another and each dances its own path to its nav dot:
  - black: one grand calligraphic swoop, thick in the middle;
  - light blue: one slow open loop that swells as it turns;
  - deep blue: a weaving ribbon.
  Durations are 1.75–1.95 s, starting 0.45 / 0.7 / 0.9 s after the click.
- The buoy, flag and squid colours each leave as a tapered brush stroke with their own sway, lean and width rhythm. The squid's pink turns red on its way to the Sound dot, and the squid fades back to pale.
- Each nav dot pulses once (scale 1 → 1.2 → 1) as its colour arrives.
- From 2.45 s, the labels draw up into their dots one after another, 0.1 s apart: they rise 30 px, squash (scaleY → .15, scaleX → .5), blur to 2.5 px and fade, each over 0.75 s.
- At 3.55 s the page navigates to Home with `?from=dive`. Home then places its nav dots exactly where Freediving left them, so nothing jumps.

**Easing:** mostly smoothstep (`x²(3−2x)`), cubic in-out for travel and cosine for dancing heads.

**Hover (current prototype):** a soft radial glow (r 60 px, α .3) of the line's colour behind the hovered dot.

**Responsive:** below 720 px wide the symbol radius uses the `.19` factor, and the section stations fall back to a row beneath the symbol (20% / 50% / 80% of the width).

**Reduced motion / older browsers:** the project notes ask for a **static, no-animation version** for older browsers, phones and people who prefer reduced motion, to be built once the animated site is settled. Respect `prefers-reduced-motion`.

---

## Open items (decided, not yet in the prototype)
**Home hover-reveal labels.** This replaces the always-visible labels:
- Labels are hidden by default. There is **no** first-visit reveal; finding them is part of the experience.
- Each section button is a ≥48 px circular hit target centred on its dot.
- On hover or keyboard focus, the label writes out from the dot on the side facing away from the symbol centre: a clip-path reveal plus an 8 px slide, about 0.35 s, smoothstep.
- At the same time, everything else fades to about 25%: the page colour `#f5f3ee` laid over at α ≈ .75, with the hovered line and its dot recomposited on top at full strength. Don't use a blur; it's too expensive per frame.
- The hovered dot breathes (scale 1 → 1.15).
- On touch screens (`(hover: none)`), the first tap reveals the label and the second tap navigates.
- The Freediving page's nav stays as it is.

---

## State Management
- **Home:**
  - `T` (seconds since the symbol started) and `readyT` (when all lines are done).
  - `go` (exit clock) and `dest` (the page being navigated to).
  - `shapeName`: from the prop, otherwise random, re-picked on shuffle.
  - `hov`, `hovT`, `hovPg[k]`, `hovPgT[k]`: hover targets and their smoothed values (exponential, rate 8/s).
  - `stations`: the dot position for each page.
  - `navArrive`: nav-dot positions read from `sessionStorage['nav-from']`.
- **Freediving:**
  - `introT` and `introDone`; `leaveT` (exit clock); `tideY`.
  - `sqI` (squid intro clock), `sqPos`, `sqDrain`.
  - `buoyPos`, `navPos[k]` (measured from the DOM nav dots).
- **Data:** `site-data.js` exports `KEY = 'tl-site-v1'` (the `localStorage` key), `LINES = ['up','right','down']`, `seed()`, and the load/save functions. Entries are `{ id, line, title, subtitle, body, tags, date, image? }`. The Editor writes this data, and Freediving reads the `down` line.

## Design Tokens
- **Paper:** `#f5f3ee`. **Ink:** `#141414`. **Cream (buoy/flag details):** `#f6efe0`.
- **Line colours:**
  - red `#E8222C` (232,34,44)
  - yellow `#FFC400` (255,196,0)
  - blue `#1858E0` (24,88,224)
  - orange `#FF7612` (255,118,18)
  - green `#16A852` (22,168,82)
  - purple `#8A40D6` (138,64,214)
  - light blue `#009EE0` (0,158,224)
  - deep blue `#2256BA` (34,86,186)
  - squid pink `#F48AAC` (244,138,172)
- **Freediving depth palette:** `#2c475d`, `#3e5a72`, `#6d8aa0`, `#d9e3e6`, `#e9eef0`, `#f2efe6`. Accents: `#d4452a`, `#e2a93b`, `#ee9aa8`, `#93a878`, `#6b7f4f`.
- **Type:**
  - Newsreader (Google Fonts): italic 300 for labels at 24 px; 300–600 for text.
  - JetBrains Mono 300–500 for meta.
  - Noto Serif KR 500/600 for the Korean nav.
  - Familjen Grotesk 400–600 for the Editor UI.
- **Stroke widths:** ink ≈9 px, colour lines ≈9 px. Dots r 7–8 px; nav dots 18 px.
- **Grain:** 220 px noise tile, multiplied at α .35.
- **Radii / shadows:** none. Everything is flat paint on paper.

## Assets
No raster assets: every visual is drawn procedurally on canvas, and fonts load from Google Fonts. Journal entry images are user-supplied through the Editor and stored in `localStorage`.

## Files
- `Home - Brush Lines v2.dc.html`: Home. Its logic class holds `shapeOf()` (all symbol geometry), `miniWave()`, `WAVES`, `blueRide`, `streaks()` (paint texture), `build()`, `tick()` and the exit/arrive transitions.
- `Freediving v2.dc.html`: dive log, water, buoy, squid (`drawOcto`), `danceWave()` and the leave sequence.
- `Sound.dc.html`, `Journal.dc.html`: placeholder pages with the shared nav.
- `Site Editor.dc.html`: data editor.
- `site-data.js`: data model, seed data and persistence.
- `support.js`: the prototype runtime, needed only to open the `.dc.html` files. Do not port it.
