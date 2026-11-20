/* Bamboo Center of Development, ponašanje sajta.
   Pokret: GSAP + ScrollTrigger + Lenis (assets/vendor). Poštuje prefers-reduced-motion.
   Dizajn i izrada: Nenad Vilček */
(function () {
  'use strict';
  var CX = [{"d": "Dete govori manje od vršnjaka, teško izgovara glasove ili se teško sporazumeva.", "l": [["logoped", "Logoped"], ["forbrain", "Forbrain"]]}, {"d": "Brzo odustaje, nemirno je, teško prati zadatke u vrtiću ili školi.", "l": [["neuro", "Neurofeedback"], ["defektolog", "Defektolog"]]}, {"d": "Dete je tipičnog razvoja, ali su čitanje, pisanje ili koncentracija u školi pravi napor.", "l": [["timska", "Timska procena"], ["defektolog", "Defektolog"]]}, {"d": "Burno reaguje na buku, odeću, dodir ili gužvu i teško se smiruje.", "l": [["si", "Senzorna integracija"], ["soundsory", "Soundsory"]]}, {"d": "Spretnost, ravnoteža ili koordinacija nisu u skladu sa uzrastom.", "l": [["defektolog", "Defektolog"], ["si", "Senzorna integracija"]]}, {"d": "Primećujete da se dete razvija drugačije i želite stručno mišljenje i plan.", "l": [["timska", "Timska procena"]]}];
  var root = document.getElementById('bcd-root');
  if (!root) return;
  var doc = document.documentElement;
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lenis = null;

  /* ---------- mobilni meni ---------- */
  var menuBtn = root.querySelector('[data-act="menu"]');
  var mnav = document.getElementById('mobilni-meni');
  function setMenu(open) {
    if (!menuBtn || !mnav) return;
    mnav.hidden = !open;
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  if (menuBtn) menuBtn.addEventListener('click', function () { setMenu(mnav.hidden); });
  root.querySelectorAll('[data-act="close-menu"]').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });

  /* ---------- listovi usluga (otvara se jedan po jedan) ---------- */
  function scrollToEl(el, offset) {
    if (lenis) lenis.scrollTo(el, { offset: offset });
    else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: reduced ? 'auto' : 'smooth' });
  }
  function setLeaf(id, open) {
    root.querySelectorAll('.leaf').forEach(function (leaf) {
      var btn = leaf.querySelector('[data-act="leaf"]');
      var lid = btn.getAttribute('data-id');
      var on = open && lid === id;
      leaf.classList.toggle('is-open', on);
      btn.setAttribute('aria-expanded', on ? 'true' : 'false');
      var more = btn.querySelector('.leaf-more');
      if (more && more.firstChild) more.firstChild.nodeValue = on ? 'Zatvorite ' : 'Saznajte više ';
      var det = document.getElementById('detalj-' + lid);
      if (det) det.hidden = !on;
    });
  }
  root.querySelectorAll('[data-act="leaf"]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.getAttribute('data-id');
      var isOpen = btn.getAttribute('aria-expanded') === 'true';
      setLeaf(id, !isOpen);
      if (!isOpen) setTimeout(function () {
        var el = document.getElementById('list-' + id);
        if (el && el.getBoundingClientRect().top < 90) scrollToEl(el, -100);
      }, 60);
    });
  });
  function goService(id) {
    setLeaf(id, true);
    setTimeout(function () { var el = document.getElementById('list-' + id); if (el) scrollToEl(el, -110); }, 80);
  }
  root.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-go]');
    if (b) goService(b.getAttribute('data-go'));
  });

  /* ---------- Kome pomažemo ---------- */
  var cxDesc = document.getElementById('cx-desc');
  var cxNum = document.getElementById('cx-num');
  var cxLinks = document.getElementById('cx-links');
  var arrow = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>';
  var cur = 0;
  function setCx(i) {
    if (i === cur) return;
    cur = i;
    root.querySelectorAll('.cx-row').forEach(function (row, k) {
      row.classList.toggle('is-on', k === i);
      var b = row.querySelector('[data-act="cx"]'); if (b) b.setAttribute('aria-pressed', k === i ? 'true' : 'false');
    });
    root.querySelectorAll('.cx-ill').forEach(function (svg, k) { svg.classList.toggle('is-on', k === i); });
    if (cxDesc) cxDesc.textContent = CX[i].d;
    if (cxNum) cxNum.textContent = '0' + (i + 1) + ' / 06';
    if (cxLinks) cxLinks.innerHTML = CX[i].l.map(function (p) { return '<button class="c-link" type="button" data-go="' + p[0] + '">' + p[1] + ' ' + arrow + '</button>'; }).join('');
  }
  root.querySelectorAll('[data-cx-row]').forEach(function (row) {
    var i = Number(row.getAttribute('data-cx-row'));
    row.addEventListener('mouseenter', function () { setCx(i); });
    var b = row.querySelector('[data-act="cx"]');
    if (b) { b.addEventListener('click', function () { setCx(i); }); b.addEventListener('focus', function () { setCx(i); }); }
  });

  /* ---------- duga pisma ---------- */
  root.querySelectorAll('[data-act="letter"]').forEach(function (b) {
    b.addEventListener('click', function () { var f = b.closest('.letter'); if (f) f.classList.toggle('is-full'); });
  });

  /* ---------- formular (Formspree) ---------- */
  var form = document.getElementById('upit-form');
  var msg = document.getElementById('upit-poruka');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var action = form.getAttribute('action') || '';
    var done = function (ok) {
      if (!msg) return;
      msg.hidden = false;
      msg.textContent = ok ? 'Hvala Vam. Upit je primljen, javićemo Vam se.' : 'Slanje trenutno nije uspelo. Pozovite nas na 066 661 6699 ili pišite na bamboobcd@gmail.com.';
      if (ok) form.reset();
    };
    if (action.indexOf('YOUR_FORM_ID') !== -1) { // formular još nije povezan (vidi README)
      if (msg) { msg.hidden = false; msg.textContent = 'Formular još nije povezan, pa upit nije poslat. Pozovite nas na 066 661 6699 ili pišite na bamboobcd@gmail.com.'; }
      return;
    }
    fetch(action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      .then(function (res) { done(res.ok); }).catch(function () { done(false); });
  });

  /* ---------- kursor-list (samo iznad listova usluga) ---------- */
  if (window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var c = root.querySelector('.cursor');
    root.classList.add('has-leafcursor');
    var tx = -100, ty = -100, x = -100, y = -100;
    window.addEventListener('mousemove', function (e) { tx = e.clientX; ty = e.clientY; }, { passive: true });
    document.addEventListener('mouseover', function (e) {
      var on = !!(e.target.closest && e.target.closest('.leaf'));
      c.classList.toggle('is-hover', on); c.classList.toggle('vis', on);
    });
    (function loop() { x += (tx - x) * 0.25; y += (ty - y) * 0.25; c.style.transform = 'translate(' + x + 'px,' + y + 'px)'; requestAnimationFrame(loop); })();
  }

  /* ---------- donja traka se sklanja kod kontakta ---------- */
  var kontaktSec = document.getElementById('kontakt');
  if (kontaktSec && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { root.classList.toggle('at-contact', en[0].isIntersecting); }, { threshold: 0.15 }).observe(kontaktSec);
  }

  /* ---------- tačkice za vodoravne nizove na telefonu ---------- */
  root.querySelectorAll('[data-dots-for]').forEach(function (d) {
    var sc = document.getElementById(d.getAttribute('data-dots-for'));
    if (!sc) return;
    var dots = d.querySelectorAll('i');
    var upd = function () {
      var base = sc.getBoundingClientRect().left, idx = 0, best = 1e9;
      Array.prototype.forEach.call(sc.children, function (it, k) { var dist = Math.abs(it.getBoundingClientRect().left - base - 20); if (dist < best) { best = dist; idx = k; } });
      dots.forEach(function (x, k) { x.classList.toggle('on', k === idx); });
    };
    sc.addEventListener('scroll', upd, { passive: true });
  });

  /* ---------- pokret ---------- */
  if (reduced) { root.classList.add('is-static'); root.style.setProperty('--p', '1'); return; }
  root.classList.add('motion-on');

  var leaves = root.querySelectorAll('[data-spine-at]');
  var hero = document.getElementById('pocetna');
  function onScroll() {
    var max = doc.scrollHeight - window.innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 1;
    root.style.setProperty('--p', p.toFixed(4));
    for (var i = 0; i < leaves.length; i++) leaves[i].classList.toggle('on', p * 100 >= Number(leaves[i].getAttribute('data-spine-at')));
    root.classList.toggle('is-scrolled', window.scrollY > 10);
    root.classList.toggle('past-hero', hero ? window.scrollY > hero.offsetHeight * 0.6 : p > 0.06);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        cio.unobserve(en.target);
        var el = en.target, end = Number(el.getAttribute('data-count')), t0 = null;
        var step = function (t) { if (!t0) t0 = t; var k = Math.min(1, (t - t0) / 1600); el.textContent = String(Math.round(end * (1 - Math.pow(1 - k, 3)))); if (k < 1) requestAnimationFrame(step); };
        el.textContent = '0'; requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    root.querySelectorAll('[data-count]').forEach(function (el) { cio.observe(el); });
  }

  var revealEls = root.querySelectorAll('[data-reveal],[data-leafrow],[data-node]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting || en.boundingClientRect.bottom < 0) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  var gsap = window.gsap, ST = window.ScrollTrigger;
  if (gsap && ST) {
    gsap.registerPlugin(ST);
    root.querySelectorAll('[data-stalk]').forEach(function (st) {
      gsap.fromTo(st, { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: st.parentElement, start: 'top 80%', end: 'bottom 60%', scrub: 0.6 } });
    });
    root.querySelectorAll('[data-stalk-x]').forEach(function (st) {
      var vertical = window.innerWidth <= 900;
      gsap.fromTo(st, vertical ? { scaleY: 0 } : { scaleX: 0 }, vertical
        ? { scaleY: 1, ease: 'none', scrollTrigger: { trigger: st.parentElement, start: 'top 80%', end: 'bottom 60%', scrub: 0.6 } }
        : { scaleX: 1, ease: 'none', scrollTrigger: { trigger: st.parentElement, start: 'top 85%', end: 'top 45%', scrub: 0.6 } });
    });
    var grow = root.querySelector('[data-hero-grow]');
    if (grow) gsap.to(grow, { scaleY: 1.14, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
    var climb = root.querySelector('[data-hero-climb]');
    if (climb) gsap.to(climb, { y: -140, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.8 } });
    var panda = root.querySelector('.spine-panda');
    var kontakt = document.getElementById('kontakt');
    if (panda && kontakt) ST.create({ trigger: kontakt, start: 'top 55%', end: 'bottom 45%', onToggle: function (s) { panda.setAttribute('data-pose', s.isActive ? 'wave' : 'climb'); } });
    if (window.Lenis) {
      lenis = new window.Lenis({ autoRaf: false, lerp: 0.11, anchors: { offset: -84 } });
      lenis.on('scroll', ST.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
    var refresh = function () { try { ST.refresh(); } catch (e) {} };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
    window.addEventListener('load', refresh);
  }
})();
