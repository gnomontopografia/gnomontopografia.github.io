'use strict';
// Completar con el ID de 11 caracteres del video cuando esté listo.
const youtubeVideoId = '';
const slot = document.getElementById('video-slot');
if (/^[A-Za-z0-9_-]{11}$/.test(youtubeVideoId)) {
  const button = document.createElement('button');
  button.className = 'button';
  button.textContent = 'Ver video en YouTube';
  button.addEventListener('click', () => {
    const frame = document.createElement('iframe');
    frame.title = 'Introducción a Nivelación Topográfica — Gnomon';
    frame.src = 'https://www.youtube-nocookie.com/embed/' + youtubeVideoId;
    frame.allow = 'encrypted-media; picture-in-picture; fullscreen';
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.allowFullscreen = true;
    slot.replaceChildren(frame);
    slot.classList.add('loaded');
  });
  slot.replaceChildren(button);
}
const toc = document.getElementById('indice');
const smallScreen = window.matchMedia('(max-width: 760px)');
function sizeIndex() { toc.open = !smallScreen.matches; }
sizeIndex();
smallScreen.addEventListener('change', sizeIndex);
toc.addEventListener('click', (event) => {
  if (smallScreen.matches && event.target.closest('a')) toc.open = false;
});
document.querySelector('.header-actions a').addEventListener('click', () => { toc.open = true; });
document.getElementById('print').addEventListener('click', () => window.print());
let previouslyOpen = [];
window.addEventListener('beforeprint', () => {
  previouslyOpen = [...document.querySelectorAll('details')].filter(d => d.open);
  document.querySelectorAll('details').forEach(d => { d.open = true; });
});
window.addEventListener('afterprint', () => {
  document.querySelectorAll('details').forEach(d => { d.open = previouslyOpen.includes(d); });
});
const links = [...document.querySelectorAll('nav a')];
const observer = new IntersectionObserver((entries) => {
  const visible = entries.filter(entry => entry.isIntersecting);
  if (!visible.length) return;
  links.forEach(link => {
    if (link.hash === '#' + visible[0].target.id) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}, {rootMargin: '-10% 0px -60% 0px'});
document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
