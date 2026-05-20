/* ===================================================
   Nav — scrolled class
   =================================================== */
const nav  = document.getElementById('nav');
const hero = document.getElementById('hero');

function onScroll() {
  const scrolled = window.scrollY;

  nav.classList.toggle('scrolled', scrolled > 40);

  if (scrolled < window.innerHeight) {
    hero.style.backgroundPositionY = `calc(50% + ${scrolled * 0.35}px)`;
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ===================================================
   Fade-in — Intersection Observer
   =================================================== */
const fadeEls = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

fadeEls.forEach((el) => observer.observe(el));

/* ===================================================
   Smooth scroll — anchor links
   =================================================== */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - nav.offsetHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ===================================================
   Ripple — work-card & link-card
   =================================================== */
document.querySelectorAll('.work-card, .link-card').forEach((card) => {
  card.addEventListener('click', (e) => {
    const rect   = card.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top  = `${e.clientY - rect.top}px`;
    card.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});
