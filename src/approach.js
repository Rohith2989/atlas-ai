import './approach.css';

export const approachDuration = 23.6;
export const approachStops = [3.45, 6.5, 9.3, 13.8, 18.3, 22.5];
const chapters = [
  { id:'together', label:'01 / Venture builders', title:'Built in good company.', body:'Founders. Operators. Real customers.<br>Progress tested together.', side:'left' },
  { id:'begin', label:'Our investment approach', title:'A place to begin.', body:'', side:'left' },
  { id:'founder', label:'02 / Outlier founders', title:'The person before the pitch.', body:'Technical depth. Fast execution.<br>A reason to keep building.', side:'left' },
  { id:'explore', label:'03 / Technical risk', title:'Hard problems.<br>Room to explore.', body:'We back difficult engineering<br>when the opportunity is bigger.', side:'right' },
  { id:'compound', label:'04 / Defensible AI', title:'What gets stronger with use?', body:'Unique data.<br>Deep workflows.<br>Proprietary technology.', side:'left' },
  { id:'build', label:'The Atlas approach', title:'Build something difficult.', body:'<a href="https://www.atlasaivbfund.com/manifesto" target="_blank" rel="noopener noreferrer">Read our manifesto <span aria-hidden="true">↗</span></a>', side:'left' },
];
let active = -1;

export function mountApproach() {
  const section = document.createElement('section');
  section.id = 'approach';
  section.className = 'scene working-section';
  section.setAttribute('aria-label', 'Our investment approach');
  section.innerHTML = `<div class="working-stage" aria-hidden="true"><div class="working-roll"><div class="working-camera"><div class="working-reveal"><img class="working-world" src="/assets/working-table-world.webp" width="1672" height="941" alt="" decoding="async" fetchpriority="low"></div></div></div></div>
    <div class="working-captions">${chapters.map((c,i)=>`<article class="working-copy working-copy--${c.side}" data-working-copy="${i}" id="approach-${c.id}"><p class="working-label">${c.label}</p><h2><span class="working-line"><span>${c.title.replace('<br>','</span></span><span class="working-line"><span>')}</span></span></h2>${c.body?`<p class="working-body">${c.body}</p>`:''}</article>`).join('')}</div>
    <nav class="working-navigation" aria-label="Investment approach chapters">${chapters.map((c,i)=>`<button type="button" data-working-stop="${i}" aria-label="${c.title.replace('<br>',' ')}"><span>${String(i+1).padStart(2,'0')}</span><i aria-hidden="true"></i></button>`).join('')}<span class="working-nav-title">Our investment approach</span></nav>
    <p class="working-photo-note sr-only">Editorial illustration of builders at work. The people shown are not identified as Atlas team members or portfolio founders.</p>`;
  document.getElementById('artboard').append(section);
}

