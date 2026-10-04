import './approach.css';
import { approachDuration, approachStops, approachNames, sampleApproach, clamp } from './approach-motion.js';
export { approachDuration, approachStops, approachNames };

const chapters = [
  { id:'founders', label:'Outlier founders', title:['See what','others don’t.'], body:['Technical depth.','The drive to make it real.'], image:'founder', alt:'Editorial portrait of a technical founder, with optical research and engineering sketches.' },
  { id:'engineering', label:'Technical risk', title:['Take the','difficult route.'], body:['We back hard engineering','with the potential to change a market.'], image:'engineering', alt:'A precision microgripper testing a silicon wafer, revealed through four unequal openings.' },
  { id:'defensible', label:'Defensible AI', title:['An edge that','gets stronger.'], body:['Unique data. Deep workflows.','Proprietary technology.'], image:'wafer', alt:'A hand holding a silicon wafer with a separate magnified view of its circuitry.' },
];
let section, stage, articles, fallback, nav, progressLine, count;
let active = -1, renderer, rendererModule, requested = false, generation = 0, current = -1;
let smallScreenObserver;
const failure = () => { if (stage) stage.dataset.renderer = 'fallback'; };

function prepare() {
  if (renderer || requested) return;
  requested = true;
  const version = generation;
  rendererModule ||= import('./approach-renderer.js');
  rendererModule.then(({createRevealRenderer}) => {
    if (version !== generation) return;
    return createRevealRenderer(stage, failure).then(instance => {
      if (version !== generation) { instance.dispose(); return; }
      renderer = instance;
      renderer.draw(sampleApproach(current));
      stage.dataset.renderer = 'webgl';
    });
  }).catch(failure);
}

const lines = (items, className) => items.map(line => '<span class="' + className + '"><span>' + line + '</span></span>').join('');

export function mountApproach() {
  section = document.createElement('section');
  section.id = 'approach';
  section.className = 'scene approach-section';
  section.setAttribute('aria-label', 'Our investment approach');
  section.innerHTML = `
    <div class="approach-stage" aria-hidden="true">
      <div class="approach-fallback">
        ${chapters.map((c,i) => '<img data-approach-poster="' + i + '" src="/assets/approach/' + c.image + '.webp" width="1586" height="992" alt="" loading="lazy" decoding="async">').join('')}
      </div>
    </div>
    <div class="approach-composition">
      ${chapters.map((c,i) => `<article class="approach-chapter" id="pillar-${c.id}" data-approach-chapter="${i}">
        <figure class="approach-mobile-art"><img src="/assets/approach/${c.image}.webp" alt="${c.alt}" width="1586" height="992" loading="lazy" decoding="async"></figure>
        <div class="approach-copy">
          <p class="approach-label"><span>${c.label}</span></p>
          <h2>${lines(c.title,'approach-line')}</h2>
          <p class="approach-body">${lines(c.body,'approach-body-line')}</p>
        </div>
      </article>`).join('')}
    </div>
    <nav class="approach-navigation" aria-label="Investment approach chapters">
      <span class="approach-nav-label">Our investment approach</span>
      <div class="approach-track"><i aria-hidden="true"></i>${chapters.map((c,i) => `<a href="#approach-${c.id}" data-approach-stop="${i}" aria-label="${c.label}"><span>${String(i+1).padStart(2,'0')}</span></a>`).join('')}</div>
      <span class="approach-count" aria-hidden="true">01 / 03</span>
    </nav>
    <p class="sr-only">Editorial illustrations. The person pictured is not identified as an Atlas team member or portfolio founder.</p>`;
  document.getElementById('artboard').append(section);
  stage = section.querySelector('.approach-stage');
  articles = [...section.querySelectorAll('[data-approach-chapter]')];
  fallback = [...section.querySelectorAll('[data-approach-poster]')];
  nav = [...section.querySelectorAll('[data-approach-stop]')];
  progressLine = section.querySelector('.approach-track i');
  count = section.querySelector('.approach-count');
}

