import gsap from "gsap";
import "./portfolio.css";
import "./portfolio-index.css";
import { clamp, smooth, rowHeights } from "./portfolio-motion.js";
const records = import.meta.glob("./data/companies/*.json", {
  eager: true,
  import: "default",
});
export const companies = Object.values(records).sort(
  (a, b) => a.order - b.order,
);
export const featured = [
  "civils-ai",
  "bioleap",
  "zero-drift",
  "tilki",
  "sekkari",
  "8x",
].map((id) => companies.find((c) => c.id === id));
export const artwork = featured.map((c) => ({
  ...c,
  image:
    {
      "civils-ai": "/assets/material-intelligence.webp",
      bioleap: "/assets/optical-specimen.webp",
      "8x": "/portfolio/8x-ribbon-mark.svg",
    }[c.id] || c.cover,
}));
const captions = [
  "Intelligence for the built world.",
  "Exploring biology through hybrid AI.",
  "Confidence in every communication.",
  "New possibilities for game worlds.",
  "Building with light.",
  "Connecting brands and creators.",
];
let section,
  world,
  rows = [],
  selected = -1,
  desktop = false,
  transition,
  generation = 0,
  renderer,
  requested = false,
  currentTime = 0,
  entryStart = 33.2,
  entryEnd = 37.2,
  exitStart = 39.7,
  transitionHeight = 1000,
  lastStage = "",
  failure = false;
