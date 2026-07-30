(() => {
  'use strict';

  // Update copyright year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Sticky header — add class on scroll
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Ratgeber-Mega-Menü (Desktop-Dropdown + mobiles Burger-Sheet)
  const navToggles = document.querySelectorAll('[data-nav-toggle]');
  const mega = document.getElementById('megaPanel');
  if (header && mega && navToggles.length) {
    const setNav = (open) => {
      header.classList.toggle('nav-open', open);
      navToggles.forEach((t) => t.setAttribute('aria-expanded', open ? 'true' : 'false'));
    };
    navToggles.forEach((t) => t.addEventListener('click', (e) => {
      e.stopPropagation();
      setNav(!header.classList.contains('nav-open'));
    }));
    document.addEventListener('click', (e) => {
      if (header.classList.contains('nav-open') && !mega.contains(e.target) && !e.target.closest('[data-nav-toggle]')) setNav(false);
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setNav(false); });
    mega.addEventListener('click', (e) => { if (e.target.closest('a')) setNav(false); });
  }

  // Reveal-on-scroll
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // Sticky mobile CTA — show after hero scrolled past, hide near final CTA
  const stickyCta = document.getElementById('stickyCta');
  const hero = document.querySelector('.hero');
  const finalCta = document.querySelector('.section-final');
  if (stickyCta && hero) {
    const updateSticky = () => {
      const heroBottom = hero.getBoundingClientRect().bottom;
      const finalRect = finalCta ? finalCta.getBoundingClientRect() : null;
      const finalVisible = finalRect && finalRect.top < window.innerHeight * 0.6;
      const show = heroBottom < 0 && !finalVisible;
      stickyCta.classList.toggle('is-visible', show);
      stickyCta.setAttribute('aria-hidden', show ? 'false' : 'true');
    };
    updateSticky();
    window.addEventListener('scroll', updateSticky, { passive: true });
    window.addEventListener('resize', updateSticky);
  }

  // Phone mockup parallax + tilt-on-scroll
  const phoneMock = document.querySelector('[data-parallax]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (phoneMock && !reducedMotion) {
    let raf = false;
    const update = () => {
      raf = false;
      const rect = phoneMock.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      // 0 when phone is at viewport bottom, 1 when at viewport top
      const progress = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));
      // Translate up by 0 → -70px as user scrolls
      const py = (progress - 0.3) * -90;
      // Rotate from -8deg to -1deg as user scrolls (phone straightens out)
      const pr = -8 + progress * 7;
      phoneMock.style.setProperty('--py', py.toFixed(1) + 'px');
      phoneMock.style.setProperty('--pr', pr.toFixed(2) + 'deg');
    };
    const onScroll = () => {
      if (!raf) { raf = true; requestAnimationFrame(update); }
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  }

  // CTA click tracking — fires ClickedAppStoreButton on every CTA that links to the App Store
  document.querySelectorAll('[data-cta]').forEach((el) => {
    el.addEventListener('click', () => {
      const where = el.getAttribute('data-cta');
      if (window.fbq) window.fbq('trackCustom', 'ClickedAppStoreButton', { location: where });
      if (window.plausible) window.plausible('CTA Click', { props: { location: where } });
      if (window.gtag) window.gtag('event', 'cta_click', { location: where });
    });
  });
})();

// ============ Hero app demo: avoidance-level curve animation ============
// The number is DERIVED from the curve's current y — so it rises on every
// setback and still trends down, exactly like the level in the app.
(() => {
  const path = document.getElementById('fadPath');
  if (!path) return;
  const dot = document.getElementById('fadDot');
  const num = document.getElementById('fadNum');
  const badge = document.getElementById('fadBadge');
  const delta = document.getElementById('fadDelta');
  const plant = document.getElementById('fadPlant');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const LEN = path.getTotalLength();
  const Y_TOP = 8, Y_BOT = 74, LVL_TOP = 8.6, LVL_BOT = 3.2;
  const DRAW_MS = 5600, HOLD_MS = 3200, FADE_MS = 450;

  const levelAt = (y) => {
    const t = Math.min(1, Math.max(0, (y - Y_TOP) / (Y_BOT - Y_TOP)));
    return LVL_TOP - t * (LVL_TOP - LVL_BOT);
  };

  function render(dist) {
    path.style.strokeDasharray = LEN;
    path.style.strokeDashoffset = LEN - dist;
    const pt = path.getPointAtLength(dist);
    dot.setAttribute('cx', pt.x);
    dot.setAttribute('cy', pt.y);
    const lvl = levelAt(pt.y);
    num.textContent = lvl.toFixed(1);
    plant.classList.toggle('s1', true);
    plant.classList.toggle('s2', lvl < 6.8);
    plant.classList.toggle('s3', lvl < 4.4);
    plant.classList.toggle('color', lvl < 5.2);
    return lvl;
  }

  function finishState(on) {
    badge.textContent = on ? 'Unter Kontrolle' : 'Hoch';
    badge.classList.toggle('is-good', on);
    delta.classList.toggle('is-in', on);
    dot.classList.toggle('pulse', on);
  }

  if (reduced) { render(LEN); finishState(true); return; }

  const easeInOut = (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const screen = document.querySelector('.fad-screen');
  let start = null;

  function tick(now) {
    if (start === null) start = now;
    const t = now - start;
    if (t < DRAW_MS) {
      render(LEN * easeInOut(t / DRAW_MS));
      if (t > DRAW_MS - 900) finishState(true);
    } else if (t < DRAW_MS + HOLD_MS) {
      render(LEN);
    } else if (t < DRAW_MS + HOLD_MS + FADE_MS) {
      screen.style.opacity = String(1 - 0.55 * ((t - DRAW_MS - HOLD_MS) / FADE_MS));
    } else {
      finishState(false);
      screen.style.opacity = '1';
      start = now;
      render(0);
    }
    requestAnimationFrame(tick);
  }
  render(0);
  requestAnimationFrame(tick);
})();
