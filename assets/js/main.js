/* ===================================================
   Page Ripple — 波紋アニメーション
   =================================================== */
(function initPageRipples() {
  function spawnRipple() {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    const rings = 2 + Math.floor(Math.random() * 2);

    for (let i = 0; i < rings; i++) {
      setTimeout(() => {
        const el = document.createElement('div');
        const size     = 120 + Math.random() * 280;
        const duration = 8 + Math.random() * 6;
        el.style.cssText = [
          `position:absolute`,
          `left:${x}px`,
          `top:${window.scrollY + y}px`,
          `width:${size}px`,
          `height:${size}px`,
          `border-radius:50%`,
          `border:1.5px solid rgba(117,195,215,0.55)`,
          `pointer-events:none`,
          `z-index:50`,
          `animation:page-ripple-expand ${duration}s linear forwards`,
        ].join(';');
        document.body.appendChild(el);
        el.addEventListener('animationend', () => el.remove());
      }, i * 700);
    }
  }

  function scheduleRipple() {
    spawnRipple();
    setTimeout(scheduleRipple, 667 + Math.random() * 833);
  }
  scheduleRipple();
})();

/* ===================================================
   Custom Cursor
   =================================================== */
const cursorDot  = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches) {
  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
  });

  (function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  })();

  document.querySelectorAll('a, button, .work-card, .link-card').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursorDot.classList.add('is-hovering');
      cursorRing.classList.add('is-hovering');
    });
    el.addEventListener('mouseleave', () => {
      cursorDot.classList.remove('is-hovering');
      cursorRing.classList.remove('is-hovering');
    });
  });

  document.addEventListener('click', (e) => {
    const ripple = document.createElement('div');
    ripple.className = 'cursor-ripple';
    ripple.style.left = e.clientX + 'px';
    ripple.style.top  = e.clientY + 'px';
    document.body.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
}

/* ===================================================
   Profile image fallback
   =================================================== */
const profileImg = document.querySelector('.about__image img');
if (profileImg) {
  profileImg.addEventListener('error', () => {
    profileImg.style.display = 'none';
    if (profileImg.nextElementSibling) {
      profileImg.nextElementSibling.style.display = 'flex';
    }
  });
}

/* ===================================================
   Nav scroll + parallax (requestAnimationFrame)
   =================================================== */
const nav  = document.getElementById('nav');
const hero = document.getElementById('hero');
let   ticking = false;

function onScroll() {
  if (!ticking) {
    requestAnimationFrame(() => {
      const scrolled = window.scrollY;
      nav.classList.toggle('scrolled', scrolled > 40);
      if (scrolled < window.innerHeight) {
        hero.style.backgroundPositionY = `calc(50% + ${scrolled * 0.35}px)`;
      }
      ticking = false;
    });
    ticking = true;
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
