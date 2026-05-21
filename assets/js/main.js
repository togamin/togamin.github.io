/* ===================================================
   Bubble generation
   =================================================== */
const GLOBAL_BUBBLES = [
  { left: 2,  size: 24, duration: 14, delay: 0    },
  { left: 12, size: 12, duration: 18, delay: 3    },
  { left: 22, size: 33, duration: 12, delay: 1    },
  { left: 33, size: 15, duration: 20, delay: 5    },
  { left: 40, size: 27, duration: 13, delay: 1.5  },
  { left: 48, size: 15, duration: 25, delay: 12   },
  { left: 55, size: 18, duration: 22, delay: 7    },
  { left: 63, size: 24, duration: 15, delay: 6    },
  { left: 69, size: 12, duration: 20, delay: 10   },
  { left: 77, size: 27, duration: 14, delay: 5    },
  { left: 85, size: 15, duration: 22, delay: 2.5  },
  { left: 94, size: 30, duration: 12, delay: 3    },
  { left: 9,  size: 18, duration: 26, delay: 15   },
  { left: 31, size: 24, duration: 24, delay: 16   },
  { left: 43, size: 15, duration: 27, delay: 14   },
  { left: 57, size: 21, duration: 23, delay: 18   },
  { left: 71, size: 18, duration: 25, delay: 17   },
  { left: 96, size: 21, duration: 26, delay: 19   },
];

const HERO_BUBBLES = [
  { left: 8,  size: 30, duration: 9,  delay: 0 },
  { left: 33, size: 42, duration: 8,  delay: 3 },
  { left: 62, size: 30, duration: 10, delay: 2 },
  { left: 88, size: 36, duration: 9,  delay: 1 },
];

function createBubble({ left, size, duration, delay }, className) {
  const el = document.createElement('span');
  el.className = className;
  el.style.cssText = `left:${left}%;width:${size}px;height:${size}px;animation-duration:${duration}s;animation-delay:${delay}s;`;
  return el;
}

const globalContainer = document.querySelector('.bubbles-global');
const heroContainer   = document.querySelector('.hero__bubbles');
const fragment1 = document.createDocumentFragment();
const fragment2 = document.createDocumentFragment();

GLOBAL_BUBBLES.forEach((d) => fragment1.appendChild(createBubble(d, 'bubble--global')));
HERO_BUBBLES.forEach((d)   => fragment2.appendChild(createBubble(d, 'bubble')));

globalContainer.appendChild(fragment1);
heroContainer.appendChild(fragment2);

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
