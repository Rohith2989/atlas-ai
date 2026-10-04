import './scrollbar.css';

// Keep native scrolling, dragging and keyboard behavior. Only the colors change.
export function mountScrollbar() {
  const root = document.documentElement;
  const people = document.getElementById('people');
  let pinned = false;
  let frame = 0;
  function refresh() {
    frame = 0;
    if (!pinned) {
      root.classList.toggle('scroll-field', people.getBoundingClientRect().top <= innerHeight * .15);
    }
  }
  function schedule() {
    if (!pinned && !frame) frame = requestAnimationFrame(refresh);
  }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  document.addEventListener('atlas:intro-end', schedule);
  return {
    setPinned(value) { pinned = value; refresh(); },
    setScene(isField) { if (pinned) root.classList.toggle('scroll-field', isField); },
  };
}
