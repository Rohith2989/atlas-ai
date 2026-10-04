# Atlas AI VB Fund

A scroll-driven website built with Vite, GSAP ScrollTrigger and Lenis. The white hero flows into **c02 Malachite**, the original team portraits, “THE EDGE / RUNS DEEP.”, a pinned diagonal portfolio and an original contour reveal of Atlas’s investment criteria. Text is HTML; motion follows the visitor’s scroll and reverses with it.

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

## Portfolio and the next section

The thesis photographs retain their positions when they become the first two images in a continuous diagonal field. Ten selected companies move across the pinned viewport in different proportions. Previous/next controls and “Under the surface” allow visitors to move directly through the experience. A searchable modal index contains all 28 companies in Atlas’s public portfolio, including the explicitly marked Tylo AI exit.

The following scene uses an authored SVG contour field, with three layers for data, distribution and proprietary technology. Short lines of HTML text reveal alongside each layer. Its tabs jump to each settled state. This is browser code, not a rendered video or HyperFrames project.

## Motion and accessibility

- Desktop widths of 900px and above use one pinned, reversible scroll sequence.
- Smaller screens use a complete, naturally scrolling layout.
- Reduced-motion preferences use the natural layout and remove the text sheen.
- The navigation jumps to settled scroll states. A skip link, focus indicators, alt text and semantic headings are included.
- Inactive scenes and distant portfolio images are excluded from keyboard focus. The company dialog uses native modal focus handling and Escape to close.
- The four original team photographs stay unchanged. The original Atlas logo geometry is preserved, recolored to fit the palette.

## Sources and assets

Fund positioning, team names and roles, and portfolio context come from the public [Atlas website](https://www.atlasaivbfund.com/), [manifesto](https://www.atlasaivbfund.com/manifesto) and [portfolio](https://www.atlasaivbfund.com/portfolio). Company and manifesto links currently open those official pages.

The hero and thesis photographs are generated editorial imagery, rather than depictions of Atlas staff, offices or specific portfolio products. The rest of the company imagery and official logos are optimized local copies of Atlas’s public portfolio assets. Each company’s record in `src/data/companies/` includes its source URLs, country, status and verification date. Short sector descriptions are editorial summaries. The original team files are byte-for-byte copies of their public source assets.

Typography uses locally hosted Bodoni Moda and Instrument Sans. Their SIL Open Font License files are included in `public/assets/`.

See `docs/VERIFICATION.md` for the completed checks and their limits.
