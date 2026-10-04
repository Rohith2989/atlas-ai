import gsap from 'gsap';
import './proof.css';

// One continuous, authored contour field. No video, frame sequence or canvas text.
export function mountProof() {
  const svg = document.getElementById('proof-field');
  const NS = 'http://www.w3.org/2000/svg';
  const groups = [...svg.querySelectorAll('.contour-layer')];
  groups.forEach((g, layer) => {
    for(let row=0; row<29; row++) {
      const path = document.createElementNS(NS,'path');
      const points=[];
      for(let x=-90;x<=1190;x+=12) {
        const distance=(x-590)/390;
        const elevation=Math.exp(-distance*distance)*Math.sin(distance*2.3+row*.055+layer*.36)*185;
        const ripple=Math.sin(x*.014+row*.13)*18*Math.exp(-distance*distance*.6);
        const yy=90+layer*245+row*8.4+elevation+ripple;
        points.push(`${x},${yy.toFixed(2)}`);
      }
      path.setAttribute('d','M'+points.join(' L'));
      path.setAttribute('vector-effect','non-scaling-stroke');
      g.appendChild(path);
    }
  });
}

export function animateProof(tl, H, start) {
  tl.set('#proof', {opacity:1},start);
  tl.fromTo('#proof-field', {x:420,y:H*.24,scale:1.12,opacity:0}, {x:0,y:0,scale:1,opacity:1,duration:2.6,ease:'power3.out'},start);
  tl.fromTo('.proof-heading,.proof-intro', {y:22,opacity:0}, {y:0,opacity:1,duration:1.1,stagger:.2,ease:'power3.out'},start+.8);
  tl.fromTo('.proof-tabs,.proof-footer', {opacity:0}, {opacity:1,duration:1.1,stagger:.2},start+1.7);
  tl.fromTo('.contour-layer', {x:190,opacity:0}, {x:0,opacity:1,duration:2.4,stagger:.35,ease:'power3.out'},start+.4);
  tl.fromTo('.field-label', {opacity:0,x:25}, {opacity:1,x:0,duration:1.2,stagger:.6},start+1.8);
  const panels=[...document.querySelectorAll('.proof-panel')];
  panels.forEach((p,i)=>{
    const at=start+2.2+i*3.5;
    tl.fromTo(p,{opacity:0},{opacity:1,duration:.1},at);
    tl.fromTo(p.querySelectorAll('.proof-line span'),{yPercent:110},{yPercent:0,duration:1.15,stagger:.12,ease:'power4.out'},at);
    if(i<2) {
      tl.to(p.querySelectorAll('.proof-line span'),{yPercent:-110,duration:.65,stagger:.05,ease:'power3.in'},at+2.5);
      tl.to(p,{opacity:0,duration:.1},at+3.1);
    }
    tl.to(`.contour-layer-${i}`,{x:-55-i*25,y:-20-i*14,duration:2.8,ease:'sine.inOut'},at);
    tl.fromTo(`.field-label-${i} i`,{scaleX:0},{scaleX:1,duration:1.4,ease:'power2.inOut'},at);
  });
  tl.to('#field-seam',{attr:{x:20},duration:9.8,ease:'none'},start+2);
  tl.to('#proof-field',{rotation:-4,duration:11,ease:'sine.inOut',transformOrigin:'55% 50%'},start+2);
  tl.to({}, {duration:1.5},start+12);
  tl.addLabel('proof',start+3.9).addLabel('proof-data',start+3.9).addLabel('proof-distribution',start+7.4).addLabel('proof-technology',start+10.9);
}

export function updateProof(time, start) {
  const index=Math.max(0,Math.min(2,Math.floor((time-start-2.2)/3.5)));
  document.querySelectorAll('.proof-tabs a').forEach((a,i)=>{
    a.classList.toggle('is-selected',i===index);
    if(i===index) a.setAttribute('aria-current','true'); else a.removeAttribute('aria-current');
  });
  document.querySelectorAll('.proof-panel').forEach((p,i)=>p.inert=i!==index);
}
