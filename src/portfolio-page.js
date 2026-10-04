import gsap from "gsap";
import { companies } from "./company-data.js";
import {
  facets,
  optionsFor,
  emptyFilters,
  readFilters,
  writeFilters,
  filterCompanies,
  countOption,
} from "./portfolio-filters.js";
import "./portfolio-page.css";
import "./closing.css";
import "./scrollbar.css";

const $ = (selector) => document.querySelector(selector);
const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const list = $("#portfolio-list");
const search = $(".portfolio-search input");
const chips = $(".filter-chips");
let state = readFilters(location.search, companies);
let expanded = null;
let searchTimer;
const rows = new Map();
const controls = new Map();
const artwork = {
  "civils-ai": "/assets/material-intelligence.webp",
  bioleap: "/assets/optical-specimen.webp",
  "8x": "/portfolio/8x-brand-v3.svg",
};

for (const { key, label } of facets) {
  const details = document.createElement("details");
  details.className = "facet";
  details.innerHTML = `<summary><span>${label}<b class="selection-count" hidden></b></span><i class="facet-chevron" aria-hidden="true"></i></summary><div class="facet-panel"><fieldset><legend class="sr-only">${label}</legend>${optionsFor(
    companies,
    key,
  )
    .map(
      (value) =>
        `<label class="facet-option"><input type="checkbox" value="${escape(value)}" /><span>${escape(value)}</span><small aria-hidden="true"></small></label>`,
    )
    .join(
      "",
    )}</fieldset><div class="facet-footer"><button type="button" class="facet-clear">Clear ${label.toLowerCase()}</button><button type="button" class="facet-done">Done</button></div></div>`;
  $(".filter-controls").append(details);
  controls.set(key, details);
  // Close siblings synchronously so a fast second click cannot race queued toggle events.
  details.querySelector("summary").addEventListener("click", () => {
    for (const other of controls.values())
      if (other !== details) other.open = false;
  });
  details.addEventListener("change", (event) => {
    if (!(event.target instanceof HTMLInputElement)) return;
    clearTimeout(searchTimer);
    state.q = search.value.trim();
    state[key] = [...details.querySelectorAll("input:checked")].map(
      (input) => input.value,
    );
    render({ updateURL: true });
  });
  details.querySelector(".facet-clear").addEventListener("click", () => {
    state[key] = [];
    render({ updateURL: true });
  });
  details
    .querySelector(".facet-done")
    .addEventListener("click", () => closeFilter(details));
}

for (const company of companies) {
  const c = Object.fromEntries(
    Object.entries(company)
      .filter(([, value]) => typeof value === "string")
      .map(([key, value]) => [key, escape(value)]),
  );
  const article = document.createElement("article");
  article.className = "ribbon-company";
  article.id = `company-${company.id}`;
  const image = escape(artwork[company.id] || company.cover);
  article.innerHTML = `<h2><button class="ribbon-toggle" id="toggle-${c.id}" type="button" aria-expanded="false" aria-controls="details-${c.id}" aria-label="Unfold ${c.name}"><span class="entry-number">${String(company.order + 1).padStart(2, "0")}</span><img class="entry-thumbnail" src="${image}" alt="" width="134" height="112" loading="lazy" decoding="async" /><span class="entry-name">${c.name}</span><span class="entry-industry">${c.industry}</span><span class="entry-country">${c.country}${c.status === "Exited" ? "<small>Exited</small>" : ""}</span><span class="ribbon-handle" aria-hidden="true"><i class="handle-face"></i></span></button></h2>
    <div class="ribbon-expansion" id="details-${c.id}" role="region" aria-labelledby="toggle-${c.id}" inert><div class="ribbon-expansion-inner"><div class="ribbon-spread"><div class="spread-copy"><div class="spread-top"><img class="spread-logo" src="${c.logo}" alt="${c.name} logo" width="150" height="45" loading="lazy" decoding="async" /><span class="spread-status">${c.status}</span></div><p class="spread-description">${c.description}</p><dl class="spread-facts"><div><dt>Based in</dt><dd>${c.country}</dd></div><div><dt>Stage</dt><dd>${c.stage}</dd></div><div><dt>Venture builder</dt><dd>${company.builders.map(escape).join(" · ")}</dd></div></dl><div class="spread-links"><a href="${c.website}" target="_blank" rel="noopener noreferrer">Visit ${c.name} <span aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span></a><a href="${c.url}" target="_blank" rel="noopener noreferrer">Atlas profile <span aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span></a></div></div><div class="spread-art"><img src="${image}" alt="${escape(company.artwork?.alt || `${company.name} portfolio artwork`)}" width="1536" height="1024" loading="lazy" decoding="async" /><span class="art-wing art-wing-left" aria-hidden="true"></span><span class="art-wing art-wing-right" aria-hidden="true"></span><span class="art-caption" aria-hidden="true">${c.name.toUpperCase()} / ATLAS</span></div></div></div></div>`;
  list.append(article);
  rows.set(company.id, article);
  article
    .querySelector(".ribbon-toggle")
    .addEventListener("click", () => toggleCompany(company.id));
  article
    .querySelector(".ribbon-expansion")
    .addEventListener("transitionend", (event) => {
      if (
        event.target !== event.currentTarget ||
        event.propertyName !== "grid-template-rows" ||
        expanded !== company.id
      )
        return;
      alignExpanded(article);
    });
  article.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && expanded === company.id) {
      event.preventDefault();
      setExpanded(company.id, false);
      article.querySelector(".ribbon-toggle").focus({ preventScroll: true });
    }
  });
}

