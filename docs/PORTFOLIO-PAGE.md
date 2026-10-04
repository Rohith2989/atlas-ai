# Portfolio page

`/portfolio/` is a separate Vite entry point, built to `dist/portfolio/index.html`. It uses the same Malachite, ivory, lilac, Instrument Sans, italic Bodoni, original Atlas logo and native thin scrollbar as the homepage. Companies navigation and the homepage's “Explore all 28 companies” link lead here.

The homepage keeps its approved six-company WebGL ribbon transition. The former all-company modal is replaced by this full portfolio page.

## Content

The 28 local company records are shared by both pages through `src/company-data.js`. Descriptions, industry, country, status, stage and venture-builder associations were checked against the public portfolio's embedded Wix collection on 4 October 2026: <https://www.atlasaivbfund.com/portfolio>. The source check is recorded in each JSON record. No invented stage or builder data. Claro's two builders are independently filterable; either selection includes it once.

Company images use the existing approved artwork and original portfolio covers. Each expanded entry links both to the company website from Atlas's collection and its original Atlas profile. These external links open new tabs and are labelled accordingly.

## Interaction

- A brief staggered fold introduces the three ribbon strips in the hero. The page scrolls naturally.
- Each row opens an ivory editorial spread. Two shaded green leaves hinge away from the artwork, while the description settles into place. Only one row opens at once; a second click or Escape folds it closed.
- The sticky desktop filter dock supports five facets, multi-select within each facet, and a keyword search. Counts reflect the other current selections. Checked zero-result options remain removable.
- Selected values appear as removable chips. Search supports `/`, filters close on outside click or Escape, and “Clear all” restores the entire portfolio.
- Query parameters preserve selections on reload, shared links, and browser back/forward. Unknown facet values are ignored. User search text is inserted through text nodes, not HTML.
- Filtering animates the movement of surviving rows, with a short reveal for new matches. No pinned company-by-company journey.
- On mobile the filter dock scrolls normally and company artwork sits above its description. Reduced-motion mode removes folds and position animations; all content and controls remain usable.

## Validation

`npm test` checks the actual company dataset, combined filters, builder membership, option counts, text search, empty/reset behavior, exited holdings and URL validation. `npm run build` emits both routes. Browser checks cover desktop and mobile layout, filter combinations, accordion behavior, keyboard dismissal, empty/reset state, history and direct route reloads.
