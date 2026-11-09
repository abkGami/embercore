# Embercore — Strength Studio

Embercore is a fictional coached strength and conditioning studio landing page — a premium, single-page experience built around the idea of honest programming, real coaching, and a floor that never feels crowded. The tagline "Built in the heat" sets the tone: direct, calm, confident, and never shouty.

## Identity

The brand replaces the original "Nectarline / Supply Side Studio" programmatic-media concept with a fitness identity:

- **Name:** Embercore (ember + core)
- **Product line:** Strength Studio®
- **Voice:** Direct, calm, confident; no unrealistic promises, no hype
- **Colour story:** Warm graphite base (#0C0A09), a single ember-orange accent (#FF6A2B), amber secondary (#FFB547), warm cream text (#F6F1EA), and lime (#B6FF3B) used only for positive signals

The aesthetic carries forward the original's premium feel — dusk-lit atmosphere, glass UI with backdrop blur, and one moving 3D object that responds to the user — but reimagined for a gym context: a dusk-lit strength hall instead of a lotus pond, and a cast-iron kettlebell instead of a koi fish.

## Sections

**Hero** — A fixed full-viewport scene with a looping strength-hall video drawn through a WebGL hover-ripple lens. The kettlebell sits centre-right above the barbell, upright and slightly leaning, reacting to scroll velocity and mouse position. Headline: "Introducing Embercore."

**Studio** — Statement, gym stats (members, coached sessions, floor access, coach-to-member ratio), and a member-training-app dashboard mock-up showing training performance, KPIs, volume & intensity charts, format mix, and upcoming sessions.

**Programmes** — Three programme cards (Strength Blocks, Conditioning, Recovery) with a typed session-plan code block and a three-step onboarding strip.

**Timetable** — Live-feeling class schedule with day and filter controls, floor-capacity ring, hourly traffic mini-chart, and bookable rows with spot meters.

**Coaches** — Four head coach portrait cards (Imani Reyes, Tomasz Kerr, Aiyana Cole, Dre Okoye) with specialties and hover-zoom portraits.

**Who it's for** — A four-step diagonal staircase for First-Timer, Strength Athlete, Busy Professional, and Competitor member types.

**Membership** — Transparent pricing with Monthly/Annual toggle, three plan tiers (Drop-in, Core, Elite), feature checklists, and fine print.

**CTA + Footer** — "Start Training Stronger Now!" call-to-action panel with the night-hall scene behind it, followed by the footer link grid, legal bar, and ghosted Embercore wordmark.

## Technical Highlights

- **Single-page layout** built with Next.js 16 and React 19
- **Three.js 0.170.0** via CDN import map — 3D kettlebell model with scroll-driven poses, tempo pulse deformation, idle bob, and pointer-controlled camera tilt
- **WebGL ripple lens** — video texture sampled through a fragment shader with circular ripples, red/blue colour fringing, and cursor-relative tilt
- **Scroll choreography** — the kettlebell interpolates between nine poses across the page using ease-in-out cubic, spinning faster as scroll velocity increases
- **Scroll crossfade** — day plate → iron gradient → night plate as the user scrolls down the page
- **Entrance timeline** — staggered Web Animations for nav, headline, subline, buttons, and scroll card
- **Scroll reveal** — IntersectionObserver-triggered fade-up animations for cards, charts, and text blocks
- **Deterministic chart generation** — seeded random series for sparklines and area charts, with draw-in stroke animation and bar growth on reveal
- **Typography** — Inter Tight (UI), Barlow Condensed Italic (accent words), Fira Code (labels, numbers, code blocks)
- **Responsive** — desktop uses width-relative design units; mobile (≤ 820px) switches to fixed pixel values with stacked layouts and scrollable controls
- **Reduced motion** — respects `prefers-reduced-motion`: entrance timeline skipped, reveals shown immediately, kettlebell snaps to poses without easing, WebGL paused off-screen
- **Performance** — WebGL rendering pauses when the scene leaves the viewport; scroll handlers are throttled via `requestAnimationFrame`

## Design System

All UI uses a shared component vocabulary: glass surfaces, ember-filled and ghost buttons, chips (up/live variants), text links with animated arrows, bare line icons, and Fira Code data displays. Colours follow a warm graphite palette with ember-orange as the single accent; no violet, lilac, pink, or mint remains from the original concept.

## Assets

All media lives in `/assets/`: day and night plates (WebP), hero loop video (MP4), kettlebell 3D model (GLB), coach portraits (WebP), and the Open Graph image (JPG). Icons, charts, doodles, badges, and the logo orb are inline SVG or CSS — no external image files beyond the listed assets.