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

## Limits

This is visual and functional browser verification plus a production build. Reduced-motion fallback is implemented; the browser review did not emulate the operating system setting. Physical phones and Safari have not been tested. Desktop screenshots capture the visible in-app browser panel; its right edge can crop the larger test viewport. Malachite remains selected. The next creative section will be designed separately.
