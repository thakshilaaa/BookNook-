// ============================================================
// BookNook — polished interactions
// ============================================================

const filterBtns   = document.querySelectorAll('.filter-buttons button');
const cards        = document.querySelectorAll('.card');
const noResults    = document.getElementById('noResults');
const searchInput  = document.getElementById('searchInput');
const resultCount  = document.getElementById('resultCount');
const progress     = document.getElementById('scrollProgress');
const backToTop    = document.getElementById('backToTop');

let activeCat = 'all';
let activeSearch = '';

// ---------- Category counts on filter buttons ----------
const categoryLabels = {
  all: 'All', fiction: 'Fiction', nonfiction: 'Non-Fiction',
  children: 'Children', academic: 'Academic',
  comics: 'Comics', romance: 'Romance'
};
const counts = { all: cards.length };
cards.forEach(card => {
  const c = card.dataset.cat;
  counts[c] = (counts[c] || 0) + 1;
});
filterBtns.forEach(btn => {
  const cat = btn.dataset.cat;
  const n = counts[cat] || 0;
  btn.innerHTML = `${categoryLabels[cat]} <span class="count">${n}</span>`;
});

// ---------- Filter logic ----------
function applyFilters() {
  let shown = 0;
  cards.forEach(card => {
    const matchCat = (activeCat === 'all' || card.dataset.cat === activeCat);
    const title = (card.dataset.title || '').toLowerCase();
    const author = (card.dataset.author || '').toLowerCase();
    const matchSearch = !activeSearch ||
      title.includes(activeSearch) ||
      author.includes(activeSearch);
    const visible = matchCat && matchSearch;
    card.style.display = visible ? '' : 'none';
    if (visible) shown++;
  });
  if (noResults)  noResults.style.display  = (shown === 0) ? 'block' : 'none';
  if (resultCount) resultCount.textContent = `Showing ${shown} of ${cards.length} books`;
  console.log(`Filter: cat=${activeCat}, search="${activeSearch}" -> ${shown} books`);
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeCat = btn.dataset.cat;
    applyFilters();
  });
});

if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    activeSearch = e.target.value.trim().toLowerCase();
    applyFilters();
  });
}

// ---------- Save/bookmark toggle ----------
document.querySelectorAll('.save').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    btn.classList.toggle('active');
    btn.textContent = btn.classList.contains('active') ? '♥' : '♡';
  });
});

// ---------- Scroll progress + back-to-top ----------
function onScroll() {
  const scrolled  = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const pct       = maxScroll > 0 ? (scrolled / maxScroll) * 100 : 0;
  if (progress) progress.style.width = pct + '%';
  if (backToTop) backToTop.classList.toggle('show', scrolled > 400);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ---------- Reveal-on-scroll ----------
const revealTargets = document.querySelectorAll(
  '.section-head, .feature, .staff-card, .review, .contact-card, .newsletter'
);
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // small stagger when multiple enter at once
        setTimeout(() => entry.target.classList.add('visible'), i * 60);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealTargets.forEach(el => { el.classList.add('reveal'); io.observe(el); });
} else {
  // fallback for very old browsers
  revealTargets.forEach(el => el.classList.add('visible'));
}

// ---------- Initial run ----------
applyFilters();

console.log('%c📚 BookNook polished & loaded', 'color:#bf360c;font-weight:bold;font-size:14px;');