// Every shot refers to the same fixed world coordinates. Only this camera moves.
// Captions live outside the camera, so reading never competes with a moving lens.
export function appendApproach(tl, H, start) {
  const imageHeight = 900;
  const fit = Math.min(1, H / 850);
  const pose = (zoom, focusX, focusY, screenX, screenY) => {
    const scale = zoom * fit;
    return { scale, x:1600*screenX - 1600*focusX*scale, y:H*screenY - imageHeight*focusY*scale };
  };
  const wide = pose(1.02, .5, .54, .62, .66);
  const begin = pose(1.38, .30, .44, .75, .60);
  const founder = pose(2.05, .30, .40, .76, .57);
  const travel = pose(1.04, .52, .51, .56, .64);
  const engineer = pose(1.94, .79, .35, .35, .57);
  const evidence = pose(2.22, .63, .70, .74, .63);
  const resolved = pose(.94, .5, .51, .59, .67);
  const camera = '.working-camera';
  const reveal = '.working-reveal';
  tl.set('#approach',{opacity:0},0);
  tl.set(camera,{...wide,x:wide.x+130,y:wide.y+65,transformOrigin:'0 0'},0);
  tl.set('.working-roll',{rotation:0,transformOrigin:`800px ${H*.55}px`},0);
  tl.set(reveal,{clipPath:'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)'},0);
  tl.set('.working-copy',{opacity:0},0);
  tl.set('.working-line > span',{yPercent:105},0);
  tl.set('.working-label,.working-body',{opacity:0,y:8},0);
  tl.set('.working-navigation',{opacity:0,y:12},0);

  // 01. Establish: the diagonal edge opens, then the people resolve above it.
  tl.to('#approach',{opacity:1,duration:.35},start+.2);
  tl.to(camera,{...wide,duration:2.7,ease:'power2.inOut'},start+.25);
  tl.to(reveal,{clipPath:'polygon(0% 100%, 100% 100%, 100% 39%, 0% 79%)',duration:1.3,ease:'power2.inOut'},start+.4);
  tl.to(reveal,{clipPath:'polygon(0% 100%, 100% 100%, 100% -4%, 0% -4%)',duration:1.65,ease:'power2.inOut'},start+1.4);
  tl.to('.working-navigation',{opacity:1,y:0,duration:.6},start+2.9);

  const caption = (index, at, out) => {
    const selector = `[data-working-copy="${index}"]`;
    tl.to(selector,{opacity:1,duration:.12},start+at);
    tl.to(`${selector} .working-label`,{opacity:1,y:0,duration:.42,ease:'power2.out'},start+at);
    tl.to(`${selector} .working-line > span`,{yPercent:0,duration:.65,stagger:.07,ease:'power3.out'},start+at+.1);
    tl.to(`${selector} .working-body`,{opacity:1,y:0,duration:.5,ease:'power2.out'},start+at+.34);
    if(out) tl.to(selector,{opacity:0,duration:.35,ease:'power1.in'},start+out);
  };
  caption(0,3.03,4.05);

  // 02. Find the founder: a restrained lateral move into a medium view.
  tl.to(camera,{...begin,duration:1.9,ease:'power2.inOut'},start+4.15);
  caption(1,6.12,6.95);

  // 03. Push in: no new photograph, no cut, and no perspective stretch.
  tl.to(camera,{...founder,duration:1.7,ease:'sine.inOut'},start+7.05);
  caption(2,8.82,10.25);

  // 04. Pull back before trucking to the engineer. The wide view is a bridge.
  tl.to(camera,{...travel,duration:1.25,ease:'power2.inOut'},start+10.35);
  tl.to(camera,{...engineer,duration:1.6,ease:'power2.inOut'},start+11.6);
  caption(3,13.28,14.55);

  // 05. Return to the shared table, then push toward the working evidence.
  tl.to(camera,{...travel,duration:1.2,ease:'power2.inOut'},start+14.65);
  tl.to(camera,{...evidence,duration:1.85,ease:'power2.inOut'},start+15.85);
  tl.to('.working-roll',{rotation:-3.2,duration:1.85,ease:'sine.inOut'},start+15.85);
  caption(4,17.8,19.25);

  // 06. Resolve: restore the full scene and the horizon before releasing the pin.
  tl.to(camera,{...resolved,duration:2.4,ease:'power2.inOut'},start+19.35);
  tl.to('.working-roll',{rotation:0,duration:2.4,ease:'sine.inOut'},start+19.35);
  caption(5,21.85);
  tl.to({}, {duration:1.75},start+21.85);
  approachStops.forEach((at,i)=>tl.addLabel(`approach-${chapters[i].id}`,start+at));
  tl.addLabel('approach',start+approachStops[0]);
  return {start,end:start+approachDuration};
}

export function syncApproach(time, start) {
  const section = document.getElementById('approach');
  const local = time-start;
  const visible = local>=.2;
  section.inert=!visible;
  section.classList.toggle('is-active',visible);
  let next=0;
  [6.12,8.82,13.28,17.8,21.85].forEach((at,i)=>{if(local>=at)next=i+1});
  if(next===active)return;
  active=next;
  section.dataset.chapter=chapters[next].id;
  section.querySelectorAll('[data-working-copy]').forEach((copy,i)=>{copy.inert=i!==next;copy.setAttribute('aria-hidden',String(i!==next))});
  section.querySelectorAll('[data-working-stop]').forEach((b,i)=>{if(i===next)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current')});
}

export function resetApproach() {
  active=-1;
  const section=document.getElementById('approach');
  section.inert=false;
  section.classList.remove('is-active');
  section.removeAttribute('data-chapter');
  section.querySelectorAll('[data-working-copy]').forEach(copy=>{copy.inert=false;copy.removeAttribute('aria-hidden')});
}
