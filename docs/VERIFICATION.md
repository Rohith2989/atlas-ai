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

## Limits

This is visual and functional browser verification, focused automated tests and a production build. Reduced-motion fallback is implemented; the browser review did not emulate the operating system setting. Physical phones and Safari have not been tested. Desktop screenshots capture the visible in-app browser panel; its right edge can crop the larger test viewport. Malachite remains selected. Historical checks above describe the site at their respective implementation stages; the approved approach section supersedes the earlier portfolio-to-footer ending.
