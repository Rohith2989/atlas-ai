# Verification — 2026-10-04

## Completed

- Vite production build passed.
- Desktop breakpoint review at 1280 × 720: white hero, Malachite handoff, people reveal, investment thesis, diagonal company field and layered contour scene.
- Forward wheel scrolling and reverse scrolling reviewed. The pinned scene follows scroll input.
- Navigation to the hero, people, manifesto and portfolio entrance reviewed. Company controls move the same pinned timeline forward/backward. Proof tabs reveal the corresponding text, and a direct Technology deep link restores the correct scene after reload.
- Mobile review at 390 × 844: hero, original portraits, thesis, portfolio and all proof articles render in natural page flow. The portfolio and proof anchor links work, with no horizontal overflow or failed images.
- Desktop-to-mobile resize defect corrected: timeline inline styles are cleared before the responsive layout is rebuilt.
- No browser warnings or runtime errors were recorded during the reviewed desktop sequence.
- All four team photographs match the preserved source files by SHA-256.
- Atlas’s official portfolio and manifesto destinations were checked.
- All 28 official portfolio profile pages were retrieved successfully. Company names, countries and exit status were checked against Atlas’s public portfolio on 2026-10-04. Source URLs are stored with each record. The site presents ten selected companies in its diagonal field and all 28 in its searchable index.
- The company dialog opens, filters by sector and closes while resuming the underlying scroll. The native modal contains keyboard focus; inactive desktop scenes and distant portfolio figures are inert.
- The contour scene’s containing height was corrected after live testing, and its text/SVG were then visually verified on desktop and mobile.
- Original Atlas SVG geometry is preserved through a CSS mask: dark in the white hero, warm ivory on Malachite. Text/background token contrast is 5.54:1.
- Generated main-site image payload reduced from 9,888,499 to 921,680 bytes. Team photographs were not re-encoded.
- The next-section aperture proposal was subsequently rejected and archived outside this repository’s public output. A seven-option green palette gallery replaces the design review.
- Green review: all seven images loaded; palette switching and the comparison view worked; 390px and desktop layouts showed no horizontal overflow. Specified text/background pairs have contrast ratios from 4.51:1 to 10.40:1. These are palette specification checks, rather than pixel measurements of the generated mockups.

## Limits

This is visual and functional browser verification plus a production build. Reduced-motion fallback is implemented; the browser review did not emulate the operating system setting. Physical phones and Safari have not been tested. Desktop screenshots capture the visible in-app browser panel; its right edge can crop the larger test viewport. Malachite is selected and the replacement section is implemented for interactive review.
