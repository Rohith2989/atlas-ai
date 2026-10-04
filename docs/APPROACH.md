# Investment approach — native scroll reveals

This replaces the rejected camera/table section with the three approved photographic compositions. The existing hero, original team photography, Malachite palette and six-company diagonal sequence are retained.

## Scroll choreography

One pinned sequence covers approximately 4.2 viewport heights of scroll. Its state is derived entirely from scroll position, including the grain pattern, so backtracking restores the same composition.

| Progress | Motion | Review bookmark |
| --- | --- | --- |
| 0–14% | 8x continues diagonally away. A monochrome founder emerges through a granular edge; the diffraction study follows. | `#approach-frame-1` at 8% |
| 14–32% | The portrait, writing-hand detail and short caption settle. | `#approach-frame-2` at 24% |
| 32–48% | Unequal horizontal bands carry the portrait away while alternating bands introduce the engineering photograph. The two headline lines arrive separately. | `#approach-frame-3` at 40% |
| 48–66% | Four original engineering openings settle, with a clear reading interval. | `#approach-frame-4` at 57% |
| 66–82% | A granular central aperture opens onto the wafer. Upper and lower engineering bands compress and leave; the hand resolves after the wafer. | `#approach-frame-5` at 74% |
| 82–96% | The detail crop and final caption settle. | `#approach-frame-6` at 90% |
| 96–100% | A final reading interval leads into the existing footer through natural unpinning. | |

The progress track contains three keyboard-accessible chapter links. Direct links restore a settled reading position after reloading. The header stays on the same green field. Fonts, logo geometry, colors, image registration and short copy follow the approved studies.

## Implementation

- `src/approach-motion.js`: bounded, deterministic phase sampling, independent of WebGL or GSAP.
- `src/approach-shaders.js`: transparent compositing, image-space grain, four-band transfers and the wafer aperture.
- `src/approach-renderer.js`: lazy shared image decoding, a single canvas, capped backing resolution, no idle animation loop, context-loss fallback and resource disposal.
- `src/approach.js`: semantic content, masked line reveals, chapter state and bookmarks.
- `src/approach.css`: contained desktop composition and natural responsive layout.

Below 900px, all three articles appear in normal document flow with a short on-entry reveal. Reduced-motion preferences use static articles. A failed or lost WebGL context exposes a real-image fallback; context restoration paints the latest scroll state. These are intentional fallback treatments, not the full desktop shader sequence.

## Artwork

The three approved website studies were edited with the built-in image generation tool to remove baked typography and green backgrounds while retaining photographic content and registration. Real HTML supplies all copy. The results were visually inspected and encoded as transparent WebP with Sharp at quality 92 and alpha quality 100.

| Asset | Bytes | Source study |
| --- | ---: | --- |
| `public/assets/approach/founder.webp` | 211,692 | `01-human-signal.png` |
| `public/assets/approach/engineering.webp` | 209,514 | `02-crosscurrent.png` |
| `public/assets/approach/wafer.webp` | 467,848 | `03-compound.png` |

Final generation prompts and original local source references are in `approach-asset-prompts.json`. PNG masters and the approved storyboard remain in the design workspace outside the deployable repository. These are generated editorial illustrations; the pictured person is not represented as an actual Atlas employee or portfolio founder.

The wafer reveal, hand and detail crop are implemented. Motion of individual silicon components remains a separate, deferred design pass, as requested.

## Verification

`npm test` checks all reading holds, alternating handoff order, wafer-before-hand timing, 1,001 forward/reverse samples and the renderer lifecycle using a mocked WebGL context. The lifecycle test covers unchanged-frame suppression, resize redraw, resolution limits, context loss/restoration at the latest scroll position, and disposal.

The production build passes. Real browser review covers the six bookmarked desktop poses, forward/reverse wheel input, chapter navigation and deep-link reloads; mobile review covers the natural layout, lazy artwork loading and no horizontal overflow. Context-loss behavior is unit-tested, not forcibly triggered on a physical GPU. See `VERIFICATION.md` for broader site checks and limits.
