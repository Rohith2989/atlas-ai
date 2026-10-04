import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { ribbonPose, rowHeights } from "../src/portfolio-motion.js";
const layout = (height) => ({
  height,
  rows: Array.from({ length: 6 }, (_, i) => ({
    x: 60,
    y: height * (0.156 + i * 0.12),
    width: 1480,
    height: height * 0.12,
  })),
});
const near = (a, b, epsilon = 1e-7) =>
  assert.ok(Math.abs(a - b) < epsilon, `${a} ≠ ${b}`);
test("the outgoing plane has no gaps and lands exactly on all six HTML rows", () => {
  for (const h of [700, 900, 1100, 1400]) {
    const l = layout(h);
    for (let i = 0; i < 6; i++)
      for (const u of [0, 0.25, 0.75, 1]) {
        const a = ribbonPose(u, 0, i, 0, l),
          b = ribbonPose(u, 1, i, 0, l);
        near(a.z, 0);
        near(b.z, 0);
        near(a.x, u * 1600 - 800);
        if (i < 5) near(b.y, ribbonPose(u, 0, i + 1, 0, l).y);
        const end = ribbonPose(u, 0, i, 1, l),
          endBottom = ribbonPose(u, 1, i, 1, l);
        near(end.z, 0);
        near(end.angle, Math.PI);
        near(end.x, l.rows[i].x + u * l.rows[i].width - 800);
        // Turning over reverses vertical coordinates; the back texture reverses UVs.
        near(end.y, h / 2 - l.rows[i].y - l.rows[i].height);
        near(endBottom.y, h / 2 - l.rows[i].y);
      }
  }
});
test("the turn has real depth, stays finite, and seeks identically in either direction", () => {
  const l = layout(1000);
  let maximumDepth = 0;
  const samples = [];
  for (let p = 0; p <= 100; p++)
    for (let row = 0; row < 6; row++)
      for (let u = 0; u <= 12; u++) {
        const pose = ribbonPose(u / 12, 0.2, row, p / 100, l);
        samples.push([u / 12, row, p / 100, pose]);
        Object.values(pose).forEach((n) => assert.ok(Number.isFinite(n)));
        assert.ok(pose.angle >= 0 && pose.angle <= Math.PI);
        assert.ok(pose.x >= -810 && pose.x <= 810);
        assert.ok(Math.abs(pose.z) < 230);
        maximumDepth = Math.max(maximumDepth, pose.z);
      }
  assert.ok(maximumDepth > 95, "The wave must lift away from the page.");
  samples
    .reverse()
    .forEach(([u, row, p, pose]) =>
      assert.deepEqual(ribbonPose(u, 0.2, row, p, l), pose),
    );
});
test("accordion expansion conserves its height and keeps every company legible", () => {
  for (const total of [420, 600, 720, 1000])
    for (let open = -1; open < 6; open++) {
      const heights = rowHeights(total, open);
      near(
        heights.reduce((a, b) => a + b, 0),
        total,
      );
      heights.forEach((h) => assert.ok(h >= 48));
      if (open >= 0) assert.ok(heights[open] > heights[(open + 1) % 6]);
    }
});
test("the ribbon 8x mark retains the exact official logo geometry", () => {
  const path = (s) => s.match(/<path\s+d="([^"]+)"/)[1];
  assert.equal(
    path(
      readFileSync(
        new URL("../public/portfolio/8x-ribbon-mark.svg", import.meta.url),
        "utf8",
      ),
    ),
    path(
      readFileSync(
        new URL("../public/portfolio/8x-logo.svg", import.meta.url),
        "utf8",
      ),
    ),
  );
});