const state = { openings: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }, heights: {} };
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
export function mountPortfolio() {
  section = document.getElementById("companies");
  world = document.getElementById("company-world");
  artwork.forEach((c, i) => {
    const row = document.createElement("article");
    row.className = "company-row";
    row.dataset.company = c.id;
    row.innerHTML = `<h3><button class="company-toggle" id="company-toggle-${i}" aria-expanded="false" aria-controls="company-detail-${i}" type="button"><span class="company-number">${String(i + 1).padStart(2, "0")} /</span><span class="company-name">${c.name}</span><span class="company-sector">${c.sector}</span><span class="company-plus" aria-hidden="true"><i></i><i></i></span></button></h3><div class="company-aperture" aria-hidden="true"><img src="${c.image}" alt="" decoding="async" width="1536" height="1024"></div><div class="company-detail" id="company-detail-${i}" role="region" aria-labelledby="company-toggle-${i}" inert><p>${c.sector}</p><p class="company-place">${c.country}</p><p class="company-description">${captions[i]}</p><a href="${c.url}" target="_blank" rel="noopener noreferrer">View company <span aria-hidden="true">↗</span></a></div>`;
    world.append(row);
    rows.push({
      el: row,
      toggle: row.querySelector("button"),
      detail: row.querySelector(".company-detail"),
      aperture: row.querySelector(".company-aperture"),
    });
    row
      .querySelector("button")
      .addEventListener("click", () => selectCompany(i));
    row.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && selected === i) {
        e.preventDefault();
        selectCompany(i);
        row.querySelector("button").focus({ preventScroll: true });
      }
    });
  });
  transition = document.createElement("div");
  transition.className = "portfolio-turn";
  transition.setAttribute("aria-hidden", "true");
  document.getElementById("artboard").append(transition);
  mountAllCompanies();
}
function mountAllCompanies() {
  const dialog = document.getElementById("portfolio-index"),
    list = dialog.querySelector(".index-list");
  companies.forEach((c, i) => {
    const a = document.createElement("a");
    a.className = "index-company";
    a.href = c.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.dataset.search = [c.name, c.sector, c.country, c.status]
      .join(" ")
      .toLowerCase();
    a.innerHTML = `<span class="index-number">${String(i + 1).padStart(2, "0")}</span><img class="index-cover" src="${c.cover}" alt="" width="150" height="110" loading="lazy" decoding="async"><span class="index-detail"><strong>${c.name}</strong><span>${c.sector}</span></span><span class="index-country">${c.country}<small>${c.status === "Exited" ? "Exited" : "In portfolio"}</small></span>${c.logo ? `<img class="index-logo" src="${c.logo}" alt="${c.name} logo" width="100" height="42" loading="lazy">` : '<span class="index-logo">8x</span>'}<span aria-hidden="true">↗</span>`;
    list.append(a);
  });
  document.querySelectorAll("[data-open-index]").forEach((b) =>
    b.addEventListener("click", () => {
      dialog.showModal();
      document.dispatchEvent(new CustomEvent("atlas:index", { detail: true }));
      dialog.querySelector("input").focus();
    }),
  );
  dialog
    .querySelector("[data-close-index]")
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () =>
    document.dispatchEvent(new CustomEvent("atlas:index", { detail: false })),
  );
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });
  dialog.querySelector("input").addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    let count = 0;
    list.querySelectorAll("a").forEach((a) => {
      a.hidden = !a.dataset.search.includes(query);
      if (!a.hidden) count++;
    });
    dialog.querySelector(".index-results").textContent =
      `${count} ${count === 1 ? "company" : "companies"}`;
  });
}
function paintRows() {
  let y = 0;
  rows.forEach((row, i) => {
    const p = state.openings[i],
      h = state.heights[i];
    row.el.style.setProperty("--open", p);
    row.el.style.setProperty("--detail", smooth(0.32, 0.88, p));
    if (desktop) {
      row.el.style.height = h + "px";
      row.el.style.top = y + "px";
      y += h;
      const ih = h * (0.66 + 0.27 * p);
      row.aperture.style.top = (h - ih) / 2 + "px";
      row.aperture.style.height = ih + "px";
    } else {
      row.el.style.height = 108 + p * 365 + "px";
      row.aperture.style.top = 24 + p * 186 + "px";
      row.aperture.style.height = 60 + p * 150 + "px";
    }
    const step = p * 8,
      offset = p * 11;
    row.aperture.style.clipPath = `polygon(${offset}% 0,100% 0,100% ${100 - step}%,${100 - offset}% ${100 - step}%,${100 - offset}% 100%,0 100%,0 ${step}%,${offset}% ${step}%)`;
    row.el.classList.toggle("is-open", i === selected);
  });
}
function selectCompany(index, instant = false) {
  selected = selected === index ? -1 : index;
  gsap.killTweensOf(state.openings);
  gsap.killTweensOf(state.heights);
  rows.forEach((r, i) => {
    r.toggle.setAttribute("aria-expanded", String(i === selected));
    r.detail.inert = i !== selected;
  });
  const heights = rowHeights(world.clientHeight, selected),
    duration = instant || reduced() ? 0 : selected < 0 ? 0.6 : 0.75;
  gsap.to(state.openings, {
    ...Object.fromEntries(rows.map((_, i) => [i, i === selected ? 1 : 0])),
    duration,
    ease: "power3.inOut",
    onUpdate: paintRows,
    overwrite: true,
  });
  if (desktop)
    gsap.to(state.heights, {
      ...Object.fromEntries(heights.map((h, i) => [i, h])),
      duration,
      ease: "power3.inOut",
      onUpdate: paintRows,
      overwrite: true,
    });
}
function clearSelection() {
  selected = -1;
  gsap.killTweensOf(state.openings);
  gsap.killTweensOf(state.heights);
  rows.forEach((r, i) => {
    state.openings[i] = 0;
    r.toggle.setAttribute("aria-expanded", "false");
    r.detail.inert = true;
  });
  state.heights = Object.fromEntries(
    rowHeights(world.clientHeight, -1).map((h, i) => [i, h]),
  );
  paintRows();
}
export function resetPortfolio(isDesktop) {
  generation++;
  desktop = isDesktop;
  requested = false;
  failure = false;
  lastStage = "";
  renderer?.dispose();
  renderer = null;
  transition.replaceChildren();
  transition.style.visibility = "hidden";
  section.classList.toggle("is-active", !desktop);
  section.inert = desktop;
  section.style.visibility = "";
  section.style.opacity = "";
  document.getElementById("thesis").style.visibility = "";
  document.getElementById("biology").style.visibility = "";
  rows.forEach((r) => {
    r.el.style.top = "";
    r.el.style.height = "";
  });
  clearSelection();
}
function prepare() {
  if (requested || !desktop) return;
  requested = true;
  const version = generation;
  import("./portfolio-ribbons.js")
    .then(({ createRibbonRenderer }) =>
      createRibbonRenderer(transition, artwork, () => {
        failure = true;
        transition.style.visibility = "hidden";
        syncPortfolio(currentTime, entryStart, entryEnd, exitStart);
      }),
    )
    .then((instance) => {
      if (version !== generation) {
        instance.dispose();
        return;
      }
      renderer = instance;
      renderer.layout(transitionHeight);
      lastStage = "";
      syncPortfolio(currentTime, entryStart, entryEnd, exitStart);
    })
    .catch((error) => {
      failure = true;
      console.warn("Atlas portfolio uses its accessible flat reveal:", error);
    });
}
export function appendPortfolio(tl, H, start = 33.2, end = 37.2, out = 39.7) {
  transitionHeight = H;
  entryStart = start;
  entryEnd = end;
  exitStart = out;
  tl.set("#companies", { opacity: 1, backgroundColor: "transparent" }, 0);
  tl.fromTo(
    ".company-toolbar,.company-outro",
    { opacity: 0, y: 12 },
    { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" },
    end - 0.38,
  );
  tl.to({}, { duration: out - start }, start);
  tl.to(
    "#company-world",
    { y: -H * 0.065, opacity: 0, duration: 0.8, ease: "power2.inOut" },
    out,
  );
  tl.to(
    ".company-toolbar,.company-outro",
    { opacity: 0, y: -18, duration: 0.5, ease: "power2.in" },
    out,
  );
  tl.to("#companies", { opacity: 0, duration: 0.4, ease: "none" }, out + 0.55);
  [0.01, 0.22, 0.5, 0.86, 1].forEach((p, i) =>
    tl.addLabel("portfolio-turn-" + (i + 1), start + (end - start) * p),
  );
}
export function syncPortfolio(
  time,
  start = entryStart,
  end = entryEnd,
  out = exitStart,
) {
  currentTime = time;
  entryStart = start;
  entryEnd = end;
  exitStart = out;
  if (!desktop) return;
  if (time >= 24 && time < out + 1) prepare();
  const p = clamp((time - start) / (end - start)),
    stage =
      time < start
        ? "before"
        : time < end
          ? "turn"
          : time < out + 1
            ? "index"
            : "after";
  section.dataset.transition = stage;
  section.dataset.progress = p.toFixed(4);
  section.inert = stage !== "index";
  section.classList.toggle("is-active", stage === "index");
  if (stage !== lastStage) {
    if (stage !== "index" && selected !== -1) clearSelection();
    lastStage = stage;
  }
  const thesis = document.getElementById("thesis"),
    biology = document.getElementById("biology");
  if (stage === "before") {
    thesis.style.visibility = "";
    biology.style.visibility = "";
    section.style.visibility = "hidden";
    transition.style.visibility = "hidden";
  } else if (stage === "turn" && renderer && !failure) {
    renderer.capture();
    renderer.draw(p);
    thesis.style.visibility = "hidden";
    biology.style.visibility = "hidden";
    section.style.visibility = "hidden";
    transition.style.visibility = "visible";
    section.style.clipPath = "";
  } else if (stage === "turn") {
    thesis.style.visibility = p < 0.5 ? "" : "hidden";
    biology.style.visibility = p < 0.5 ? "" : "hidden";
    section.style.visibility = p >= 0.5 ? "visible" : "hidden";
    transition.style.visibility = "hidden";
    section.style.clipPath = `inset(${(1 - smooth(0.4, 1, p)) * 100}% 0 0)`;
  } else {
    thesis.style.visibility = "hidden";
    biology.style.visibility = "hidden";
    transition.style.visibility = "hidden";
    section.style.visibility = stage === "index" ? "visible" : "hidden";
    section.style.clipPath = "";
  }
}
