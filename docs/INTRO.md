# Atlas — The lift

The approved logo motion study is implemented as native SVG and GSAP. No video,
new library, web service or generated logo is loaded. The original 39 foreground
paths and three letter-counter paths come from `public/assets/atlas-header.svg`.

The figure takes the weight, thirty globe dots follow a shallow orbit into their
original positions, and the exact Atlas SGR lettering resolves. One rising
boundary reveals the real hero and switches ivory to dark ink. The same vector
mark lands at the measured position and size of the actual header mask, then
hands over without a dissolve. Hero photographs and headline masks overlap the
handoff. The sequence uses the approved 1.7× website pace (approximately 3.5s).

## Loading behavior

- Plays on the first home-page visit per tab session. `?intro=replay#hero` replays
  for review without clearing browser storage.
- Direct chapter links and reduced-motion preferences bypass the entrance.
- Site fonts/layout and the three hero images prepare during the logo motion.
  Image decode can add at most 1.2s; a settled-logo hold waits for readiness.
- An independent inline watchdog releases the page after 8s even if the main
  bundle fails. With JavaScript disabled, the overlay is hidden by default.
- Skip intro and Escape release the page immediately. Focus returns to the
  header only if the visitor was using the intro control. Background content is
  inert during the entrance. All temporary transforms/masks/wrappers are removed.
- Resize, chapter navigation and a back-forward cache restore release the
  entrance. The site's existing scrolling sequence then owns all page motion.

The full-size six-second study remains outside the deployment. The live sequence
adapts its emblem size and header destination to desktop and mobile viewports.
