# Investment thesis and strategic pillars

The approved two text-and-cutout compositions and four new pillar illustrations now run inside the website's existing GSAP/ScrollTrigger timeline. There is one scroll clock, no video and no separate nested scroll area. The original approach section ends on the wafer; the new section follows it on the same Malachite background and then releases into the existing Contact footer.

## Choreography

The local sequence lasts 28 timeline units (about 778vh in the site's existing scroll mapping). Local units are a position on the scroll, not an autoplay requirement.

| Local position | Behaviour |
| --- | --- |
| 0–4.5 | Wafer composition clears; words rise in individual masks while the pair, notebook and walking founder resolve into the sentence. |
| 4.5–9.1 | Complete first statement stays still for reading. |
| 9.1–12.2 | “We” stays anchored. Old phrases leave their masks, new phrases enter, and the notebook crosses the upper margin as the precision tool arrives. The section label waits until the notebook clears its position. |
| 12.2–16.05 | Complete technical-risk statement stays still. |
| 16.05–20.5 | The sentence clears. Open upright card rules draw, followed by four cutouts, titles and paragraph lines. |
| 20.5–28 | All four pillars remain visible together. A Contact link resolves late in the reading hold. |

Every reveal reverses with scroll, including the shared notebook's two-part path. The header gains an opaque Malachite backing before unpinning so scrolling text cannot collide with the logo and navigation. The viewport also retains the field colour during the unpin to avoid subpixel seams.

## Review links

- `/#investment-thesis`: first complete statement; also reached through Manifesto.
- `/#thesis-people`, `/#thesis-risk`, `/#investment-pillars`: the three reading holds.
- `/#thesis-frame-1` through `/#thesis-frame-6`: the six preview positions.
- `/#approach-defensible`: the preceding wafer composition, to review the entry by scrolling onward.

The small chapter navigation goes directly to a settled state. On mobile, each alias maps to the corresponding real article instead of manipulating a pin. Contact deep links restore after pin spacing is calculated.

## Layout and accessibility

The desktop composition retains its approved 1586 × 992 coordinates, fitting within the existing artboard while preserving proportions. Paragraphs are wrapped using the loaded font, measured available width and letter spacing; masks are rebuilt on responsive layout changes.

Below 900px, or with the operating system's reduced-motion preference, all three articles use natural document flow. Phone pillar cards stack into a single column. Text remains semantic HTML; visual word masks are hidden from assistive technology alongside a complete readable string. Inactive chapters are hidden from the accessibility tree and their links are inert. Reduced motion also omits the mobile entrance translations.

## Assets

Six local alpha-preserving WebP files total 1,107,252 bytes. The four new images represent Venture Builders, Technical Risk, Defensible AI and Outlier Founders. Two transparent source compositions supply the smaller inline photos using CSS crops; their source pixels remain intact. The images are editorial illustrations, not photos of actual Atlas personnel or specific products.

The browser requests and decodes the complete set while the preceding approach scene is still active. Main type is the site's existing Instrument Sans; annotations use a genuine Bodoni Moda 400 italic, covered by `public/assets/Bodoni-OFL.txt`. Prompts and provenance are in `beliefs-artwork-prompts.json` and `beliefs-font-source.css`.

The Get in Touch form is a subsequent section-design task; this change joins the existing contact footer.