export function appendApproach(tl, H, start) {
  const time = fraction => start + fraction * approachDuration;
  const composition = section.querySelector('.approach-composition');
  const height = Math.min(H, 1600 * 992 / 1586);
  const width = height * 1586 / 992;
  Object.assign(composition.style,{width:width+'px',height:height+'px',left:(1600-width)/2+'px',top:(H-height)/2+'px'});
  tl.set(section, {opacity:0}, 0);
  tl.set('.approach-label > span,.approach-line > span,.approach-body-line > span', {yPercent:112}, 0);
  tl.set('.approach-navigation', {opacity:0, y:12}, 0);
  // The photo starts in a void while 8x completes its diagonal exit above it.
  tl.to(section, {opacity:1,duration:.35,ease:'none'}, start+.35);
  tl.to('.approach-navigation', {opacity:1,y:0,duration:.45,ease:'power2.out'}, time(.07));

  const caption = (index, at, out) => {
    const article = articles[index];
    const label = article.querySelector('.approach-label > span');
    const title = article.querySelectorAll('.approach-line > span');
    const body = article.querySelectorAll('.approach-body-line > span');
    tl.to(label, {yPercent:0,duration:.38,ease:'power2.out'}, time(at));
    if (index === 1) {
      tl.to(title[0], {yPercent:0,duration:.48,ease:'power3.out'}, time(.367));
      tl.to(title[1], {yPercent:0,duration:.68,ease:'power3.out'}, time(.416));
      tl.to(body, {yPercent:0,duration:.58,stagger:.08,ease:'power2.out'}, time(.459));
    } else {
      tl.to(title, {yPercent:0,duration:.78,stagger:.15,ease:'power3.out'}, time(index===2?.793:at+.025));
      tl.to(body, {yPercent:0,duration:.58,stagger:.08,ease:'power2.out'}, time(index===2?.844:at+.073));
    }
    if (out !== undefined) tl.to([label,...title,...body], {yPercent:-115,duration:.47,stagger:.028,ease:'power2.in'},time(out));
  };
  caption(0,.073,.30);
  caption(1,.356,.646);
  caption(2,.706);
  approachNames.forEach((name,index) => tl.addLabel('approach-'+name,start+approachStops[index]));
  // Bookmarked poses map to the six approved storyboard moments.
  [.08,.24,.40,.57,.74,.90].forEach((p,index) => tl.addLabel('approach-frame-'+(index+1),time(p)));
  tl.addLabel('approach',time(.08));
  tl.to({}, {duration:approachDuration}, start);
  return {start,end:start+approachDuration};
}

export function syncApproach(time, start) {
  if (!section || !document.documentElement.classList.contains('motion-ready')) return;
  current = (time-start) / approachDuration;
  if (current >= -.7) prepare();
  const visible = current >= .002 && current < 1 + .95 / approachDuration;
  section.inert = !visible;
  section.setAttribute('aria-hidden',String(!visible));
  section.classList.toggle('is-active',visible);
  const state = sampleApproach(current);
  renderer?.draw(state);
  section.dataset.progress = clamp(current).toFixed(4);
  // A real image remains available during decoding and on WebGL context loss.
  fallback.forEach((image,index) => {
    image.style.opacity = index === state.chapter ? '1' : '0';
    const amount = index === 0 ? state.portrait : index === 1 ? Math.min(...state.engineering) : state.wafer;
    image.style.clipPath = 'inset(0 0 0 '+(1-amount)*100+'%)';
  });
  progressLine.style.transform = 'scaleX('+clamp(current)+')';
  if (state.chapter === active) return;
  active = state.chapter;
  section.dataset.chapter = chapters[active].id;
  count.textContent = '0'+(active+1)+' / 03';
  articles.forEach((article,index) => {
    article.inert = index !== active;
    article.setAttribute('aria-hidden',String(index !== active));
  });
  nav.forEach((link,index) => {
    if (index === active) link.setAttribute('aria-current','step');
    else link.removeAttribute('aria-current');
  });
}

export function resetApproach() {
  generation++;
  requested=false; current=-1; active=-1;
  renderer?.dispose(); renderer=undefined;
  smallScreenObserver?.disconnect();
  if (!section) return;
  stage.dataset.renderer='fallback';
  section.inert=false;
  section.removeAttribute('aria-hidden');
  section.classList.remove('is-active');
  section.removeAttribute('data-chapter');
  section.removeAttribute('data-progress');
  const desktop = document.documentElement.classList.contains('motion-ready');
  articles.forEach((article,index) => {
    article.inert=false; article.removeAttribute('aria-hidden'); article.classList.remove('is-in-view');
    // Desktop chapter hashes belong to the scroll timeline; native anchors would scroll a pinned ancestor.
    article.id=(desktop?'pillar-':'approach-')+chapters[index].id;
  });
  nav.forEach(link=>link.removeAttribute('aria-current'));
  if (!document.documentElement.classList.contains('motion-ready') && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    smallScreenObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {if(entry.isIntersecting){entry.target.classList.add('is-in-view');smallScreenObserver.unobserve(entry.target)}});
    }, {threshold:.12});
    articles.forEach(article => smallScreenObserver.observe(article));
  }
}
