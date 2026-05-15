/* Charlotte Wellness — header drawer + testimonial slider */
(function () {
  'use strict';

  // Mobile drawer
  document.addEventListener('click', function (e) {
    const toggle = e.target.closest('[data-wc-drawer-open]');
    const close = e.target.closest('[data-wc-drawer-close]');
    const panel = e.target.closest('.wc-drawer__panel');
    const drawer = document.querySelector('.wc-drawer');
    if (!drawer) return;

    if (toggle) {
      drawer.setAttribute('aria-hidden', 'false');
      document.body.classList.add('wc-drawer-open');
      const firstLink = drawer.querySelector('a, button');
      if (firstLink) setTimeout(function(){ firstLink.focus(); }, 200);
      return;
    }
    if (close || (e.target === drawer && !panel)) {
      drawer.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('wc-drawer-open');
      const opener = document.querySelector('[data-wc-drawer-open]');
      if (opener) opener.focus();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    const drawer = document.querySelector('.wc-drawer[aria-hidden="false"]');
    if (drawer) {
      drawer.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('wc-drawer-open');
    }
  });

  // Testimonial slider
  function initTestimonial(root) {
    const slides = Array.from(root.querySelectorAll('[data-wc-slide]'));
    const dots = Array.from(root.querySelectorAll('[data-wc-dot]'));
    if (slides.length <= 1) return;
    let idx = 0;
    function show(n) {
      idx = (n + slides.length) % slides.length;
      slides.forEach(function (s, i) { s.hidden = i !== idx; });
      dots.forEach(function (d, i) { d.setAttribute('aria-current', i === idx ? 'true' : 'false'); });
    }
    dots.forEach(function (d, i) { d.addEventListener('click', function () { show(i); }); });
    const autoplay = root.dataset.wcAutoplay === 'true';
    if (autoplay) {
      let t = setInterval(function () { show(idx + 1); }, 6000);
      root.addEventListener('mouseenter', function () { clearInterval(t); });
      root.addEventListener('mouseleave', function () { t = setInterval(function () { show(idx + 1); }, 6000); });
    }
    show(0);
  }

  document.querySelectorAll('[data-wc-testimonial]').forEach(initTestimonial);
})();
