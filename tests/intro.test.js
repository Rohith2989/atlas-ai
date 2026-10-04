import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const boot = html.match(/<script id="atlas-intro-boot">([\s\S]*?)<\/script>/)[1];
function start({ reduced = false, hash = '', search = '', navigationType = 'navigate' } = {}) {
  const classes = new Set();
  const events = [];
  const listeners = {};
  let watchdog;
  const node = { inert: true, removeAttribute() { this.released = true; } };
  const env = {
    window: {}, URLSearchParams, Event,
    location: { hash, search },
    matchMedia: () => ({ matches: reduced }),
    performance: { getEntriesByType: () => [{ type: navigationType }] },
    sessionStorage: { getItem() { throw Error('The entrance must not depend on session storage'); } },
    document: {
      documentElement: { classList: { add: c => classes.add(c), remove: c => classes.delete(c) } },
      querySelectorAll: () => [node],
      dispatchEvent: e => events.push(e.type),
    },
    setTimeout: fn => { watchdog = fn; return 1; },
    clearTimeout() {},
    addEventListener: (name, fn) => { listeners[name] = fn; },
  };
  runInNewContext(boot, env);
  return { env, classes, events, node, timeout: () => watchdog?.(), listeners };
}
test('the entrance replays on reload, including chapter reloads, and respects reduced motion', () => {
  for (const options of [{ reduced: true }, { reduced: true, navigationType: 'reload' }, { hash: '#companies' }, { hash: '#contact', search: '?intro=replay' }]) {
    const state = start(options);
    assert.equal(state.classes.size, 0);
    assert.equal(state.env.window.__atlasIntro, undefined);
  }
  for (const options of [{}, { hash: '#hero' }, { navigationType: 'reload' }, { navigationType: 'reload', hash: '#companies' }, { navigationType: 'reload', hash: '#contact' }]) {
    const state = start(options);
    assert.equal(state.env.window.__atlasIntro.active, true);
    assert.ok(state.classes.has('atlas-entering'));
  }
});
test('failure timeout and back-forward restoration release scrolling and focusable content once', () => {
  for (const cause of ['timeout', 'back-forward', 'skip']) {
    const state = start();
    if (cause === 'timeout') state.timeout();
    if (cause === 'back-forward') state.listeners.pageshow({ persisted: true });
    if (cause === 'skip') state.env.window.__atlasIntro.release();
    state.env.window.__atlasIntro.release();
    assert.equal(state.classes.size, 0);
    assert.equal(state.node.inert, false);
    assert.equal(state.node.released, true);
    assert.equal(state.env.window.__atlasIntro.active, false);
    assert.deepEqual(state.events, ['atlas:intro-end']);
  }
});
test('animated logo preserves every original path, including the letter counters', () => {
  const original = readFileSync(new URL('../public/assets/atlas-header.svg', import.meta.url), 'utf8');
  const animated = readFileSync(new URL('../src/intro-mark.svg', import.meta.url), 'utf8');
  // The public SVG repeats its counter shapes and has a canvas-sized mask path.
  // Compare unique mark/counter geometry, excluding that mask background.
  const paths = text => [...new Set([...text.matchAll(/<path\b[^>]*\bd="([^"]+)"/g)]
    .map(m => m[1]).filter(d => d !== 'M0 0h1676v454H0z'))].sort();
  assert.deepEqual(paths(animated), paths(original));
  assert.equal((animated.match(/class="intro-dot"/g) || []).length, 30);
});
