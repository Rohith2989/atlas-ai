import gsap from 'gsap';
import mark from './intro-mark.svg?raw';
import './intro.css';

// The approved motion study, at its 1.7× website pace. All 39 visible paths
// and the three letter counters are the original Atlas SVG geometry.
export function mountIntro() {
  const boot = window.__atlasIntro;
  const overlay = document.getElementById('atlas-intro');
  if (!boot?.active) {
    overlay.remove();
    return { ready() {}, cancel() {} };
  }

  overlay.insertAdjacentHTML('afterbegin', mark);
  const svg = overlay.querySelector('svg');
  const select = gsap.utils.selector(overlay);
  const width = innerWidth;
  const height = innerHeight;
  // Fixed elements can inherit the root's reserved scrollbar gutter. Explicit
  // viewport pixels keep the SVG edge-to-edge and its header coordinates 1:1.
  overlay.style.width = `${width}px`;
  overlay.style.height = `${height}px`;
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  ['#intro-field', '#intro-field-clip', '#intro-paper-clip'].forEach(selector => {
    const el = select(selector)[0];
    el.setAttribute('width', width);
    el.setAttribute('height', height);
  });
  const layers = select('#intro-ivory, #intro-ink');
  const human = select('#intro-atlas-human');
  const paper = select('#intro-paper-clip');
  const field = select('#intro-field, #intro-field-clip');
  const emblemScale = Math.min(width * .24 / 305, height * .36 / 454, .85);
  const lockupScale = Math.min(width * .65 / 1676, height * .28 / 454, .64);
  const center = scale => ({ x: (width - 1676 * scale) / 2, y: (height - 454 * scale) / 2 });
  let handoffReady = false;
  let closed = false;
  let introContext;
  const wrappers = [];
  const initialFocus = document.activeElement;
  document.querySelectorAll('.header, #story, .site-footer, .skip').forEach(el => {
    if (!el.inert) { el.inert = true; el.setAttribute('data-intro-inert', ''); }
  });
  const onEscape = event => { if (event.key === 'Escape') boot.release(); };
  const onResize = () => boot.release();
  const onHash = () => boot.release();
  document.addEventListener('keydown', onEscape);
  window.addEventListener('resize', onResize, { once: true });
  window.addEventListener('hashchange', onHash, { once: true });

  const cleanup = () => {
    if (closed) return;
    closed = true;
    const wasFocused = overlay.contains(document.activeElement);
    introContext?.revert();
    tl.kill();
    wrappers.forEach(wrapper => wrapper.replaceWith(...wrapper.childNodes));
    overlay.remove();
    document.removeEventListener('keydown', onEscape);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('hashchange', onHash);
    document.removeEventListener('atlas:intro-end', cleanup);
    if (wasFocused) {
      const target = initialFocus && initialFocus !== document.body ? initialFocus : document.querySelector('.brand');
      target?.focus({ preventScroll: true });
    }
  };
  document.addEventListener('atlas:intro-end', cleanup);
  const tl = gsap.timeline({ paused: true, onComplete: () => boot.release() });
  tl.timeScale(1.7);
  tl.set(overlay, { attr: { 'data-phase': 'lift' } }, 0);
  tl.set(layers, { x: (width - 305 * emblemScale) / 2, y: (height - 454 * emblemScale) / 2, scale: emblemScale, svgOrigin: '0 0' }, 0);
  tl.set(paper, { y: height }, 0);
  tl.set(select('#intro-wordmark-reveal'), { scaleX: 0, svgOrigin: '325 0' }, 0);
  tl.fromTo(human, { opacity: 0, y: 16, rotation: -3.5, svgOrigin: '113 391' },
    { opacity: 1, y: 7, rotation: 1.65, duration: .72, ease: 'power3.out' }, .18);
  tl.to(human, { y: -2, rotation: -.7, duration: .86, ease: 'sine.inOut' }, .9);
  tl.to(human, { y: 0, rotation: 0, duration: .38, ease: 'power2.out' }, 1.76);
  const dots = select('.intro-dot').map(el => {
    const b = el.getBBox();
    return { el, x: b.x + b.width / 2, y: b.y + b.height / 2 };
  }).sort((a, b) => (a.y * .7 - a.x * .3) - (b.y * .7 - b.x * .3));
  dots.forEach(({ el, x, y }, i) => {
    const dx = x - 205, dy = y - 129;
    const c = Math.cos(-.26), s = Math.sin(-.26);
    const mc = Math.cos(-.16), ms = Math.sin(-.16);
    const start = .31 + i * .012;
    tl.fromTo(el, {
      x: (dx * c - dy * s) * .74 + 212 - x,
      y: (dx * s + dy * c) * .25 + 202 - y,
      opacity: 0, scale: .72, svgOrigin: `${x} ${y}`,
    }, {
      x: (dx * mc - dy * ms) * 1.035 + 209 - x,
      y: (dx * ms + dy * mc) * 1.035 + 121 - y,
      opacity: 1, scale: 1, duration: .94, ease: 'power1.out',
    }, start);
    tl.to(el, { x: 0, y: 0, duration: .58, ease: 'sine.out' }, start + .94);
  });
  tl.to(layers, { ...center(lockupScale), scale: lockupScale, duration: 1.05, ease: 'power3.inOut' }, 2.02);
  tl.to(select('#intro-wordmark-reveal'), { scaleX: 1, duration: .84, ease: 'power4.out' }, 2.25);
  tl.set(overlay, { attr: { 'data-phase': 'resolve' } }, 2.9);
  // Fonts, layout and the visible hero images load while the globe is lifting.
  // If needed, hold the resolved logo here; the pre-paint watchdog still caps it.
  tl.addPause(3.55, () => { if (handoffReady) tl.play(); });
  tl.to({}, { duration: 2.33 }, 3.55);
  overlay.classList.add('is-animated');
  tl.play(0);

  return {
    cancel: () => boot.release(),
    async ready() {
      const images = [...document.querySelectorAll('#architecture img, #optics img, #biology img')];
      let decodeTimeout;
      await Promise.race([
        Promise.allSettled(images.map(img => img.decode())),
        new Promise(resolve => { decodeTimeout = setTimeout(resolve, 1200); }),
      ]);
      clearTimeout(decodeTimeout);
      if (closed || !boot.active) return;
      // Measure the actual mask after responsive layout and ScrollTrigger setup.
      const box = document.querySelector('.atlas-lockup').getBoundingClientRect();
      const scale = Math.min(box.width / 1676, box.height / 454);
      const target = { x: box.left + (box.width - 1676 * scale) / 2, y: box.top + (box.height - 454 * scale) / 2, scale };
      introContext = gsap.context(() => {
        document.querySelectorAll('#hero .type-move').forEach(line => {
          const wrapper = document.createElement('span');
          wrapper.className = 'intro-line';
          line.before(wrapper);
          wrapper.append(line);
          wrappers.push(wrapper);
        });
        // A single moving edge swaps ivory/ink at precisely the curtain boundary.
        tl.to(field, { scaleY: 0, svgOrigin: '0 0', duration: .94, ease: 'power3.inOut' }, 3.73);
        tl.to(paper, { y: 0, duration: .94, ease: 'power3.inOut' }, 3.73);
        tl.set(overlay, { attr: { 'data-phase': 'unveil' } }, 4.06);
        tl.to(layers, { ...target, duration: 1.02, ease: 'expo.inOut' }, 4.32);
        tl.to(select('.intro-skip'), { opacity: 0, duration: .18 }, 3.65);
        tl.fromTo(images, { scale: 1.06, y: 24, clipPath: 'inset(0 0 100% 0)' },
          { scale: 1, y: 0, clipPath: 'inset(0%)', duration: 1.05, stagger: .1, ease: 'power3.out' }, 4.22);
        tl.fromTo(wrappers, { yPercent: 102 }, { yPercent: 0, duration: .85, stagger: .13, ease: 'power3.out' }, 4.63);
        tl.fromTo('.header .brand-rule, .header .fund, .header nav', { opacity: 0, y: 5 },
          { opacity: 1, y: 0, duration: .42, stagger: .06, ease: 'power2.out' }, 5.02);
        tl.fromTo('#explore', { opacity: 0 }, { opacity: 1, duration: .3 }, 5.42);
        tl.set(overlay, { attr: { 'data-phase': 'land' } }, 5.36);
        tl.to({}, { duration: .18 }, 5.7);
      });
      handoffReady = true;
      if (tl.paused() && tl.time() >= 3.55) tl.play();
    },
  };
}
