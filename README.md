# Atlas AI VB Fund

A scroll-driven website built with Vite, GSAP ScrollTrigger and Lenis. The white hero flows into **c02 Malachite**, the original team portraits, “THE EDGE / RUNS DEEP.”, and an unfolding ribbon portfolio. Text is HTML; motion follows the visitor’s scroll and reverses with it.

The live palette is `#256C50` Malachite, `#F3F1E3` warm ivory and `#CBBDE5` lilac. The hero retains its original paper background.

## Run locally

Use Node.js 22.12 or newer.

```sh
npm ci
npm run dev
```

```sh
npm run build
npm run preview
```

## Deploy to Vercel

Import this GitHub repository into Vercel. Use **Vite** as the framework, **npm run build** as the build command and **dist** as the output directory. The repository root is the project root. `vercel.json` includes these settings. No environment variables or API keys are required.

## Green palette review

Open `/design/greens/index.html` for the original seven-option review. **02 Malachite** is selected and implemented on the main website. Exact color values and generation prompts accompany the historical previews.

## Portfolio

The dedicated **`/portfolio/`** page includes all 28 companies in an unfolding ribbon index, with search and multi-select Industry, Country, Venture builder, Stage and Status filters. Selections survive reload and browser history. The original Atlas collection supplies every filter value. See [the portfolio page notes](docs/PORTFOLIO-PAGE.md). Both homepage and portfolio are built as Vite entry points for Vercel.

On the homepage, six continuous ribbons turn the thesis imagery into an interactive company list: **Civils.ai → Bioleap → ZeroDrift → Tilki → Sekkari → 8x**. Opening a company reveals its artwork and details while neighboring rows compress within the same viewport. The sequence continues into the three-part investment approach. “Explore all 28 companies” opens the dedicated portfolio page, including the explicitly marked Tylo AI exit. See `docs/PORTFOLIO-RIBBONS.md` for the homepage transition.

ZeroDrift, Tilki and Sekkari have generated brand artwork grounded in their public company imagery and visual identities. Their original marks are overlaid separately. The 8x cover uses the exact official SVG paths with satin shading and a masked light sweep. Its animation respects reduced-motion preferences. Artwork source URLs and final prompts are recorded in `docs/company-artwork-prompts.json`.

## Investment approach

The approved photographic studies become three reversible reveals on the same Malachite field: a founder emerges from grain, four opposing bands introduce technical risk, and a central aperture releases a silicon wafer before its hand and detail crop resolve. Captions remain semantic HTML. One lazy-loaded WebGL canvas composites three transparent WebP assets, totaling 889,054 bytes; it draws only when the scroll state changes. A normal image fallback remains available if WebGL cannot run.

Start at `/#approach`. Reading holds are `/#approach-founders`, `/#approach-engineering`, and `/#approach-defensible`. The six approved storyboard poses are directly reviewable at `/#approach-frame-1` through `/#approach-frame-6`. Small screens and reduced-motion preferences use a complete natural layout. Independent animation of the wafer’s individual components is reserved for the next design pass.

See `docs/APPROACH.md` for choreography, asset provenance and implementation details. Run `npm test` to check motion sampling and renderer lifecycle behavior.

## Investment thesis and pillars

After the wafer, two text-and-cutout compositions lead into the four strategic investment pillars on the same pinned scroll timeline. Words reveal inside masks, the first word holds through a continuous image handoff, and the four open columns draw in before their paragraphs arrive. Each complete thought has a reading hold. Six new transparent artwork assets are local and decode before the section enters.

Open `/#investment-thesis` or use Manifesto. The reading holds are `/#thesis-people`, `/#thesis-risk`, and `/#investment-pillars`; the six preview poses are `/#thesis-frame-1` through `/#thesis-frame-6`. Phones and reduced-motion preferences use natural document flow. See `docs/BELIEFS.md` for timing, layout and provenance. The sequence leads into the contact invitation and Atlas footer.

## Contact and footer

Open `/#contact` for the contact invitation or `/#site-footer` for the closing Atlas mark. At the owner's request, “Let’s talk” opens the original Atlas website, which contains its contact form. This prototype does not collect or send visitor data, so it needs no mail service, credentials or environment variables.

The footer preserves the original Atlas SGR logo geometry at page width. It rises through a mask with a restrained lilac light sweep as it enters view; reduced-motion visitors see the complete static mark. Navigation returns to settled chapters in the page, and legal links open the original Atlas policies. The contact area and footer use normal document flow after the pinned thesis sequence.

## Motion and accessibility

Each home-page load opens with **The lift**, an approximately 3.5-second
animation of the original Atlas figure and globe that reveals the live hero and
lands on the header logo. Refreshes and hard refreshes replay it, including at a
chapter bookmark, while ordinary in-page navigation does not. The visible skip
button is removed; Escape and reduced-motion support remain. Direct chapter
links open immediately. See `docs/INTRO.md` for readiness,
failure handling and SVG provenance.

The scrollbar has a rounded 4px visible thumb, with Malachite ink on the white
hero and ivory on green. Its track matches the page and has no arrows. The native
drag target stays wider than the visible thumb. Firefox uses its native thin
variant, and forced-color mode retains system colors.

- Desktop widths of 900px and above use one pinned, reversible scroll sequence.
- Smaller screens use a complete, naturally scrolling layout.
- Reduced-motion preferences use the natural layout and remove the text sheen.
- The navigation jumps to settled scroll states. A skip link, focus indicators, alt text and semantic headings are included.
- Inactive scenes and distant portfolio images are excluded from keyboard focus. The company dialog uses native modal focus handling and Escape to close.
- The team photographs retain their natural appearance; Matteo's portrait uses the replacement supplied by the site owner. The original Atlas logo geometry is preserved, recolored to fit the palette.

## Sources and assets

Fund positioning, team names and roles, and portfolio context come from the public [Atlas website](https://www.atlasaivbfund.com/), [manifesto](https://www.atlasaivbfund.com/manifesto) and [portfolio](https://www.atlasaivbfund.com/portfolio). Company and manifesto links currently open those official pages.

The hero and thesis photographs are generated editorial imagery, rather than depictions of Atlas staff, offices or specific portfolio products. Three selected company covers are generated brand interpretations; 8x is authored from its official logo. Other company imagery and official logos are local copies of public source assets. Each company’s record in `src/data/companies/` includes its source URLs, country, status and verification date. Short sector descriptions are editorial summaries. Matteo's active portrait (`public/assets/matteo-confalonieri.png`) is the unmodified image supplied by the site owner on 4 October 2026. The other team files are byte-for-byte copies of their public source assets.

Typography uses locally hosted Bodoni Moda and Instrument Sans. Their SIL Open Font License files are included in `public/assets/`.

See `docs/VERIFICATION.md` for the completed checks and their limits.
