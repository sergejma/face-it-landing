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

  // Lightweight CTA click tracking hook (extend later with GA / Plausible / Meta)
  document.querySelectorAll('[data-cta]').forEach((el) => {
    el.addEventListener('click', () => {
      const where = el.getAttribute('data-cta');
      if (window.plausible) window.plausible('CTA Click', { props: { location: where } });
      if (window.gtag) window.gtag('event', 'cta_click', { location: where });
      if (window.fbq) window.fbq('track', 'Lead', { content_name: where });
    });
  });
})();
