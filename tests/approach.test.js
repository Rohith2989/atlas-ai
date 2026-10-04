import test from 'node:test';
import assert from 'node:assert/strict';
import { approachDuration, approachStops, sampleApproach } from '../src/approach-motion.js';

test('the three approved reading holds have fully resolved artwork', () => {
  for (const p of [.21,.24,.28]) {
    const s=sampleApproach(p);
    assert.equal(s.chapter,0);
    assert.equal(s.portrait,1); assert.equal(s.diffraction,1); assert.equal(s.drawing,1);
    assert.deepEqual(s.portraitExit,[0,0,0,0]);
    assert.deepEqual(s.engineering,[0,0,0,0]);
  }
  for (const p of [.52,.57,.62]) {
    const s=sampleApproach(p);
    assert.equal(s.chapter,1);
    assert.deepEqual(s.portraitExit,[1,1,1,1]);
    assert.deepEqual(s.engineering,[1,1,1,1]);
    assert.deepEqual(s.engineeringExit,[0,0,0,0]);
    assert.equal(s.aperture,0); assert.equal(s.wafer,0);
  }
  for (const p of [.88,.90,.96]) {
    const s=sampleApproach(p);
    assert.equal(s.chapter,2);
    assert.deepEqual(s.engineeringExit,[1,1,1,1]);
    assert.equal(s.wafer,1); assert.equal(s.hand,1); assert.equal(s.detail,1);
  }
});

test('the middle handoff alternates engineering and portrait bands', () => {
  const s=sampleApproach(.4);
  assert.equal(s.portraitExit[0],1);
  assert.equal(s.portraitExit[2],1);
  assert.equal(s.portraitExit[1],0);
  assert.equal(s.portraitExit[3],0);
  assert.equal(s.engineering[0],1);
  assert.equal(s.engineering[2],1);
  assert.equal(s.engineering[3],0);
});

test('the wafer emerges before the hand and detail crop', () => {
  const s=sampleApproach(.74);
  assert.ok(s.wafer>.65);
  assert.equal(s.hand,0);
  assert.equal(s.detail,0);
  assert.equal(s.engineeringExit[0],0);
  assert.equal(s.engineeringExit[3],0);
});

test('out-of-range and reverse seeks remain bounded and deterministic', () => {
  assert.deepEqual(sampleApproach(-5),sampleApproach(0));
  assert.deepEqual(sampleApproach(5),sampleApproach(1));
  assert.deepEqual(sampleApproach(NaN),sampleApproach(0));
  const forward=Array.from({length:1001},(_,i)=>sampleApproach(i/1000));
  for(let i=1000;i>=0;i--){
    const state=sampleApproach(i/1000);
    assert.deepEqual(state,forward[i]);
    for(const [key,value] of Object.entries(state)) {
      if(key==='chapter') continue;
      for(const scalar of Array.isArray(value)?value:[value]) assert.ok(scalar>=0&&scalar<=1);
    }
  }
  assert.deepEqual(approachStops.map(t=>Number((t/approachDuration).toFixed(2))),[.24,.57,.9]);
});

test('the renderer redraws only changed frames, restores a lost context, and releases resources', async () => {
  const originals={window:globalThis.window,document:globalThis.document,Image:globalThis.Image};
  let draws=0,removed=0,deletedTextures=0;
  const handlers=new Map();
  const calls=[];
  const gl=new Proxy({
    getShaderParameter:()=>true,getProgramParameter:()=>true,
    getAttribLocation:()=>0,getUniformLocation:(_,name)=>name,
    drawArrays:()=>{draws++},deleteTexture:()=>{deletedTextures++},
    uniform4fv:(name,value)=>calls.push([name,[...value]]),
  },{get(target,key){return key in target?target[key]:key===key.toUpperCase()?1:()=>({});}});
  const canvas={className:'',width:0,height:0,setAttribute(){},getContext:()=>gl,
    addEventListener:(name,fn)=>handlers.set(name,fn),removeEventListener:name=>handlers.delete(name),remove:()=>{removed++}};
  globalThis.window={devicePixelRatio:2};
  globalThis.document={createElement:()=>canvas};
  globalThis.Image=class {set src(value){this._src=value;queueMicrotask(()=>this.onload())}};
  const stage={dataset:{},append(){},getBoundingClientRect:()=>({width:1440,height:900})};
  try {
    const {createRevealRenderer}=await import('../src/approach-renderer.js');
    const renderer=await createRevealRenderer(stage,()=>assert.fail('Unexpected renderer failure'));
    const pose=sampleApproach(.4);
    renderer.draw(pose); assert.equal(draws,1);
    renderer.draw(pose); assert.equal(draws,1);
    renderer.resize(); assert.equal(draws,2);
    assert.equal(canvas.width,1920);
    assert.deepEqual(calls.find(([name])=>name==='u_engineeringIn')[1],pose.engineering);
    let prevented=false;
    handlers.get('webglcontextlost')({preventDefault(){prevented=true}});
    assert.equal(prevented,true);assert.equal(stage.dataset.renderer,'fallback');
    renderer.draw(sampleApproach(.9));assert.equal(draws,2);
    handlers.get('webglcontextrestored')();
    assert.equal(stage.dataset.renderer,'webgl');assert.equal(draws,3);
    assert.deepEqual(calls.filter(([name])=>name==='u_engineeringIn').at(-1)[1],sampleApproach(.9).engineering);
    renderer.dispose();
    assert.equal(removed,1);assert.equal(deletedTextures,3);
    assert.equal(handlers.size,0);
    renderer.draw(pose);assert.equal(draws,3);
  } finally {
    for(const [name,value] of Object.entries(originals)) {
      if(value===undefined) delete globalThis[name]; else globalThis[name]=value;
    }
  }
});

