// Artwork coordinates are normalized. The central subject stays on a fixed plane;
// only the attached border facets rotate around their authored hinge segments.
export const clamp01 = value => Math.max(0, Math.min(1, value));
const panel = (a, b, tip, delay = 0, direction = 1) => ({ a, b, tip, delay, direction });

export const foldDesigns = {
  'civils-ai': {
    aspect: 1.85, back: '#ded9c6',
    core: [[0,0],[.79,0],[1,.24],[1,.73],[.74,.98],[.24,.91],[0,.58]],
    panels: [
      panel([.79,0],[1,.24],[.81,.42], .02),
      panel([0,.58],[.24,.91],[.33,.48], .10, -1),
      panel([.74,.98],[1,.73],[.66,.62], .19),
    ],
  },
  bioleap: {
    aspect: 1.40, back: '#b9b9a9',
    core: [[.12,.06],[.79,.06],[.99,.23],[.99,.72],[.80,.94],[.25,.94],[.05,.67],[0,.30]],
    panels: [
      panel([.12,.06],[0,.30],[.29,.32], .00, -1),
      panel([.79,.06],[.99,.23],[.79,.35], .10),
      panel([.05,.67],[.25,.94],[.34,.57], .18, -1),
      panel([.80,.94],[.99,.72],[.74,.65], .26),
    ],
  },
  'zero-drift': {
    aspect: 1.50, back: '#f3eddb', mask: '/portfolio/folds/zero-drift-mask.svg', resolveMask:true,
    core: [[0,0],[1,0],[1,1],[0,1]],
    panels: [
      panel([.02,.04],[.32,.25],[.06,.39], .00, -1),
      panel([.71,.53],[.98,.53],[.81,.76], .10),
      panel([.40,.31],[.63,.25],[.56,.48], .16, -1),
      panel([.64,.73],[.94,.73],[.74,.56], .22),
    ],
  },
  tilki: {
    aspect: 1.70, back: '#ec6209',
    core: [[.08,.20],[.33,.12],[.50,.12],[.76,.12],[.82,.23],[.98,.41],[.95,.65],[.77,.88],[.61,.95],[.30,.91],[.18,.86],[.04,.51]],
    panels: [
      panel([.08,.20],[.33,.12],[.27,.45], .00, -1),
      panel([.50,.12],[.76,.12],[.58,.52], .07),
      panel([.82,.23],[.98,.41],[.67,.52], .14, -1),
      panel([.77,.88],[.95,.65],[.54,.56], .20),
      panel([.30,.91],[.61,.95],[.51,.62], .26, -1),
      panel([.04,.51],[.18,.86],[.47,.49], .12),
    ],
  },
  sekkari: {
    aspect: 1.90, back: '#77879c',
    core: [[0,.10],[.80,.10],[1,.32],[1,.73],[.75,.91],[.18,.91],[0,.54]],
    panels: [
      panel([.80,.10],[1,.32],[.75,.43], .00),
      panel([0,.54],[.18,.91],[.34,.55], .10, -1),
      panel([.75,.91],[1,.73],[.68,.52], .20),
    ],
  },
  '8x': {
    aspect: 1.50, back: '#8793b4', mark: '/portfolio/folds/8x-mark.svg',
    core: [[0,0],[1,0],[1,1],[0,1]],
    panels: [
      panel([.10,.15],[.35,.04],[.33,.40], .00, -1),
      panel([.67,.06],[.92,.26],[.52,.43], .12),
      panel([.02,.65],[.24,.91],[.46,.48], .19, -1),
      panel([.65,.94],[.94,.69],[.56,.51], .27),
    ],
  },
};

export function easeFold(t) {
  t = clamp01(t);
  // Continuous velocity and acceleration at both ends: no snapping hinge.
  return t*t*t*(t*(t*6-15)+10);
}

export function facetProgress(progress, delay) {
  return easeFold((clamp01(progress) - delay) / (1 - delay));
}

export function rotatePoint(point, a, b, angle, aspect = 1) {
  const dx = (b[0] - a[0]) * aspect, dy = b[1] - a[1];
  const length = Math.hypot(dx, dy);
  if (length < 1e-8) throw new Error('A fold hinge needs two distinct points.');
  const ux = dx / length, uy = dy / length;
  const x = (point[0] - a[0]) * aspect, y = point[1] - a[1];
  const cos = Math.cos(angle), sin = Math.sin(angle), along = ux*x + uy*y;
  return [
    (x*cos + ux*along*(1-cos)) / aspect + a[0],
    y*cos + uy*along*(1-cos) + a[1],
    (ux*y - uy*x)*sin,
  ];
}

export function designBounds(design) {
  const points = [[0,0],[1,1], ...design.core];
  for (const face of design.panels) {
    // Include the complete path, not just the end points, for safe clipping bounds.
    for (let step = 0; step <= 24; step++) {
      points.push(rotatePoint(face.tip, face.a, face.b, Math.PI * step/24, design.aspect));
    }
  }
  const x0 = Math.min(...points.map(p=>p[0])), x1 = Math.max(...points.map(p=>p[0]));
  const y0 = Math.min(...points.map(p=>p[1])), y1 = Math.max(...points.map(p=>p[1]));
  return { x0, x1, y0, y1, width:x1-x0, height:y1-y0 };
}

export function fitFold(design, width, height) {
  const bounds = designBounds(design);
  // A margin also covers perspective expansion and a small hover response.
  const unit = Math.min(width/(bounds.width*design.aspect), height/bounds.height) * .96;
  const w = unit * design.aspect, h = unit;
  return { width:w, height:h, left:(width-w*bounds.width)/2-bounds.x0*w, top:(height-h*bounds.height)/2-bounds.y0*h };
}

export function facetTransform(face, progress, width, height, lift = 0) {
  const dx = (face.b[0]-face.a[0])*width, dy = (face.b[1]-face.a[1])*height;
  const length = Math.hypot(dx,dy);
  const p = facetProgress(progress, face.delay);
  const degrees = face.direction * (-180*p + lift*p);
  return { transform:`rotate3d(${dx/length},${dy/length},0,${degrees}deg)`, progress:p, degrees };
}
