# Verification — 2026-10-04

## Completed

- Vite production build passed.
- Desktop review at 1280 × 720: hero letter proportions and paper-backed contrast, six-company diagonal field, all new cover images, and the 8x endpoint.
- Forward wheel scrolling and reverse scrolling reviewed. The pinned scene follows scroll input.
- Hero and portfolio navigation, portfolio deep-link reload, and next-company controls reviewed. The counter advances through ZeroDrift, Tilki, Sekkari and 8x; the last next button is disabled at 06 / 06.
- Current mobile review at 474 × 1292: natural layout, six company covers loaded, no horizontal overflow or runtime errors. Timeline controls are hidden in the natural layout. Earlier 390px review verified the retained hero, portraits and thesis.
- Desktop-to-mobile resize defect corrected: timeline inline styles are cleared before the responsive layout is rebuilt.
- No browser warnings or runtime errors were recorded during the reviewed desktop sequence.
- All four team photographs match the preserved source files by SHA-256.
- Atlas’s official portfolio and manifesto destinations were checked.
- All 28 official portfolio profile pages were retrieved successfully. Company names, countries and exit status were checked against Atlas’s public portfolio on 2026-10-04. The featured sequence contains exactly Civils.ai, Bioleap, ZeroDrift, Tilki, Sekkari and 8x. The searchable index retains all 28 companies.
- The company dialog opens, filters by sector and closes while resuming the underlying scroll. The native modal contains keyboard focus; inactive desktop scenes and distant portfolio figures are inert.
- The rejected contour section, its navigation, styles and animation code were removed. The portfolio now unpins into the existing contact footer; the footer was observed entering directly after the final company.
- ZeroDrift, Tilki and Sekkari artwork was generated from company-specific visual references, inspected and encoded as WebP. The three PNG masters are retained in the workspace outside the deployable repository. Final prompts and sources accompany the website.
- 8x artwork contains only the official 8x mark with satin shading and an animated light sweep. SVG path data matches the original file exactly. The four new covers total 603,837 bytes.
- Original Atlas SVG geometry is preserved through a CSS mask: dark in the white hero, warm ivory on Malachite. Text/background token contrast is 5.54:1.
- Generated main-site image payload reduced from 9,888,499 to 921,680 bytes. Team photographs were not re-encoded.
- The next-section aperture proposal was subsequently rejected and archived outside this repository’s public output. A seven-option green palette gallery replaces the design review.
- Green review: all seven images loaded; palette switching and the comparison view worked; 390px and desktop layouts showed no horizontal overflow. Specified text/background pairs have contrast ratios from 4.51:1 to 10.40:1. These are palette specification checks, rather than pixel measurements of the generated mockups.

## Approved approach implementation

- Replaced the previous camera/table approach with the approved portrait, engineering bands and wafer compositions. Real HTML captions use the existing Instrument Sans font; the new image assets contain no baked typography.
- Reviewed all six desktop storyboard poses at 1440 × 900. The portrait entry, alternating band handoff, settled compositions and wafer release were compared with the approved studies. The compact desktop layout was also checked at 1024 × 768.
- Forward and reverse wheel input returned through the same engineering/wafer states (74% → 50% → 74%). Chapter links and direct reloads restore the matching reading holds. Desktop hashes no longer cause the nested pinned artboard to scroll independently.
- Mobile review at 390 × 844 confirmed all three natural-flow articles, visible loaded artwork, correct chapter bookmark mapping, and no horizontal overflow (375px content and scroll widths). Moving between mobile and desktop restores the selected chapter.
- Five Node tests passed: reading holds; opposing handoff order; wafer/hand/detail timing; bounded forward and reverse sampling; and renderer allocation, redraw, context restoration and cleanup. WebGL lifecycle assertions use a mocked context; actual shader compilation and visual rendering were checked in the browser.
- Vite production build passed. The new renderer is a separate lazy chunk (9.59 kB uncompressed at verification). The three transparent WebP assets total 889,054 bytes. No video generation service or runtime API key is needed.
- No browser errors or warnings were recorded during the new scene review. The existing hero, actual team portraits and six-company sequence are preserved. The new approach now sits between the final 8x company and the existing footer.
- Individual wafer components are not animated in this pass; its reveal, hand and detail crop are implemented for review first.

## Investment thesis and strategic pillars

