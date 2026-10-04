import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { foldDesigns,rotatePoint,facetProgress,facetTransform,fitFold } from './portfolio-folds.js';

const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} differs from ${b}`);

test('photographic facets share an exact edge with their stationary image',()=>{
  for(const design of Object.values(foldDesigns).filter(d=>!d.mask && !d.mark)) {
    const same=(a,b)=>a.every((n,i)=>n===b[i]);
    for(const face of design.panels) {
      assert.ok(design.core.some((a,i)=>{
        const b=design.core[(i+1)%design.core.length];
        return (same(a,face.a)&&same(b,face.b)) || (same(a,face.b)&&same(b,face.a));
      }),'A fold must hinge on the core boundary, never float beside it.');
    }
  }
});

test('every triangular hinge stays attached for the entire fold',()=>{
  for(const design of Object.values(foldDesigns)) for(const face of design.panels) {
    for(let step=0;step<=24;step++) {
      const angle=step/24*Math.PI*face.direction;
      for(const anchor of [face.a,face.b]) {
        const point=rotatePoint(anchor,face.a,face.b,angle,design.aspect);
        near(point[0],anchor[0]); near(point[1],anchor[1]); near(point[2],0);
      }
      const point=rotatePoint(face.tip,face.a,face.b,angle,design.aspect);
      const initial=Math.hypot((face.tip[0]-face.a[0])*design.aspect,face.tip[1]-face.a[1]);
      const rotated=Math.hypot((point[0]-face.a[0])*design.aspect,point[1]-face.a[1],point[2]);
      near(initial,rotated);
    }
  }
});

test('facet timing waits its turn, travels monotonically, and settles at 180 degrees',()=>{
  for(const design of Object.values(foldDesigns)) for(const face of design.panels) {
    near(facetProgress(face.delay,face.delay),0);
    near(facetProgress(1,face.delay),1);
    near(facetTransform(face,0,600,400).degrees,0);
    near(Math.abs(facetTransform(face,1,600,400).degrees),180);
    let last=0;
    for(let step=0;step<=100;step++) {
      const p=facetProgress(step/100,face.delay);
      assert.ok(p>=last && p<=1); last=p;
    }
  }
});

test('phone and desktop layouts contain every authored fold through its full trajectory',()=>{
  for(const design of Object.values(foldDesigns)) for(const [w,h] of [[160,158],[470,290],[325,245]]) {
    const fit=fitFold(design,w,h);
    for(const face of design.panels) for(let step=0;step<=48;step++) {
      const p=rotatePoint(face.tip,face.a,face.b,step/48*Math.PI,design.aspect);
      const x=fit.left+p[0]*fit.width,y=fit.top+p[1]*fit.height;
      assert.ok(x>=0 && x<=w && y>=0 && y<=h,`Fold exceeded ${w}×${h}: ${x},${y}`);
    }
  }
});

test('the independent 8x mark preserves the original logo path exactly',()=>{
  const original=readFileSync(new URL('../public/portfolio/8x-brand-v3.svg',import.meta.url),'utf8');
  const folded=readFileSync(new URL('../public/portfolio/folds/8x-mark.svg',import.meta.url),'utf8');
  const path=s=>s.match(/<g id="mark"[\s\S]*?<\/g>/)[0];
  assert.equal(path(original),path(folded));
  assert.ok(!folded.includes('<animate'));
});
