export const clamp = (v, min = 0, max = 1) => Math.max(min, Math.min(max, v));
export const mix = (a, b, t) => a + (b - a) * t;
export const smooth = (a, b, v) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
export function rowHeights(total, selected = -1) {
  const expanded = Math.min(total * 0.52, Math.max(total / 6, total - 5 * 48));
  return Array.from({ length: 6 }, (_, i) =>
    selected < 0
      ? total / 6
      : i === selected
        ? expanded
        : (total - expanded) / 5,
  );
}
// The geometry is a pure function of scroll, including on reverse and deep links.
export function ribbonPose(u, v, index, progress, layout) {
  const p = clamp(progress),
    { height, rows } = layout,
    target = rows[index],
    local = clamp((p - index * 0.04) / 0.8);
  const turn = smooth(0, 1, local * 2.8 + u * 1.14 - 1.14),
    angle = Math.PI * turn,
    travel = smooth(0.03, 0.95, p);
  const startTop = height * 0.085,
    startH = (height - startTop) / 6,
    centre = mix(
      startTop + (index + 0.5) * startH,
      target.y + target.height / 2,
      travel,
    );
  const width = mix(1600, target.width, travel),
    left = mix(0, target.x, travel),
    h = mix(startH, target.height, travel) * (1 - 0.16 * Math.sin(Math.PI * p));
  const live = Math.sin(Math.PI * local),
    bend = Math.sin(angle),
    lift = live * (24 + 54 * Math.sin(Math.PI * u)) + bend * 34,
    yy = (0.5 - v) * h;
  return {
    x: left + u * width - 800 + bend * live * 12,
    y:
      height / 2 -
      centre +
      yy * Math.cos(angle) +
      live * Math.sin(u * Math.PI * 1.15 + index * 0.2) * 7,
    z: lift + yy * Math.sin(angle),
    angle,
  };
}
