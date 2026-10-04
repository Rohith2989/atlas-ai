import gsap from 'gsap';
import './closing.css';

// This is a contact handoff, by request. No visitor data is collected here.
export function mountClosing() {
  document.querySelector('[data-copyright-year]').textContent = new Date().getFullYear();

  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.from('.contact-heading h2, .contact-intro', {
      y: 26,
      opacity: .25,
      stagger: .12,
      ease: 'none',
      scrollTrigger: { trigger: '#contact', start: 'top 85%', end: 'top 35%', scrub: .5 },
    });
    gsap.from('.contact-invitation', {
      y: 38,
      ease: 'none',
      scrollTrigger: { trigger: '#contact', start: 'top 85%', end: 'top 30%', scrub: .5 },
    });
    gsap.fromTo('.footer-wordmark', { yPercent: 28, '--mark-light': '120%' }, {
      yPercent: 0,
      '--mark-light': '-20%',
      ease: 'none',
      scrollTrigger: { trigger: '.footer-wordmark-window', start: 'top 95%', end: 'bottom 90%', scrub: .7 },
    });
  });
}