function setExpanded(id, open) {
  const row = rows.get(id);
  row.classList.toggle("is-open", open);
  row
    .querySelector(".ribbon-toggle")
    .setAttribute("aria-expanded", String(open));
  row
    .querySelector(".ribbon-toggle")
    .setAttribute(
      "aria-label",
      `${open ? "Fold" : "Unfold"} ${companies.find((c) => c.id === id).name}`,
    );
  row.querySelector(".ribbon-expansion").inert = !open;
  if (open) expanded = id;
  else if (expanded === id) expanded = null;
}

function toggleCompany(id) {
  const wasOpen = expanded === id;
  if (expanded) setExpanded(expanded, false);
  if (!wasOpen) {
    setExpanded(id, true);
    if (reduced.matches) alignExpanded(rows.get(id));
  }
}

function alignExpanded(row) {
  // Keep the selected sheet in view after another sheet above it has folded away.
  const { top, bottom } = row.getBoundingClientRect();
  const dockHeight = matchMedia("(min-width:701px)").matches
    ? $(".filter-dock").offsetHeight
    : 0;
  if (top < dockHeight || bottom > innerHeight) {
    window.scrollTo({
      top: scrollY + top - dockHeight - 12,
      behavior: reduced.matches ? "instant" : "smooth",
    });
  }
}

function closeFilter(details) {
  details.open = false;
  details.querySelector("summary").focus({ preventScroll: true });
}

