import { clamp01, fitFold, facetTransform } from './portfolio-folds';

const polygon = points => `polygon(${points.map(p=>`${p[0]*100}% ${p[1]*100}%`).join(',')})`;

export function createFoldView(stage, design, source) {
  const assembly = document.createElement('div');
  assembly.className = 'fold-assembly';
  assembly.setAttribute('aria-hidden', 'true');
  assembly.innerHTML = '<div class="fold-core"></div><div class="fold-closed"></div>';
  const core = assembly.querySelector('.fold-core');
  const closed = assembly.querySelector('.fold-closed');
  const pieces = design.panels.map(() => {
    const element = document.createElement('div');
    element.className = 'fold-piece';
    element.innerHTML = '<div class="fold-surface"><i class="fold-light"></i></div>';
    assembly.append(element);
    return { element, surface:element.firstElementChild, light:element.querySelector('i') };
  });
  let mark;
  if (design.mark) {
    mark = document.createElement('img');
    mark.className = 'fold-mark';
    mark.src = design.mark;
    mark.alt = '';
    mark.width = 1536;
    mark.height = 1024;
    assembly.append(mark);
  }
  stage.append(assembly);
  stage.classList.add('fold-enhanced');
  let box = {width:1,height:1}, last = -1, lastLift = -1;

  function paint(progress = 1, lift = 0) {
    const p = clamp01(progress);
    if (Math.abs(p-last)<.0001 && Math.abs(lift-lastLift)<.005) return;
    last = p; lastLift = lift;
    // The intact source square is a cover sheet; it clears as the perimeter opens.
    closed.style.opacity = String(1-clamp01((p-.12)/.44));
    core.style.opacity = design.mark ? String(1-clamp01((p-.38)/.48)) : '1';
    pieces.forEach((piece,index) => {
      const sampled = facetTransform(design.panels[index],p,box.width,box.height,lift*(index%2 ? .7 : 1));
      piece.element.style.transform = sampled.transform;
      const turn = Math.sin(Math.PI*sampled.progress);
      piece.light.style.opacity = String(turn*.40);
      piece.surface.style.filter = `brightness(${1-turn*.19})`;
      // The 8x lettering remains a separate, unchanged foreground plane.
      piece.element.style.opacity = (design.mark && (index===0 || index===3)) || design.resolveMask
        ? String(1-clamp01((p-.72)/.28)) : '1';
    });
    if (mark) mark.style.transform = `translateZ(${3 + p*9}px)`;
    stage.dataset.foldProgress = p.toFixed(3);
    stage.dataset.foldState = p<.001 ? 'closed' : p>.999 ? 'open' : 'unfolding';
  }

  function layout(progress = 1, lift = 0) {
    box = fitFold(design, stage.clientWidth, stage.clientHeight);
    Object.assign(assembly.style, { width:`${box.width}px`,height:`${box.height}px`,left:`${box.left}px`,top:`${box.top}px` });
    const background = design.mark ? 'linear-gradient(135deg,#10183e,#263a77)' : `url("${source}")`;
    Object.assign(core.style, {backgroundImage:background,clipPath:polygon(design.core)});
    closed.style.backgroundImage = background;
    if (design.mask) {
      core.style.maskImage = `url("${design.mask}")`;
      core.style.maskSize = '100% 100%';
      core.style.backgroundSize = '100% 100%';
    }
    pieces.forEach((piece,index) => {
      const face = design.panels[index];
      piece.element.style.transformOrigin = `${face.a[0]*100}% ${face.a[1]*100}%`;
      Object.assign(piece.surface.style, {backgroundImage:background,clipPath:polygon([face.a,face.b,face.tip])});
      piece.light.style.background = design.back;
    });
    last = -1; paint(progress,lift);
  }
  return { layout, paint };
}
