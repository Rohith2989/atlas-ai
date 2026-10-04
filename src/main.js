import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "./styles.css";
import { mountPortfolio, layoutPortfolio, setActiveCompany, currentCompany, featured } from './portfolio';
import { mountApproach, appendApproach, syncApproach, resetApproach, approachStops, approachNames } from './approach';
gsap.registerPlugin(ScrollTrigger);
const root = document.documentElement;
// Browser hash restoration must not scroll the nested, pinned artboard itself.
history.scrollRestoration = 'manual';
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const canvas = document.createElement("canvas").getContext("2d");
let timeline, trigger, context, lenis, resizeTimer;
let lastWidth = 0,
  lastHeight = 0;
const galleryStart = 35.6, galleryDuration = 9;
const approachStart = galleryStart + galleryDuration + 2.4;
mountPortfolio();
mountApproach();
function fitType() {
  canvas.font = "900 500px Bodoni";
  canvas.letterSpacing = "-7.5px";
  canvas.wordSpacing = "65px";
  document.querySelectorAll(".ink").forEach((el) => {
    const slot = el.closest(".type-space"),
      m = canvas.measureText(el.textContent),
      cap = Math.max(1, m.actualBoundingBoxAscent + m.actualBoundingBoxDescent);
    const asc = m.fontBoundingBoxAscent || 450,
      desc = m.fontBoundingBoxDescent || 125;
    const top = (cap - asc - desc) / 2 + asc - m.actualBoundingBoxAscent;
    const width = Math.max(
      1,
      m.actualBoundingBoxLeft + m.actualBoundingBoxRight,
    );
    const sx = (slot.clientWidth - 5) / width,
      sy = (slot.clientHeight - 5) / cap;
    Object.assign(el.style, {
      fontSize: "500px",
      width: width + "px",
      height: cap + "px",
      lineHeight: cap + "px",
      transform: "scale(" + sx + "," + sy + ")",
      top: -top * sy + "px",
      left: m.actualBoundingBoxLeft * sx + "px",
    });
  });
}
function strips() {
  document.querySelectorAll(".portrait").forEach((p) => {
    const box = p.querySelector(".portrait-image"),
      original = box.querySelector(".portrait-flat");
    box.querySelectorAll(".strip").forEach((s) => s.remove());
    for (let i = 0; i < 6; i++) {
      const row = document.createElement("div");
      row.className = "strip";
      row.style.top = (i * 100) / 6 + "%";
      const img = document.createElement("img");
      img.src = original.getAttribute("src");
      img.alt = "";
      img.style.top = -i * 100 + "%";
      row.appendChild(img);
      box.appendChild(row);
    }
  });
}
function build() {
  const desktop = innerWidth >= 900 && !reduced.matches;
  const previous = trigger?.progress || 0;
  if (trigger) trigger.kill();
  if (context) context.revert();
  trigger = null;
  document
    .querySelectorAll("#artboard [style],.header[style]")
    .forEach((el) => el.removeAttribute("style"));
  root.classList.toggle("motion-ready", desktop);
  const art = document.getElementById("artboard"),
    scale = document.documentElement.clientWidth / 1600,
    H = innerHeight / scale;
  art.style.setProperty("--art-height", H + "px");
  art.style.transform = desktop ? "scale(" + scale + ")" : "none";
  document.getElementById("people").inert = false;
  document.getElementById("thesis").inert = false;
  document.getElementById("companies").inert = false;
  document.getElementById("explore").inert = false;
  document.getElementById('hero').inert=false;
  document.querySelectorAll('.company-frame').forEach(e=>e.inert=false);
  resetApproach();
  strips();
  fitType();
  if (!desktop) {
    document
      .querySelectorAll(".strip")
      .forEach((s) => (s.style.display = "none"));
    return;
  }
  const y = (n) => (n * H) / 1000;
  layoutPortfolio(H);
  document.getElementById('people').inert=true;
  document.getElementById('thesis').inert=true;
  document.getElementById('companies').inert=true;
  context = gsap.context(() => {
    timeline = gsap.timeline({ paused: true });
    const tl = timeline;
    tl.set(
      "#architecture",
      { left: "5.25%", top: "9.1%", width: "61.625%", height: "32.4%" },
      0,
    );
    tl.set(
      "#optics",
      { left: "46.25%", top: "67%", width: "21.625%", height: "43%" },
      0,
    );
    tl.set(
      "#biology",
      { left: "79.25%", top: "9%", width: "20.75%", height: "56%" },
      0,
    );
    tl.set("#people", { y: 0 }, 0);
    tl.set("#people .portrait-flat", { opacity: 0 }, 0);
    tl.set("#people .strip", { clipPath: "inset(0 100% 0 0)" }, 0);
    tl.set("#hero-main,#hero-sub", { clipPath: "inset(0)" }, 0);
    tl.to({}, { duration: 2.5 }, 0);
    tl.to(
      "#substrate i",
      {
        clipPath: "inset(0% 0 0 0)",
        duration: 3.18,
        stagger: 0.085,
        ease: "power3.inOut",
      },
      3,
    );
    tl.to(
      ".header",
      { backgroundColor: "#256C50", color: "#F3F1E3", duration: 2.5, ease: "sine.inOut" },
      3.8,
    );
    tl.to(
      "#hero-main .type-move",
      { y: y(-430), duration: 1.5, ease: "power3.in" },
      3.25,
    );
    tl.to(
      "#hero-sub .type-move",
      { y: y(-170), duration: 1.05, ease: "power2.in" },
      3.65,
    );
    tl.to(
      "#hero-copy,#hero-companies,#explore",
      { y: y(-45), opacity: 0, duration: 0.52, ease: "power1.in" },
      3.15,
    );
    tl.to(
      "#architecture",
      {
        left: "40.625%",
        top: "-3.5%",
        width: "59.375%",
        height: "28.6%",
        duration: 3.6,
        ease: "power2.inOut",
      },
      3,
    );
    tl.to(
      "#biology",
      {
        left: "3.5%",
        top: "26.3%",
        width: "62.5%",
        height: "35.5%",
        duration: 3.6,
        ease: "power3.inOut",
      },
      3,
    );
    tl.to(
      "#optics",
      {
        left: "72.5%",
        top: "33%",
        width: "23.75%",
        height: "53.5%",
        duration: 3.6,
        ease: "power3.inOut",
      },
      3,
    );
    tl.fromTo(
      "#conviction",
      { y: y(515), scaleX: 0.93, opacity: 0, clipPath: "inset(0 100% 0 0)" },
      {
        y: y(515),
        scaleX: 0.93,
        opacity: 1,
        clipPath: "inset(0)",
        duration: 0.75,
        ease: "power4.out",
      },
      6.65,
    );
    tl.fromTo(
      "#wild",
      { opacity: 0, clipPath: "inset(0 100% 0 0)" },
      { opacity: 1, clipPath: "inset(0)", duration: 0.58, ease: "expo.out" },
      6.92,
    );
    tl.to(
      "#architecture",
      { top: "-52%", duration: 2.4, ease: "power3.inOut" },
      9.6,
    );
    tl.to("#optics", { top: "-82%", duration: 2.4, ease: "power3.inOut" }, 9.6);
    tl.to(
      "#biology",
      {
        left: "92%",
        top: "0%",
        width: "8%",
        height: "52%",
        duration: 2.4,
        ease: "power3.inOut",
      },
      9.6,
    );
    tl.to(
      "#wild .type-move",
      { y: y(-165), duration: 0.7, ease: "power2.in" },
      10.1,
    );
    tl.to(
      "#conviction",
      { y: 0, scaleX: 1, duration: 1.25, ease: "power3.inOut" },
      10.5,
    );
    tl.fromTo(
      "#human",
      { opacity: 0, clipPath: "inset(0 100% 0 0)" },
      { opacity: 1, clipPath: "inset(0)", duration: 0.7, ease: "power4.out" },
      10.8,
    );
    tl.to("#people-kicker", { opacity: 1, duration: 0.4 }, 11.46);
    const order = [2, 3, 1, 4, 0, 5],
      offsets = [-46, 35, -31, 52, -27, 42];
    document.querySelectorAll(".portrait").forEach((p, index) => {
      const at = 11.8 + index * 0.32;
      tl.fromTo(
        p.querySelector(".portrait-image"),
        { y: y(35) },
        { y: 0, duration: 1.15, ease: "power2.out" },
        at,
      );
      p.querySelectorAll(".strip").forEach((s, i) => {
        const t = at + order.indexOf(i) * 0.055;
        tl.fromTo(
          s,
          {
            clipPath:
              offsets[i] > 0 ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)",
          },
          { clipPath: "inset(0)", duration: 0.72, ease: "power4.out" },
          t,
        );
        tl.fromTo(
          s.querySelector("img"),
          { x: offsets[i] },
          { x: 0, duration: 0.72, ease: "power4.out" },
          t,
        );
      });
      tl.to(
        p.querySelector(".portrait-flat"),
        { opacity: 1, duration: 0.01 },
        at + 1.08,
      );
      tl.to(
        p.querySelectorAll(".strip"),
        { opacity: 0, duration: 0.01 },
        at + 1.09,
      );
      tl.to(
        p.querySelector("figcaption"),
        { opacity: 1, duration: 0.43, ease: "power2.out" },
        at + 1.2,
      );
    });
    tl.fromTo(
      "#people .sheen",
      { backgroundPosition: "100% 50%" },
      {
        backgroundPosition: "0% 50%",
        duration: 1.1,
        stagger: 0.17,
        ease: "sine.inOut",
      },
      14.15,
    );
    tl.to("#people", { y: y(-1100), duration: 3, ease: "power2.inOut" }, 18);
    tl.set("#thesis", { opacity: 1 }, 18.4);
    tl.fromTo(
      "#edge",
      { y: y(620), opacity: 0 },
      { y: 0, opacity: 1, duration: 2.1, ease: "power3.out" },
      18.7,
    );
    tl.fromTo(
      "#deep",
      { y: y(500), opacity: 0 },
      { y: 0, opacity: 1, duration: 2.1, ease: "power3.out" },
      19.2,
    );
    tl.to(
      "#biology",
      {
        left: "42.5%",
        top: "44.8%",
        width: "22.2%",
        height: "14.5%",
        duration: 2.4,
        ease: "power2.inOut",
      },
      19,
    );
    tl.fromTo("#science", { opacity: 0 }, { opacity: 1, duration: 0.3 }, 21);
    tl.set("#science .image-window", { clipPath: "inset(47% 0 47% 0)" }, 0);
    tl.to("#edge", { y: y(-450), duration: 2, ease: "power3.inOut" }, 23);
    tl.to("#deep", { y: y(440), duration: 2, ease: "power3.inOut" }, 23);
    tl.to(
      "#science .image-window",
      { clipPath: "inset(0%)", duration: 2.5, ease: "power3.inOut" },
      23.2,
    );
    tl.to(
      "#biology",
      {
        left: "92%",
        top: "8.5%",
        width: "8%",
        height: "43%",
        duration: 2.4,
        ease: "power3.inOut",
      },
      23,
    );
    tl.to(
      "#thesis-copy",
      { opacity: 1, duration: 1.2, ease: "power2.out" },
      24.4,
    );
    tl.to(
      "#edge",
      {
        top: "13.6%",
        y: 0,
        scaleX: 0.565,
        scaleY: 0.64,
        duration: 2.2,
        ease: "power3.inOut",
      },
      26,
    );
    tl.to(
      "#deep",
      {
        top: "31.6%",
        y: 0,
        scaleX: 0.607,
        scaleY: 0.64,
        duration: 2.2,
        ease: "power3.inOut",
      },
      26.1,
    );
    tl.to(
      "#science",
      { top: "16.6%", height: "56.4%", duration: 2.2, ease: "power3.inOut" },
      26,
    );
    tl.to("#thesis-kicker", { opacity: 1, duration: 0.7 }, 27.8);
    tl.to(
      "#criteria span",
      { opacity: 1, duration: 0.8, stagger: 0.45, ease: "power2.out" },
      28.1,
    );
    tl.fromTo(
      "#material",
      { opacity: 0 },
      { opacity: 1, top: "67.5%", duration: 2.4, ease: "power3.out" },
      28.7,
    );
    tl.fromTo(
      "#material .image-window",
      { clipPath: "inset(0 0 100% 0)" },
      { clipPath: "inset(0%)", duration: 2.4, ease: "power3.out" },
      28.7,
    );
    tl.to("#science figcaption", { opacity: 1, duration: 0.7 }, 29.1);
    tl.to(
      "#material figcaption,#all-companies",
      { opacity: 1, duration: 0.7, stagger: 0.2 },
      31.1,
    );
    tl.to({}, { duration: 1.2 }, 32);
    // Preserve coordinates as the thesis photographs join the moving portfolio.
    tl.to('#edge,#deep,#thesis-copy,#criteria,#thesis-kicker,#all-companies', {y:'-=65',opacity:0,duration:1.8,stagger:.07,ease:'power2.in'},33.2);
    tl.set('#companies', {opacity:1},34.4);
    tl.set('#science,#material', {opacity:0},34.4);
    tl.to('#biology', {x:750,y:-H*.45,opacity:0,duration:2,ease:'power2.in'},33.7);
    tl.fromTo('.company-toolbar,.company-sequence', {opacity:0,y:18}, {opacity:1,y:0,duration:1.15,stagger:.15,ease:'power3.out'},35);
    tl.to('#company-world', {x:-(featured.length-2)*660,y:-(featured.length-2)*H*.30,duration:galleryDuration,ease:'none'},galleryStart);
    // Settle on 8x before carrying its diagonal into the portrait's grain reveal.
    tl.to({}, {duration:2.4}, galleryStart + galleryDuration);
    const finalX=-(featured.length-2)*660, finalY=-(featured.length-2)*H*.30;
    tl.set('#companies',{backgroundColor:'transparent'},approachStart);
    tl.to('.header',{backgroundColor:'rgba(37,108,80,0)',duration:.4,ease:'none'},approachStart+.4);
    tl.to('#company-world',{x:finalX-280,y:finalY-H*.52,opacity:0,duration:1.15,ease:'power2.inOut'},approachStart);
    tl.to('.company-toolbar,.company-sequence',{opacity:0,y:-18,duration:.65,ease:'power2.in'},approachStart);
    tl.to('#companies',{opacity:0,duration:.45,ease:'sine.inOut'},approachStart+.7);
    appendApproach(tl,H,approachStart);
    tl.eventCallback('onUpdate',()=>syncApproach(tl.time(),approachStart));
    tl.addLabel("hero", 0)
      .addLabel("people", 16.5)
      .addLabel("thesis", 32)
      .addLabel("companies", 35.5);
    trigger = ScrollTrigger.create({
      trigger: "#viewport",
      pin: true,
      animation: tl,
      start: "top top",
      end: () => "+=" + innerHeight * tl.duration() / 3.6,
      scrub: 0.55,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate(self) {
        const t = self.progress * tl.duration();
        document.getElementById("thesis").inert = t < 18.4 || t > 34.4;
        document.getElementById("people").inert = t < 10 || t > 21;
        document.getElementById("explore").inert = t > 6;
        document.getElementById('hero').inert=t>6;
        const galleryActive=t>=34.4 && t<approachStart+1.3;
        document.getElementById('companies').inert=!galleryActive;
        document.getElementById('companies').classList.toggle('is-active',galleryActive);
        if(galleryActive) setActiveCompany(1+Math.round(Math.max(0,Math.min(1,(t-galleryStart)/galleryDuration))*(featured.length-2)));
      },
    });
    tl.time(previous ? previous * tl.duration() : 2.5);
  });
  ScrollTrigger.refresh();
  if (previous && trigger && lenis) {
    lenis.resize();
    lenis.scrollTo(trigger.start + previous * (trigger.end - trigger.start), {immediate:true});
  }
}
function applyInitialScene() {
  const hash = location.hash.slice(1);
  if (!trigger) {
    const frame = /^approach-frame-([1-6])$/.exec(hash);
    const mobileId = frame ? 'approach-' + approachNames[Math.floor((Number(frame[1])-1)/2)] : hash;
    document.getElementById(mobileId)?.scrollIntoView({block:'start',behavior:'instant'});
    return;
  }
  const alias = [...document.querySelectorAll('[data-scene]')].find(a => a.getAttribute('href') === location.hash)?.dataset.scene;
  const name = Object.hasOwn(timeline?.labels || {}, hash) ? hash : alias;
  if (!trigger || !name || !Object.hasOwn(timeline.labels, name)) return;
  const time = timeline.labels[name];
  const destination = name === 'hero' ? 0 : trigger.start + time / timeline.duration() * (trigger.end - trigger.start);
  lenis.resize();
  lenis.scrollTo(destination, {immediate:true,force:true});
  timeline.time(time);
}
function goToCompany(direction) {
  if(!trigger) return;
  const index=Math.max(1,Math.min(featured.length-1,currentCompany()+direction));
  const time=galleryStart+(index-1)/(featured.length-2)*galleryDuration;
  lenis.scrollTo(trigger.start+time/timeline.duration()*(trigger.end-trigger.start),{duration:1.1});
}
function navigate(a, event) {
  if (!trigger) return;
  const label = a.dataset.scene;
  event.preventDefault();
  history.replaceState(null,'',a.getAttribute('href'));
  const destination =
    label === "hero"
      ? 0
      : trigger.start +
        (timeline.labels[label] / timeline.duration()) *
          (trigger.end - trigger.start);
  lenis.scrollTo(destination, { duration: 1.15 });
}
Promise.all([
  document.fonts.load("900 500px Bodoni"),
  document.fonts.load("500 18px Instrument"),
])
  .then(() => {
    if (!reduced.matches) {
      lenis = new Lenis({ duration: 1.05, smoothWheel: true, anchors: false });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    }
    build();
    applyInitialScene();
    // Restore again after the browser has painted ScrollTrigger's initial pin spacing.
    // A cold-load scroll can otherwise be clamped to the pre-pin document height.
    requestAnimationFrame(() => requestAnimationFrame(applyInitialScene));
    window.addEventListener('hashchange', applyInitialScene);
    document.querySelector('[data-company-prev]').addEventListener('click',()=>goToCompany(-1));
    document.querySelector('[data-company-next]').addEventListener('click',()=>goToCompany(1));
    document.querySelectorAll('[data-approach-stop]').forEach(b=>b.addEventListener('click',event=>{
      if(!trigger || !lenis)return;
      event.preventDefault();
      const index=Number(b.dataset.approachStop);
      const time=approachStart+approachStops[index];
      const name=approachNames[index];
      history.replaceState(null,'',`#approach-${name}`);
      lenis.scrollTo(trigger.start+time/timeline.duration()*(trigger.end-trigger.start),{duration:1.3});
    }));
    document.addEventListener('atlas:index',e=>{ if(lenis) e.detail?lenis.stop():lenis.start(); });
    if (!reduced.matches)
      gsap.fromTo(
        "#hero .sheen",
        { backgroundPosition: "100% 50%" },
        {
          backgroundPosition: "0% 50%",
          duration: 1.25,
          stagger: 0.15,
          delay: 0.6,
          ease: "sine.inOut",
        },
      );
    document
      .querySelectorAll("[data-scene]")
      .forEach((a) => a.addEventListener("click", (e) => navigate(a, e)));
    document
      .querySelector('a[href="#contact"]')
      .addEventListener("click", (e) => {
        if (lenis) {
          e.preventDefault();
          lenis.scrollTo("#contact", { duration: 1.15 });
        }
      });
    document.querySelector(".skip").addEventListener("click", (e) => {
      if (trigger) {
        e.preventDefault();
        lenis.scrollTo(
          trigger.start +
            (timeline.labels.thesis / timeline.duration()) *
              (trigger.end - trigger.start),
          { duration: 0.8 },
        );
      }
    });
    window.addEventListener("resize", () => {
      if (innerWidth === lastWidth && Math.abs(innerHeight - lastHeight) < 100)
        return;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const modeChanged = root.classList.contains('motion-ready') !== (innerWidth >= 900 && !reduced.matches);
        lastWidth = innerWidth;
        lastHeight = innerHeight;
        build();
        if (modeChanged) requestAnimationFrame(applyInitialScene);
      }, 180);
    });
    lastWidth = innerWidth;
    lastHeight = innerHeight;
    reduced.addEventListener("change", () => location.reload());
    window.addEventListener("load", () => { ScrollTrigger.refresh(); applyInitialScene(); }, {
      once: true,
    });
  })
  .catch(() => root.classList.remove("motion-ready"));