function render({ updateURL = false, animate = true } = {}) {
  const oldPositions = new Map(
    [...rows]
      .filter(([, row]) => !row.hidden)
      .map(([id, row]) => [id, row.getBoundingClientRect().top]),
  );
  const visible = filterCompanies(companies, state);
  const ids = new Set(visible.map((c) => c.id));
  if (expanded && !ids.has(expanded)) setExpanded(expanded, false);
  gsap.killTweensOf([...rows.values()]);
  for (const [id, row] of rows) {
    row.hidden = !ids.has(id);
    gsap.set(row, { clearProps: "transform,opacity" });
  }
  if (animate && !reduced.matches) {
    let delay = 0;
    for (const company of visible) {
      const row = rows.get(company.id),
        top = row.getBoundingClientRect().top;
      if (top > innerHeight + 100 || top < -500) continue;
      const previous = oldPositions.get(company.id);
      const distance =
        previous === undefined
          ? 22
          : Math.max(-180, Math.min(180, previous - top));
      gsap.fromTo(
        row,
        { y: distance, opacity: previous === undefined ? 0 : 1 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          delay: Math.min(delay++ * 0.035, 0.18),
          ease: "power3.out",
          clearProps: "transform,opacity",
        },
      );
    }
  }
  $("#result-number").textContent = visible.length.toString().padStart(2, "0");
  $("#result-label").textContent =
    visible.length === companies.length
      ? " companies"
      : ` of ${companies.length} companies`;
  $(".portfolio-empty").hidden = visible.length > 0;
  $(".ledger-heading").hidden = visible.length === 0;
  for (const { key } of facets) {
    const control = controls.get(key);
    const badge = control.querySelector(".selection-count");
    badge.hidden = !state[key].length;
    badge.textContent = state[key].length;
    control.classList.toggle("has-selection", !!state[key].length);
    for (const input of control.querySelectorAll("input")) {
      const count = countOption(companies, state, key, input.value);
      input.checked = state[key].includes(input.value);
      input.disabled = !count && !input.checked;
      input.closest("label").querySelector("small").textContent = count;
    }
  }
  chips.replaceChildren();
  const addChip = (label, remove) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "filter-chip";
    button.setAttribute("aria-label", `Remove ${label} filter`);
    button.append(document.createTextNode(label));
    const cross = document.createElement("span");
    cross.textContent = "×";
    cross.setAttribute("aria-hidden", "true");
    button.append(cross);
    button.addEventListener("click", () => {
      remove();
      render({ updateURL: true });
      (chips.querySelector("button") || search).focus({ preventScroll: true });
    });
    chips.append(button);
  };
  if (state.q)
    addChip(`“${state.q}”`, () => {
      state.q = "";
      search.value = "";
    });
  for (const { key } of facets)
    for (const value of state[key])
      addChip(value, () => {
        state[key] = state[key].filter((v) => v !== value);
      });
  $(".active-filter-line").hidden = chips.childElementCount === 0;
  if (updateURL) {
    const query = writeFilters(state);
    const url = `${location.pathname}${query ? `?${query}` : ""}${location.hash}`;
    if (url !== `${location.pathname}${location.search}${location.hash}`)
      history.pushState(null, "", url);
  }
}

function reset() {
  clearTimeout(searchTimer);
  state = emptyFilters();
  search.value = "";
  render({ updateURL: true });
  search.focus({ preventScroll: true });
}
$(".clear-filters").addEventListener("click", reset);
$("[data-reset-empty]").addEventListener("click", reset);
search.addEventListener("input", () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    state.q = search.value.trim();
    render({ updateURL: true });
  }, 180);
});
document.addEventListener("click", (event) => {
  for (const details of controls.values())
    if (!details.contains(event.target)) details.open = false;
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape")
    for (const details of controls.values())
      if (details.open) {
        event.preventDefault();
        closeFilter(details);
      }
  if (
    event.key === "/" &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.altKey &&
    !event.target.closest("input, textarea, [contenteditable]")
  ) {
    event.preventDefault();
    search.focus();
  }
});
addEventListener("popstate", () => {
  clearTimeout(searchTimer);
  state = readFilters(location.search, companies);
  search.value = state.q;
  render();
});
search.value = state.q;
render({ animate: false });
$("[data-copyright-year]").textContent = new Date().getFullYear();

// Entry is a brief unfolding gesture. The portfolio itself always uses native scroll.
const motion = gsap.matchMedia();
motion.add("(prefers-reduced-motion: no-preference)", () => {
  gsap.from(".sculpture-strip", {
    rotateX: -67,
    rotateY: 15,
    y: 35,
    opacity: 0,
    duration: 1.25,
    stagger: 0.12,
    ease: "power3.out",
    clearProps: "transform,opacity",
  });
  gsap.from(".portfolio-heading > *", {
    y: 18,
    opacity: 0,
    duration: 0.8,
    stagger: 0.09,
    ease: "power3.out",
    clearProps: "transform,opacity",
  });
  const observer = new IntersectionObserver(
    (entries) => {
      const reveal = entries
        .filter((entry) => entry.isIntersecting)
        .map((entry) => entry.target);
      if (!reveal.length) return;
      gsap.fromTo(
        reveal,
        { opacity: 0.4, rotateX: -18, y: 18, transformOrigin: "50% 0%" },
        {
          opacity: 1,
          rotateX: 0,
          y: 0,
          duration: 0.8,
          stagger: 0.045,
          ease: "power3.out",
          clearProps: "transform,opacity",
        },
      );
      reveal.forEach((row) => observer.unobserve(row));
    },
    { rootMargin: "0px 0px -20px 0px" },
  );
  rows.forEach((row) => observer.observe(row));
  return () => observer.disconnect();
});
