import gsap from 'gsap';
import './portfolio.css';

const records = import.meta.glob('./data/companies/*.json', { eager: true, import: 'default' });
export const companies = Object.values(records).sort((a, b) => a.order - b.order);
const featuredIds = ['civils-ai', 'bioleap', 'zero-drift', 'tilki', 'sekkari', 'otee', 'mirron', 'imitation-machines', 'oscorp-energy', '8x'];
export const featured = featuredIds.map(id => companies.find(c => c.id === id));
const editorial = { 'civils-ai':'/assets/material-intelligence.webp', bioleap:'/assets/optical-specimen.webp' };
const sizes = [[600,.225],[435,.564],[570,.35],[570,.38],[340,.52],[510,.35],[420,.5],[520,.37],[430,.48],[500,.36]];
let active = -1;

export function mountPortfolio() {
  const world = document.getElementById('company-world');
  featured.forEach((c, i) => {
    const f = document.createElement('figure');
    f.className = 'company-frame';
    f.dataset.company = c.id;
    f.innerHTML = `<a class="company-image" href="${c.url}" target="_blank" rel="noopener noreferrer" aria-label="Discover ${c.name}"><img src="${editorial[c.id] || c.cover}" alt="${editorial[c.id] ? 'Editorial study' : 'Company imagery'} — ${c.name}" loading="lazy" decoding="async" width="900" height="650"><span class="image-visit" aria-hidden="true">↗</span></a><figcaption><a href="${c.url}" target="_blank" rel="noopener noreferrer">${c.name} ↗</a><span>${c.sector} · ${c.country}</span></figcaption>`;
    world.appendChild(f);
  });
  const dialog = document.getElementById('portfolio-index');
  const list = dialog.querySelector('.index-list');
  companies.forEach((c, i) => {
    const a = document.createElement('a');
    a.className = 'index-company';
    a.href = c.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.dataset.search = [c.name, c.sector, c.country, c.status].join(' ').toLowerCase();
    a.innerHTML = `<span class="index-number">${String(i+1).padStart(2,'0')}</span><img class="index-cover" src="${c.cover}" alt="" width="150" height="110" loading="lazy" decoding="async"><span class="index-detail"><strong>${c.name}</strong><span>${c.sector}</span></span><span class="index-country">${c.country}<small>${c.status === 'Exited' ? 'Exited' : 'In portfolio'}</small></span>${c.logo ? `<img class="index-logo" src="${c.logo}" alt="${c.name} logo" width="100" height="42" loading="lazy">` : '<span class="index-logo">8x</span>'}<span aria-hidden="true">↗</span>`;
    list.appendChild(a);
  });
  document.querySelectorAll('[data-open-index]').forEach(b => b.addEventListener('click', () => {
    dialog.showModal();
    document.dispatchEvent(new CustomEvent('atlas:index', {detail:true}));
    dialog.querySelector('input').focus();
  }));
  dialog.querySelector('[data-close-index]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => document.dispatchEvent(new CustomEvent('atlas:index', {detail:false})));
  dialog.addEventListener('click', e => { if(e.target === dialog) dialog.close(); });
  dialog.querySelector('input').addEventListener('input', e => {
    const query = e.target.value.toLowerCase().trim();
    let count = 0;
    list.querySelectorAll('a').forEach(a => { a.hidden = !a.dataset.search.includes(query); if(!a.hidden) count++; });
    dialog.querySelector('.index-results').textContent = `${count} ${count === 1 ? 'company' : 'companies'}`;
  });
  setActiveCompany(1);
}

export function layoutPortfolio(H) {
  document.querySelectorAll('.company-frame').forEach((f, i) => {
    const first = i === 0;
    const stagger = i>1 && i%2===0 ? .78-sizes[i][1]-.166 : 0;
    gsap.set(f, {left:first?330:1016+(i-1)*660, top:first?H*.675:H*(.166+(i-1)*.30+stagger), width:sizes[i][0], height:H*sizes[i][1]});
  });
}

export function setActiveCompany(index) {
  index = Math.max(0, Math.min(featured.length-1, index));
  if(active === index) return;
  active = index;
  if(document.documentElement.classList.contains('motion-ready')) document.querySelectorAll('.company-frame').forEach((f,i)=>f.inert=Math.abs(i-index)>1);
  const c = featured[index];
  document.getElementById('company-count').textContent = `${String(index+1).padStart(2,'0')} / ${String(featured.length).padStart(2,'0')}`;
  document.getElementById('company-current').textContent = c.name;
  document.querySelector('[data-company-prev]').disabled = index <= 1;
  document.querySelector('[data-company-next]').disabled = index >= featured.length-1;
}

export function currentCompany() { return active; }
