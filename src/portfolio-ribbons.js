import * as THREE from "three";
import { ribbonPose, smooth, mix } from "./portfolio-motion.js";

const FIELD = "#256c50",
  IVORY = "#f3f1e3",
  COLS = 144,
  CROSS = 8;
const images = new Map();
function loadImage(src) {
  if (!images.has(src))
    images.set(
      src,
      new Promise((resolve, reject) => {
        const im = new Image();
        im.onload = () => resolve(im);
        im.onerror = reject;
        im.src = src;
      }),
    );
  return images.get(src);
}
function makeCanvas(w, h) {
  const c = document.createElement("canvas");
  c.width = Math.ceil(w);
  c.height = Math.ceil(h);
  return c;
}
function cover(ctx, image, x, y, w, h) {
  const iw = image.naturalWidth || image.width,
    ih = image.naturalHeight || image.height,
    scale = Math.max(w / iw, h / ih);
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.drawImage(
    image,
    x + (w - iw * scale) / 2,
    y + (h - ih * scale) / 2,
    iw * scale,
    ih * scale,
  );
  ctx.restore();
}

// Paint the actual text runs at their measured positions. This is runtime UI
// compositing onto a 3D material; no generated screenshot is used by the site.
function paintWords(ctx, element, rect) {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  let node;
  while ((node = walker.nextNode())) {
    const style = getComputedStyle(node.parentElement),
      size = parseFloat(style.fontSize);
    ctx.font = `${style.fontStyle} ${style.fontWeight} ${size}px ${style.fontFamily}`;
    ctx.fillStyle = IVORY;
    ctx.letterSpacing =
      style.letterSpacing === "normal" ? "0px" : style.letterSpacing;
    ctx.textBaseline = "alphabetic";
    for (const match of node.textContent.matchAll(/\S+/g)) {
      const range = document.createRange();
      range.setStart(node, match.index);
      range.setEnd(node, match.index + match[0].length);
      const r = rect(range),
        m = ctx.measureText(match[0]),
        asc = m.fontBoundingBoxAscent || size * 0.8,
        desc = m.fontBoundingBoxDescent || size * 0.2;
      ctx.fillText(match[0], r.x, r.y + (r.height - asc - desc) / 2 + asc);
    }
  }
  ctx.letterSpacing = "0px";
}
function paintInk(ctx, element, rect) {
  const box = rect(element),
    ink = element.querySelector(".ink"),
    text = ink.textContent;
  ctx.save();
  ctx.font = "900 500px Bodoni";
  ctx.letterSpacing = "-7.5px";
  ctx.wordSpacing = "65px";
  const m = ctx.measureText(text),
    w = m.actualBoundingBoxLeft + m.actualBoundingBoxRight,
    h = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
  ctx.translate(box.x, box.y);
  ctx.scale((box.width - 3) / w, (box.height - 3) / h);
  ctx.fillStyle = IVORY;
  ctx.strokeStyle = IVORY;
  ctx.lineWidth = 4.5;
  ctx.textBaseline = "alphabetic";
  ctx.strokeText(text, m.actualBoundingBoxLeft, m.actualBoundingBoxAscent);
  ctx.fillText(text, m.actualBoundingBoxLeft, m.actualBoundingBoxAscent);
  ctx.restore();
}

