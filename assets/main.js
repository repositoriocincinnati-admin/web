(function () {
  var REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var loader = document.getElementById('loader'), lbar = document.getElementById('lbar');
  var imgs = [].slice.call(document.images), n = 0, finished = false;

  function fin() {
    if (finished) return;
    finished = true;
    setTimeout(function () { loader.classList.add('done'); start(); }, 250);
  }
  function done() {
    n++;
    lbar.style.width = Math.round(n / Math.max(1, imgs.length) * 100) + '%';
    if (n >= imgs.length) fin();
  }
  imgs.forEach(function (i) {
    if (i.complete) done();
    else { i.addEventListener('load', done); i.addEventListener('error', done); }
  });
  if (!imgs.length) fin();
  setTimeout(fin, 6000);

  function showCounts() {
    document.querySelectorAll('[data-count]').forEach(function (el) { el.textContent = el.getAttribute('data-count'); });
  }

  function start() {
    var navEl = document.querySelector('nav');
    var lightSecs = [].slice.call(document.querySelectorAll('.manifesto,.about,.contact'));
    function navSpy() {
      var light = lightSecs.some(function (s) { var r = s.getBoundingClientRect(); return r.top <= 46 && r.bottom >= 46; });
      navEl.classList.toggle('on-light', light);
    }
    navSpy();
    window.addEventListener('scroll', navSpy, { passive: true });

    // sin GSAP (CDN caído) o con movimiento reducido: página estática, primera foto y título visibles
    if (!window.gsap || !window.ScrollTrigger || REDUCED) { showCounts(); return; }

    gsap.registerPlugin(ScrollTrigger);
    var lenis = window.Lenis ? new Lenis({ lerp: 0.08, smoothWheel: true }) : null;
    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update);
      lenis.on('scroll', navSpy);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var t = document.querySelector(a.getAttribute('href'));
        if (!t) return;
        e.preventDefault();
        if (lenis) lenis.scrollTo(t, { duration: 1.4 }); else t.scrollIntoView({ behavior: 'smooth' });
      });
    });

    // hero: 4 fotos que se funden y avanzan mientras la sección queda fija
    gsap.set('#L0', { scale: 1.04 });
    gsap.from('#title .k', { opacity: 0, y: 24, duration: 1, delay: .2, ease: 'power3.out' });
    gsap.from('#title .b', { opacity: 0, y: 48, duration: 1.3, delay: .35, ease: 'power3.out' });
    gsap.fromTo('.scrollcue', { opacity: 0 }, { opacity: 1, duration: 1, delay: 1.1 });
    gsap.timeline({ scrollTrigger: { trigger: '#fly', start: 'top top', end: '+=360%', scrub: true, pin: true, anticipatePin: 1 } })
      .to('#L0', { scale: 1.18, duration: 2, ease: 'none' }, 0)
      .to('#title', { opacity: 0, y: -34, duration: .6, ease: 'power1.in' }, 0.5)
      .to('.scrollcue', { opacity: 0, duration: .3, ease: 'none' }, 0.25)
      .to('#L0', { opacity: 0, duration: .7 }, 1.4)
      .fromTo('#L1', { opacity: 0, scale: 1.16 }, { opacity: 1, scale: 1.02, duration: .9, ease: 'none' }, 1.3)
      .fromTo('#C1 .t', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .4 }, 1.7).to('#C1 .t', { opacity: 0, duration: .3 }, 2.5)
      .to('#L1', { opacity: 0, scale: 1.12, duration: .7 }, 2.5)
      .fromTo('#L2', { opacity: 0, scale: 1.16 }, { opacity: 1, scale: 1.02, duration: .9, ease: 'none' }, 2.4)
      .fromTo('#C2 .t', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .4 }, 2.8).to('#C2 .t', { opacity: 0, duration: .3 }, 3.5)
      .to('#L2', { opacity: 0, scale: 1.12, duration: .7 }, 3.5)
      .fromTo('#L3', { opacity: 0, scale: 1.16 }, { opacity: 1, scale: 1.04, duration: 1.1, ease: 'none' }, 3.4)
      .fromTo('#C3 .t', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .4 }, 3.9);

    gsap.utils.toArray('[data-rv]').forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 44 }, { opacity: 1, y: 0, duration: 1.15, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 86%' } });
    });

    gsap.utils.toArray('.pmedia').forEach(function (box) {
      gsap.fromTo(box.querySelector('img'), { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: box, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    gsap.utils.toArray('[data-count]').forEach(function (el) {
      var target = +el.getAttribute('data-count'), o = { v: 0 };
      ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: function () {
        gsap.to(o, { v: target, duration: 1.7, ease: 'power2.out', onUpdate: function () { el.textContent = Math.round(o.v); } });
      } });
    });

    setTimeout(function () { ScrollTrigger.refresh(); }, 300);
  }
})();
