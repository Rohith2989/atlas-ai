# Portfolio ribbon entrance

The approved turning-wave transition replaces the diagonal company journey and
the superseded folding gallery. The existing Edge composition turns into six
printed ribbons, then settles into a compact, clickable portfolio index.

## Rendering and handoff

- `portfolio-motion.js` describes six continuous surfaces as a pure function of
  scroll progress. A turn moves from right to left, staggered from the first
  company to the last. Seeking backwards returns through the same geometry.
- `portfolio-ribbons.js` measures the outgoing DOM and paints its real text and
  photographs onto front-face canvas textures. The reverse faces contain the
  existing company artwork, original company names and sectors.
- Three.js provides perspective, warm directional light, a cooler fill, surface
  normals, soft VSM shadows and a thin lit edge. The materials become unlit at
  either endpoint to match the surrounding HTML precisely.
- Final geometry uses the measured HTML row coordinates. The canvas becomes
  hidden once the real buttons take over. No video, generated screenshot or API
  key is used at runtime.
- The renderer loads during the preceding thesis scene, draws only when progress
  changes, caps pixel density at 1.5 and releases geometries, materials, textures,
  shadow targets and its WebGL context when the layout rebuilds.

## Interaction

The six featured companies are Civils.ai, Bioleap, ZeroDrift, Tilki, Sekkari and
8x. One row expands at a time. Neighbouring rows compress within the same overall
height; an offset aperture reveals the larger image. Clicking again or pressing
Escape closes the row. Switching companies retargets the current animation.
Hidden details are inert, and each button exposes `aria-expanded` and its
associated detail region. The full searchable 28-company dialog remains.

Below 900px, or with reduced motion enabled, the section uses natural document
flow and an accessible accordion. Reduced motion makes row changes immediate.
If WebGL cannot initialize or loses its context, a clipped HTML reveal remains
available. The 8x satin treatment preserves the exact original SVG path.

## Review locations

- `#thesis`: scroll forward from the preceding composition.
- `#portfolio-turn-1` through `#portfolio-turn-5`: 1%, 22%, 50%, 86% and 100% poses.
- `#companies`: settled, interactive index.

The turn takes about 1.1 viewport heights of scroll, followed by a reading hold
of about 0.7 viewport heights. The existing approach, thesis, contact invitation
and footer continue after it.

## Verification

Nine Node tests pass, including start/end geometry across four heights, bounded
depth and reverse seeking, accordion height conservation and exact logo-path
preservation. The production build passes. Its separate, lazy ribbon/Three.js
chunk is approximately 135 kB gzipped; Vite reports its default 500 kB
uncompressed chunk warning. It is not part of the initial JavaScript entry.

Browser review covered 1440 × 900, 1440 × 700 and 390 × 844; open, switch,
Escape-close, modal search, mobile expansion, resizing, direct links and forward
and reverse wheel input. The phone layout has no horizontal overflow and creates
no ribbon canvas. Native reduced-motion preference and physical Safari/iOS were
not emulated in this review.

Live browser proof: `screenshots/portfolio-ribbon-transition.jpg`.