export async function createRibbonRenderer(stage, companies, onFailure) {
  const loaded = await Promise.all(companies.map((c) => loadImage(c.image)));
  await Promise.all(
    ["#science img", "#material img", "#biology img"].map((s) =>
      document
        .querySelector(s)
        .decode()
        .catch(() => {}),
    ),
  );
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setClearColor(0, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.VSMShadowMap;
  renderer.domElement.setAttribute("aria-hidden", "true");
  stage.append(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 4000);
  camera.position.z = 1900;
  const ambient = new THREE.AmbientLight("#d9eadd", 1.45);
  scene.add(ambient);
  const key = new THREE.DirectionalLight("#fff5e2", 2.0);
  key.position.set(-450, 680, 1050);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  Object.assign(key.shadow.camera, {
    left: -1100,
    right: 1100,
    top: 900,
    bottom: -900,
    near: 10,
    far: 2300,
  });
  key.shadow.radius = 7;
  key.shadow.blurSamples = 12;
  key.shadow.bias = -0.0001;
  key.shadow.normalBias = 0.6;
  scene.add(key);
  const fill = new THREE.DirectionalLight("#a9d1dd", 0.55);
  fill.position.set(750, -250, 800);
  scene.add(fill);
  const floorMaterial = new THREE.ShadowMaterial({
    color: "#041c12",
    opacity: 0.42,
  });
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(2200, 2200),
    floorMaterial,
  );
  floor.position.z = -5;
  floor.receiveShadow = true;
  scene.add(floor);
  const flat = { value: 1 };
  let layout,
    leaves = [],
    captured = false,
    disposed = false,
    lastP = -1,
    lastCrop = -1;
  function texture(c, reverse = false) {
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    if (reverse) {
      t.repeat.y = -1;
      t.offset.y = 1;
    }
    return t;
  }
  function material(map, side) {
    const m = new THREE.MeshStandardMaterial({
      map,
      side,
      roughness: 0.56,
      metalness: 0,
    });
    m.onBeforeCompile = (shader) => {
      shader.uniforms.uFlat = flat;
      shader.fragmentShader = "uniform float uFlat;\n" + shader.fragmentShader;
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <opaque_fragment>",
        "outgoingLight = mix(outgoingLight, diffuseColor.rgb, uFlat);\n#include <opaque_fragment>",
      );
    };
    m.customProgramCacheKey = () => "atlas-printed-ribbon-v1";
    return m;
  }
  function clearLeaves() {
    leaves.forEach((l) => {
      scene.remove(l.front, l.back, l.edge);
      l.geometry.dispose();
      l.edge.geometry.dispose();
      l.edge.material.dispose();
      l.front.material.dispose();
      l.back.material.dispose();
      l.frontTexture.dispose();
      l.backTexture.dispose();
    });
    leaves = [];
  }
  function measure(H) {
    const art = document.getElementById("artboard"),
      origin = art.getBoundingClientRect(),
      scale = origin.width / 1600;
    const rect = (el) => {
      const r = el.getBoundingClientRect();
      return {
        x: (r.left - origin.left) / scale,
        y: (r.top - origin.top) / scale,
        width: r.width / scale,
        height: r.height / scale,
      };
    };
    const rowElements = [...document.querySelectorAll(".company-row")];
    layout = { height: H, rows: rowElements.map(rect), rect };
    return rowElements;
  }
  function setup(H) {
    clearLeaves();
    captured = false;
    lastP = -1;
    lastCrop = -1;
    const rowElements = measure(H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setSize(stage.clientWidth, H, false);
    camera.aspect = 1600 / H;
    camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(H / 2 / 1900));
    camera.updateProjectionMatrix();
    rowElements.forEach((el, i) => {
      const geom = new THREE.PlaneGeometry(1, 1, COLS, CROSS);
      geom.attributes.position.setUsage(THREE.DynamicDrawUsage);
      const frontCanvas = makeCanvas(1600, (H * 0.915) / 6),
        backCanvas = makeCanvas(layout.rows[i].width, layout.rows[i].height);
      const frontTexture = texture(frontCanvas),
        backTexture = texture(backCanvas, true);
      const front = new THREE.Mesh(
          geom,
          material(frontTexture, THREE.FrontSide),
        ),
        back = new THREE.Mesh(geom, material(backTexture, THREE.BackSide));
      front.castShadow = back.castShadow = true;
      front.receiveShadow = back.receiveShadow = true;
      front.frustumCulled = back.frustumCulled = false;
      const edgeGeometry = new THREE.BufferGeometry();
      edgeGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
          new Float32Array((COLS * 2 + CROSS * 2) * 3),
          3,
        ).setUsage(THREE.DynamicDrawUsage),
      );
      const edge = new THREE.LineLoop(
        edgeGeometry,
        new THREE.LineBasicMaterial({
          color: "#c4d7c4",
          transparent: true,
          opacity: 0,
          depthWrite: false,
        }),
      );
      edge.frustumCulled = false;
      scene.add(front, back, edge);
      leaves.push({
        geometry: geom,
        front,
        back,
        edge,
        frontCanvas,
        backCanvas,
        frontTexture,
        backTexture,
        element: el,
      });
    });
  }
  function capture() {
    if (captured || disposed) return;
    const H = layout.height,
      full = makeCanvas(1600, H),
      ctx = full.getContext("2d"),
      rect = layout.rect;
    ctx.fillStyle = FIELD;
    ctx.fillRect(0, 0, 1600, H);
    for (const selector of [
      "#biology",
      "#science .image-window",
      "#material .image-window",
    ]) {
      const el = document.querySelector(selector),
        r = rect(el),
        im = el.querySelector("img");
      if (im.complete && im.naturalWidth)
        cover(ctx, im, r.x, r.y, r.width, r.height);
    }
    ["#edge", "#deep"].forEach((s) =>
      paintInk(ctx, document.querySelector(s), rect),
    );
    [
      "#thesis-kicker",
      "#thesis-copy",
      "#criteria",
      "#science figcaption",
      "#material figcaption",
      "#all-companies",
    ].forEach((s) => paintWords(ctx, document.querySelector(s), rect));
    leaves.forEach((l, i) => {
      const h = (H * 0.915) / 6,
        c = l.frontCanvas.getContext("2d");
      c.drawImage(
        full,
        0,
        H * 0.085 + i * h,
        1600,
        h,
        0,
        0,
        l.frontCanvas.width,
        l.frontCanvas.height,
      );
      l.frontTexture.needsUpdate = true;
    });
    captured = true;
    stage.dataset.renderer = "webgl";
  }
  function paintBack(p) {
    const settle = smooth(0.6, 0.98, p),
      crop = Math.round(settle * 500) / 500;
    if (crop === lastCrop) return;
    lastCrop = crop;
    leaves.forEach((l, i) => {
      const c = l.backCanvas,
        ctx = c.getContext("2d"),
        w = c.width,
        h = c.height,
        row = l.element;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = FIELD;
      ctx.fillRect(0, 0, w, h);
      const x = w * 0.255,
        y = mix(0, h * 0.17, crop),
        iw = mix(w * 0.745, w * 0.486, crop),
        ih = mix(h, h * 0.66, crop);
      if (companies[i].id === "8x") {
        ctx.fillStyle = "#152452";
        ctx.fillRect(x, y, iw, ih);
        const im = loaded[i],
          scale = (ih * 0.82) / im.naturalHeight;
        ctx.drawImage(
          im,
          x + (iw - im.naturalWidth * scale) / 2,
          y + (ih - im.naturalHeight * scale) / 2,
          im.naturalWidth * scale,
          im.naturalHeight * scale,
        );
      } else cover(ctx, loaded[i], x, y, iw, ih);
      const nameStyle = getComputedStyle(row.querySelector(".company-name"));
      ctx.fillStyle = IVORY;
      ctx.textBaseline = "middle";
      ctx.font = `400 ${nameStyle.fontSize} Georgia`;
      ctx.letterSpacing = nameStyle.letterSpacing;
      ctx.fillText(companies[i].name, w * 0.05, h / 2);
      ctx.letterSpacing = "0px";
      ctx.font = `400 ${getComputedStyle(row.querySelector(".company-number")).fontSize} Instrument`;
      ctx.fillText(String(i + 1).padStart(2, "0") + " /", 0, h / 2);
      ctx.globalAlpha = crop;
      ctx.font = `400 ${getComputedStyle(row.querySelector(".company-sector")).fontSize} Instrument`;
      ctx.fillText(companies[i].sector, w * 0.77, h / 2);
      ctx.strokeStyle = IVORY;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(w - 23, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.moveTo(w - 11.5, h / 2 - 11.5);
      ctx.lineTo(w - 11.5, h / 2 + 11.5);
      ctx.stroke();
      ctx.globalAlpha = crop * 0.43;
      ctx.beginPath();
      ctx.moveTo(0, h - 0.5);
      ctx.lineTo(w, h - 0.5);
      ctx.stroke();
      ctx.globalAlpha = 1;
      l.backTexture.needsUpdate = true;
    });
  }
  function draw(p) {
    if (disposed || !captured || p === lastP) return;
    lastP = p;
    paintBack(p);
    flat.value = Math.max(1 - smooth(0, 0.1, p), smooth(0.84, 1, p));
    floorMaterial.opacity = 0.3 * Math.sin(Math.PI * p);
    leaves.forEach((l, index) => {
      const positions = l.geometry.attributes.position;
      for (let j = 0; j <= CROSS; j++)
        for (let i = 0; i <= COLS; i++) {
          const point = ribbonPose(i / COLS, j / CROSS, index, p, layout);
          positions.setXYZ(j * (COLS + 1) + i, point.x, point.y, point.z);
        }
      positions.needsUpdate = true;
      l.geometry.computeVertexNormals();
      const border = [];
      for (let i = 0; i < COLS; i++) border.push(i);
      for (let j = 0; j < CROSS; j++) border.push(j * (COLS + 1) + COLS);
      for (let i = COLS; i > 0; i--) border.push(CROSS * (COLS + 1) + i);
      for (let j = CROSS; j > 0; j--) border.push(j * (COLS + 1));
      const edge = l.edge.geometry.attributes.position;
      border.forEach((n, i) =>
        edge.setXYZ(
          i,
          positions.getX(n),
          positions.getY(n),
          positions.getZ(n) + 0.3,
        ),
      );
      edge.needsUpdate = true;
      l.edge.material.opacity = 0.3 * Math.sin(Math.PI * p);
    });
    renderer.render(scene, camera);
    stage.dataset.progress = p.toFixed(4);
  }
  const lost = (e) => {
    e.preventDefault();
    onFailure();
  };
  renderer.domElement.addEventListener("webglcontextlost", lost);
  return {
    layout: setup,
    capture,
    draw,
    dispose() {
      if (disposed) return;
      disposed = true;
      clearLeaves();
      floor.geometry.dispose();
      floorMaterial.dispose();
      key.shadow.dispose();
      renderer.domElement.removeEventListener("webglcontextlost", lost);
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}
