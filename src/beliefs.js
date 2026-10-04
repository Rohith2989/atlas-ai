import './beliefs.css';

export const beliefsDuration = 28;
export const beliefsNames = ['thesis-people', 'thesis-risk', 'investment-pillars'];
export const beliefsStops = [6.5, 13.8, 23.5];
export const beliefsFrames = [1.5, 6.5, 10.3, 13.8, 18.4, 23.5];

const pillars = [
  { id: 'venture-builders', title: 'Venture Builders', body: 'We look for teams formed in ecosystems that test ideas early and support the work of launching a company. Shared experience helps founders navigate hiring, customers and growth.', alt: 'Editorial cutout of three builders discussing a prototype at a glass planning board.' },
  { id: 'technical-risk', title: 'Technical Risk', body: 'We accept demanding scientific and engineering challenges at the earliest stages when success can unlock major markets and a lasting competitive edge.', alt: 'Precision titanium optical positioning instrument with a lilac-coated objective.' },
  { id: 'defensible-ai', title: 'Defensible AI', body: 'We seek AI strengthened by proprietary data, research and embedded workflows: advantages that deepen with use and become difficult to reproduce.', alt: 'Layered photonic processor with quartz, gold circuitry and connected optical fibers.' },
  { id: 'outlier-founders', title: 'Outlier Founders', body: 'We back uncommon combinations of technical expertise, speed and long-range vision: people able to turn complexity into companies with exceptional potential.', alt: 'Illustrative portrait of a technical founder studying a physical prototype.' },
];
let section, composition, chapters, previousChapter = -1, observer, assetsRequested = false;
const all = selector => [...section.querySelectorAll(selector)];
const line = (name, text) => `<span class="belief-line belief-phrase" data-line="${name}">${text}</span>`;
const photo = (name, source) => `<span class="belief-photo" data-photo="${name}" aria-hidden="true"><img src="/assets/beliefs/scene-${source}.webp" alt="" width="1586" height="992" loading="lazy" decoding="async"></span>`;

function splitWords(element) {
  const text = element.textContent.trim();
  element.innerHTML = `<span class="sr-only">${text}</span><span class="belief-visual" aria-hidden="true">${text.split(/\s+/).map(word => `<span class="belief-mask"><span class="belief-word">${word}</span></span>`).join(' ')}</span>`;
}

export function mountBeliefs() {
  section = document.createElement('section');
  section.id = 'investment-thesis';
  section.className = 'scene beliefs-section';
  section.setAttribute('aria-label', 'Our investment thesis and strategic investment pillars');
  section.innerHTML = `<div class="beliefs-composition">
    <span class="belief-shared belief-phrase" aria-hidden="true">We</span>
    <article class="belief-chapter belief-people" id="thesis-people" aria-labelledby="belief-people-title">
      <h2 id="belief-people-title" class="belief-statement"><span class="belief-mobile-we">We </span>${line('meet','meet')}${photo('pair','people')}${line('teams','exceptional teams')}${line('beginning','at the very beginning.')}${line('builders','Through venture builders')}${photo('book','people')}${photo('walker','people')}${line('programs','and founder programs.')}</h2>
      <p class="belief-note belief-phrase">Where conviction starts becoming evidence.</p>
      <p class="belief-support belief-phrase">We invest at pre-seed and seed, worldwide. Ideas meet customers early,<br class="belief-desktop-break"> with experienced operators helping founders turn technical depth into a company.</p>
    </article>
    <article class="belief-chapter belief-risk" id="thesis-risk" aria-labelledby="belief-risk-title">
      <h2 id="belief-risk-title" class="belief-statement"><span class="belief-mobile-we">We </span>${line('take','take')}${photo('gripper','risk')}${line('risk','technical risk')}${line('complexity','where complexity creates')}${photo('lenses','risk')}${line('advantage','an advantage')}${photo('engineer','risk')}${line('worth','worth building.')}</h2>
      <p class="belief-note belief-phrase">The hard part should create the edge.</p>
      <p class="belief-support belief-phrase">We accept scientific and engineering uncertainty when solving it can open a major market.<br class="belief-desktop-break"> At pre-seed and seed, we look for difficult breakthroughs with the potential<br class="belief-desktop-break"> to create lasting value and exceptional outcomes.</p>
    </article>
    <section class="belief-chapter belief-pillars" id="investment-pillars" aria-labelledby="belief-pillars-title">
      <h2 id="belief-pillars-title" class="belief-phrase">Strategic investment pillars</h2>
      <p class="belief-note belief-phrase">Four beliefs. One approach.</p>
      <div class="belief-cards">${pillars.map((p,i) => `<article class="belief-card" data-pillar="${i}">
        <span class="belief-rule-v" aria-hidden="true"></span><span class="belief-rule-h" aria-hidden="true"></span>
        <img class="belief-card-image" src="/assets/beliefs/${p.id}.webp" alt="${p.alt}" width="1254" height="1254" loading="lazy" decoding="async">
        <h3 class="belief-phrase">${p.title}</h3><p class="belief-card-body">${p.body}</p>
      </article>`).join('')}</div>
    </section>
    <a class="belief-contact" href="#contact">Let’s build what comes next <span aria-hidden="true">↗</span></a>
  </div><p class="sr-only">Generated editorial illustrations. These people are not identified as Atlas team members or portfolio founders.</p>`;
  document.getElementById('artboard').append(section);
  composition = section.querySelector('.beliefs-composition');
  chapters = all('.belief-chapter');
  // Keep the complete semantic sentence; visual masks are separate from its accessible text.
  all('.belief-phrase').forEach(splitWords);
  section.querySelector('#belief-people-title').setAttribute('aria-label','We meet exceptional teams at the very beginning. Through venture builders and founder programs.');
  section.querySelector('#belief-risk-title').setAttribute('aria-label','We take technical risk where complexity creates an advantage worth building.');
}

