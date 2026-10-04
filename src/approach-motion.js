// The approved six storyboard frames share one reversible scroll clock.
// 15.12 timeline units / 3.6 units per viewport = 420vh of scroll travel.
export const approachDuration = 15.12;
export const approachNames = ['founders', 'engineering', 'defensible'];
export const approachStops = [0.24, 0.57, 0.90].map(p => p * approachDuration);
export const clamp = value => Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
const range = (p, a, b) => clamp((p - a) / (b - a));
const smooth = value => value * value * (3 - 2 * value);
const phase = (p, a, b) => smooth(range(p, a, b));

export function sampleApproach(value) {
  const p = clamp(value);
  return {
    progress: p,
    chapter: p < .355 ? 0 : p < .683 ? 1 : 2,
    split: phase(p, .315, .35),
    portrait: phase(p, .016, .155),
    diffraction: phase(p, .04, .15),
    drawing: phase(p, .093, .185),
    portraitExit: [[.325,.397],[.401,.485],[.343,.395],[.42,.50]].map(([a,b]) => phase(p,a,b)),
    engineering: [[.33,.395],[.395,.485],[.348,.397],[.42,.50]].map(([a,b]) => phase(p,a,b)),
    engineeringExit: [[.755,.827],[.677,.775],[.673,.767],[.755,.835]].map(([a,b]) => phase(p,a,b)),
    aperture: phase(p, .662, .77),
    wafer: phase(p, .66, .785),
    hand: phase(p, .744, .84),
    detail: phase(p, .803, .865),
  };
}

