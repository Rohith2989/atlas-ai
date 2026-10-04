import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "./styles.css";
gsap.registerPlugin(ScrollTrigger);
const root = document.documentElement;
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const canvas = document.createElement("canvas").getContext("2d");
let timeline, trigger, context, lenis, resizeTimer;
let lastWidth = 0,
  lastHeight = 0;
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
    scale = innerWidth / 1600,
    H = innerHeight / scale;
  art.style.setProperty("--art-height", H + "px");
  art.style.transform = desktop ? "scale(" + scale + ")" : "none";
  document.getElementById("people").inert = false;
  document.getElementById("thesis").inert = false;
  document.getElementById("explore").inert = false;
  strips();
  fitType();
  if (!desktop) {
    document
      .querySelectorAll(".strip")
      .forEach((s) => (s.style.display = "none"));
    return;
  }
  const y = (n) => (n * H) / 1000;
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
      { backgroundColor: "#FF5D35", duration: 2.5, ease: "sine.inOut" },
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
    tl.to({}, { duration: 2 }, 32);
    tl.addLabel("hero", 0)
      .addLabel("people", 16.5)
      .addLabel("thesis", 29)
      .addLabel("companies", 33);
    trigger = ScrollTrigger.create({
      trigger: "#viewport",
      pin: true,
      animation: tl,
      start: "top top",
      end: () => "+=" + innerHeight * 9.5,
      scrub: 0.55,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate(self) {
        const t = self.progress * tl.duration();
        document.getElementById("thesis").inert = t < 18.4;
        document.getElementById("people").inert = t < 10 || t > 21;
        document.getElementById("explore").inert = t > 6;
      },
    });
    tl.time(previous ? previous * tl.duration() : 2.5);
  });
  ScrollTrigger.refresh();
}
function navigate(a, event) {
  if (!trigger) return;
  const label = a.dataset.scene;
  event.preventDefault();
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
        lastWidth = innerWidth;
        lastHeight = innerHeight;
        build();
      }, 180);
    });
    lastWidth = innerWidth;
    lastHeight = innerHeight;
    reduced.addEventListener("change", () => location.reload());
    window.addEventListener("load", () => ScrollTrigger.refresh(), {
      once: true,
    });
  })
  .catch(() => root.classList.remove("motion-ready"));