function wrapParagraphs() {
  const measure = document.createElement('canvas').getContext('2d');
  all('.belief-card-body').forEach((paragraph,index) => {
    const style = getComputedStyle(paragraph);
    const tracking = parseFloat(style.letterSpacing) || 0;
    measure.font = `${style.fontSize} Instrument`;
    const width = paragraph.clientWidth;
    let line = ''; const lines = [];
    for (const word of pillars[index].body.split(' ')) {
      const test = line ? `${line} ${word}` : word;
      if (line && measure.measureText(test).width + tracking * (test.length-1) > width) { lines.push(line); line = word; }
      else line = test;
    }
    if (line) lines.push(line);
    paragraph.innerHTML = `<span class="sr-only">${pillars[index].body}</span><span aria-hidden="true">${lines.map(text => `<span class="belief-body-mask"><span>${text}</span></span>`).join('')}</span>`;
  });
}

export function resetBeliefs() {
  observer?.disconnect(); previousChapter = -1;
  section.inert = false; section.removeAttribute('aria-hidden');
  section.classList.remove('is-active'); section.removeAttribute('data-progress');
  section.querySelector('.belief-contact').inert = false;
  const desktop = document.documentElement.classList.contains('motion-ready');
  chapters.forEach((chapter,i) => {
    chapter.inert = false; chapter.removeAttribute('aria-hidden'); chapter.classList.remove('is-in-view');
    chapter.id = (desktop ? 'chapter-' : '') + beliefsNames[i];
  });
  all('.belief-card-body').forEach((p,i) => { p.textContent = pillars[i].body; });
  if (!desktop && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-in-view'); observer.unobserve(entry.target); }
    }), { threshold: .06 });
    chapters.forEach(chapter => observer.observe(chapter));
  }
}

