/* ── HERO WORD CYCLE ─────────────────────────────────────── */
(function() {
  const words = ['BUILD', 'DESIGN', 'CREATE', 'LAUNCH'];
  let idx = 0;
  const el = document.getElementById('hero-cycle-word');
  if (!el) return;

  setInterval(() => {
    el.classList.add('cycling-out');
    setTimeout(() => {
      idx = (idx + 1) % words.length;
      el.textContent = words[idx];
      el.classList.remove('cycling-out');
      el.classList.add('cycling-in');
      requestAnimationFrame(() => requestAnimationFrame(() => {
        el.classList.remove('cycling-in');
      }));
    }, 260);
  }, 2600);
})();

/* ── CURSOR ─────────────────────────────────────────────── */
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top  = my + 'px';
});

(function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animRing);
})();

document.querySelectorAll('a, button, .project-row, .project-card, .venture-cell').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

/* ── NAVIGATION ─────────────────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

/* ── SPA ROUTING ────────────────────────────────────────── */
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.nav-links a[data-page]');
const transition = document.getElementById('page-transition');

function showPage(id, pushState = true) {
  transition.classList.add('active');

  setTimeout(() => {
    pages.forEach(p => p.classList.remove('active'));
    const target = document.getElementById('page-' + id);
    if (target) {
      target.classList.add('active');
      window.scrollTo(0, 0);
    }

    navLinks.forEach(l => {
      l.classList.toggle('active', l.dataset.page === id);
    });

    if (pushState) {
      history.pushState({ page: id }, '', '#' + id);
    }

    // Trigger reveals on new page
    setTimeout(() => {
      initReveals();
      initSkillBars();
      transition.classList.remove('active');
    }, 50);
  }, 280);
}

navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    showPage(link.dataset.page);
  });
});

// Handle project row clicks
document.querySelectorAll('.project-row[data-project]').forEach(row => {
  row.addEventListener('click', () => showPage('work'));
});

// Handle venture links
document.querySelectorAll('[data-page-link]').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    showPage(el.dataset.pageLink);
  });
});

// Browser back/forward
window.addEventListener('popstate', e => {
  const id = (e.state && e.state.page) || 'home';
  showPage(id, false);
});

// Init from hash
const initHash = location.hash.slice(1) || 'home';
showPage(initHash, false);

/* ── REVEAL ON SCROLL ────────────────────────────────────── */
function initReveals() {
  const els = document.querySelectorAll('.page.active .reveal:not(.visible)');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => obs.observe(el));
}

/* ── SKILL BARS ──────────────────────────────────────────── */
function initSkillBars() {
  const bars = document.querySelectorAll('.page.active .skill-bar-wrap:not(.animated)');
  if (!bars.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const bar = e.target.querySelector('.skill-bar');
        e.target.classList.add('animated');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  bars.forEach(b => obs.observe(b));
}

/* ── TICKER CLONE ─────────────────────────────────────────── */
const tracks = document.querySelectorAll('.ticker-track');
tracks.forEach(track => {
  const clone = track.innerHTML;
  track.innerHTML += clone;
});

/* ── FILTER BUTTONS ──────────────────────────────────────── */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.work-filter').querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

/* ── TEXT SCRAMBLE EFFECT ─────────────────────────────────── */
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    this.update = this.update.bind(this);
  }
  setText(newText) {
    const old = this.el.innerText;
    const length = Math.max(old.length, newText.length);
    const promise = new Promise(resolve => this.resolve = resolve);
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = old[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 12);
      const end = start + Math.floor(Math.random() * 12);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  update() {
    let output = '', complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        output += `<span style="color:var(--blue);opacity:0.7">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete !== this.queue.length) {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    } else {
      this.resolve();
    }
  }
}

// Apply scramble to hero name on load
window.addEventListener('DOMContentLoaded', () => {
  const heroEl = document.querySelector('.hero-scramble');
  if (heroEl) {
    const fx = new TextScramble(heroEl);
    const original = heroEl.textContent.trim();
    heroEl.style.opacity = '1';
    fx.setText(original);
  }
});

/* ── MAGNETIC BUTTONS ─────────────────────────────────────── */
document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* ── STAGGER HERO REVEAL ─────────────────────────────────── */
setTimeout(() => {
  document.querySelectorAll('.hero-stagger').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), i * 120);
  });
}, 100);