- Integrated the approved two inline-image text compositions and four new pillar illustrations into the main pinned timeline after the wafer. The section uses semantic HTML, reversible word and paragraph masks, and a continuous notebook path.
- Reviewed desktop reading holds and the handoff at 1440 × 900 and 1100 × 800. At the narrower desktop width, all four columns, artwork and paragraphs fit within the viewport.
- Forward and reverse wheel input returned through the same new reveal state (36.79% → 47.08% → 36.79%). The chapter links return from the four-pillar layout to the first statement.
- Mobile review at 390 × 844 confirmed readable inline-image statements, stacked pillar cards, loaded artwork and zero horizontal overflow. Changing between mobile and desktop rebuilds the measured paragraph masks and restores the selected chapter.
- All six new image assets decoded in the browser. The set is requested before the preceding approach sequence finishes, avoiding first-reveal loading gaps. Transparent WebP payload is 1,107,252 bytes.
- Cold Contact reload exposed a visual/accessibility-state mismatch; explicit state synchronization after timeline seeks and refreshes corrected it. Retest showed the final 03 / 03 chapter, active Four beliefs link, visible section and 100% progress. The footer enters on the same green field without a white seam; the opaque header prevents passing text from colliding with navigation.
- Existing five Node motion/renderer tests and the Vite production build passed. These unit tests cover the prior approach renderer; the new DOM choreography was checked through actual browser interactions.
- Main navigation now links Manifesto to the complete investment thesis. The new sequence ends in the existing Contact footer; the later Get in Touch form is not part of this change.

## Contact invitation and Atlas footer

- Added the requested contact handoff: “Let’s talk” links to the original Atlas website in a new tab. No data-entry fields, submission endpoint, credentials or simulated success state are present.
- Reviewed the contact and footer at 1100 × 800 and 390 × 844. The phone layout stacks the invitation, keeps the original wordmark fully visible and has no horizontal overflow.
- Verified the footer's Back to the beginning link returns to `#hero`. Direct `#contact` and `#site-footer` loads resolve after the main pinned sequence. Original privacy, cookie, complaints and whistleblowing links were checked against Atlas's site.
- The original logo file is reused without changing its geometry. The reveal and light sweep are separate scroll animations outside the pinned main sequence; CSS and JS both provide a reduced-motion fallback.
- Vite production build and all five existing motion/renderer tests passed. No browser errors or warnings were recorded in the phone review. Desktop proof images are `docs/screenshots/contact-desktop.jpg` and `docs/screenshots/footer-desktop.jpg`.
- The proposed company-gallery replacement is a separate visual concept for review. The current six-company implementation remains available until the new design is selected.

## Turning-wave portfolio replacement

- Replaced the superseded gallery and its fold code with six compact accordion rows and the approved, scroll-driven 3D ribbon entrance. The outgoing scene is printed on the front; the company art and names emerge on the reverse. Actual HTML controls take over when the wave settles.
- Reviewed entry, midpoint, landing and settled index at 1440 × 900. Forward wheel input advanced progress from 0.50 to 0.625; the matching reverse input returned to 0.499. Opening Tilki, switching to 8x and Escape-closing each exposed the correct accessible state. Searching “photon” in the full dialog returned Sekkari as the single result.
- At 1440 × 700, the expanded ZeroDrift details stayed inside the row and all six names remained visible. At 390 × 844, Bioleap expanded to a readable 473px article with no horizontal overflow; all six closed rows remain compact. Desktop/mobile resizing rebuilds the scene and releases the previous WebGL context.
- Nine tests and the production build passed. The corrected VSM renderer produced no new console errors or warnings in the final browser review. The lazy renderer chunk is 135 kB gzipped; the build retains Vite’s default large-chunk advisory.
- Contact still lands below the pinned sequence and links to the original Atlas website. Implementation notes and limits are in `PORTFOLIO-RIBBONS.md`.

## Limits

This is visual and functional browser verification, focused automated tests and a production build. Reduced-motion fallback is implemented; the browser review did not emulate the operating system setting. Physical phones and Safari have not been tested. Desktop screenshots capture the visible in-app browser panel; its right edge can crop the larger test viewport. Malachite remains selected. Historical checks above describe the site at their respective implementation stages; the approved approach section supersedes the earlier portfolio-to-footer ending.