export function appendBeliefs(tl, H, start) {
  const scale = Math.min(1600/1586, H/992);
  Object.assign(composition.style, { width:'1586px', height:'992px', left:(1600-1586*scale)/2+'px', top:(H-992*scale)/2+'px', transform:`scale(${scale})` });
  wrapParagraphs();
  const at = time => start + time;
  const words = selector => all(`${selector} .belief-word`);
  const reveal = (selector, time, duration=.86, stagger=.04) => tl.to(words(selector), {yPercent:0,opacity:1,duration,stagger,ease:'power3.out'},at(time));
  const retire = (selector, time, duration=.46) => tl.to(words(selector), {yPercent:-112,opacity:0,duration,stagger:.018,ease:'power2.in'},at(time));
  const imageIn = (name, time) => tl.to(all(`[data-photo="${name}"]`), {opacity:1,y:0,clipPath:'inset(0 0% 0 0)',duration:1.25,ease:'power2.inOut'},at(time));
  tl.set(section, {opacity:0},0);
  tl.set(all('.belief-word'),{yPercent:118,opacity:0},0);
  tl.set(all('.belief-photo'),{opacity:0,y:18,clipPath:'inset(0 100% 0 0)'},0);
  tl.set(all('.belief-rule-h'),{scaleX:0},0);
  tl.set(all('.belief-rule-v'),{scaleY:0},0);
  tl.set(all('.belief-card-image'),{opacity:0,y:24,clipPath:'inset(100% 0 0 0)'},0);
  tl.set(all('.belief-body-mask > span'),{yPercent:110,opacity:0},0);
  tl.set(all('.belief-contact'),{opacity:0,y:10},0);
  tl.to(section,{opacity:1,duration:.9,ease:'sine.inOut'},start);
  reveal('.belief-shared',.65);
  reveal('[data-line="meet"]',.8);
  imageIn('pair',.94);
  reveal('[data-line="teams"]',1.2,.95,.075);
  reveal('[data-line="beginning"]',1.5);
  reveal('[data-line="builders"]',2.0,.96);
  imageIn('book',2.1); imageIn('walker',2.5);
  reveal('[data-line="programs"]',2.7);
  reveal('.belief-people .belief-note',3.05,1.1,.035);
  reveal('.belief-people .belief-support',3.5,.8,.012);

  ['meet','teams','beginning','builders','programs'].forEach((name,i)=>retire(`[data-line="${name}"]`,9.1+i*.08));
  retire('.belief-people .belief-note',9.43); retire('.belief-people .belief-support',9.5);
  tl.to(all('[data-photo="pair"]'),{opacity:0,y:-18,duration:.65,ease:'power2.inOut'},at(9.23));
  tl.to(all('[data-photo="walker"]'),{opacity:0,x:-25,duration:.65,ease:'power2.inOut'},at(9.45));
  tl.to(all('[data-photo="book"]'),{x:-420,y:-410,scale:.74,opacity:.8,duration:.85,ease:'power2.inOut'},at(9.12));
  tl.to(all('[data-photo="book"]'),{x:-1250,y:-400,scale:.45,opacity:.27,duration:1.13,ease:'power3.out'},at(9.97));
  reveal('[data-line="take"]',9.7); imageIn('gripper',9.63);
  reveal('[data-line="risk"]',9.92); reveal('[data-line="complexity"]',10.1);
  imageIn('lenses',10.22); reveal('[data-line="advantage"]',10.35);
  imageIn('engineer',10.47); reveal('[data-line="worth"]',10.66);
  reveal('.belief-risk .belief-note',11.1); reveal('.belief-risk .belief-support',11.35,.8,.011);

  retire('.belief-risk',16.05,.6); retire('.belief-shared',16.14,.56);
  tl.to(all('[data-photo="book"]'),{opacity:0,x:-1290,duration:.6},at(16.05));
  tl.to(all('.belief-risk .belief-photo'),{opacity:0,y:-20,clipPath:'inset(0 0 100% 0)',duration:.8,stagger:.11,ease:'power2.inOut'},at(16));
  reveal('#belief-pillars-title',17,.9,.07);
  reveal('.belief-pillars .belief-note',17.4,.9,.025);
  pillars.forEach((p,i)=>{
    const selector = `[data-pillar="${i}"]`;
    const time = 17.15+i*.2;
    tl.to(all(`${selector} .belief-rule-h`),{scaleX:1,duration:.85,ease:'power3.out'},at(time));
    tl.to(all(`${selector} .belief-rule-v`),{scaleY:1,duration:1.05,ease:'power3.out'},at(time+.1));
    tl.to(all(`${selector} .belief-card-image`),{opacity:1,y:0,clipPath:'inset(0% 0 0 0)',duration:1.15,ease:'power2.inOut'},at(time+.23));
    reveal(`${selector} h3`,time+.73,.75,.03);
    tl.to(all(`${selector} .belief-body-mask > span`),{yPercent:0,opacity:1,duration:.7,stagger:.045,ease:'power3.out'},at(time+.95));
  });
  tl.to(all('.belief-contact'),{opacity:1,y:0,duration:.85,ease:'power3.out'},at(24.5));
  // Leave the complete final layout in place as the document unpins into Contact.
  tl.to({}, {duration:beliefsDuration},start);
  tl.addLabel('investment-thesis',at(6.5));
  beliefsNames.forEach((name,i)=>tl.addLabel(name,at(beliefsStops[i])));
  beliefsFrames.forEach((time,i)=>tl.addLabel(`thesis-frame-${i+1}`,at(time)));
}

export function syncBeliefs(time, start) {
  const local = time-start;
  // Decode the later card artwork while the preceding wafer scene is still visible.
  if (local > -6 && !assetsRequested) {
    assetsRequested = true;
    all('img').forEach(image => { image.loading = 'eager'; image.decode().catch(() => {}); });
  }
  const visible = local > .01;
  section.inert = !visible;
  section.setAttribute('aria-hidden',String(!visible));
  section.classList.toggle('is-active',visible);
  section.dataset.progress = Math.max(0,Math.min(1,local/beliefsDuration)).toFixed(4);
  const index = local < 9.6 ? 0 : local < 16.55 ? 1 : 2;
  section.querySelector('.belief-contact').inert = local < 24.5;
  if (index === previousChapter) return;
  previousChapter = index;
  chapters.forEach((chapter,i)=>{chapter.inert = i!==index; chapter.setAttribute('aria-hidden',String(i!==index));});
}
