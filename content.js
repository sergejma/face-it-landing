/* ==========================================================================
   FACE IT — content.js
   Engine für Ratgeber-Seiten: Reading-Progress · TOC-Scrollspy · Count-up
   · interaktive Herzstücke (cycle, comfort, curve, ladder, grounding,
   breath, checklist). Vanilla, kein Framework. Ergänzt script.js
   (Reveal/Sticky/Tracking laufen dort). prefers-reduced-motion wird geehrt.
   ========================================================================== */
(() => {
  'use strict';
  const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SVGNS = 'http://www.w3.org/2000/svg';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const svgEl = (n, a = {}) => { const e = document.createElementNS(SVGNS, n); for (const k in a) e.setAttribute(k, a[k]); return e; };
  const el = (n, a = {}, html) => { const e = document.createElement(n); for (const k in a) e.setAttribute(k, a[k]); if (html != null) e.innerHTML = html; return e; };
  const cfg = (root) => { const s = root.querySelector('.fig-config'); if (!s) return {}; try { return JSON.parse(s.textContent); } catch (e) { return {}; } };
  let _id = 0;

  /* ---------- Reading progress ---------- */
  (() => {
    const bar = $('.read-progress');
    if (!bar || RM) return;
    let raf = false;
    const upd = () => {
      raf = false;
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
    };
    window.addEventListener('scroll', () => { if (!raf) { raf = true; requestAnimationFrame(upd); } }, { passive: true });
    upd();
  })();

  /* ---------- Sticky CTA on article pages (kein .hero vorhanden) ---------- */
  (() => {
    const sticky = document.getElementById('stickyCta');
    if (!sticky || document.querySelector('.hero')) return; // landing handles its own
    const foot = document.querySelector('.cta-band') || document.querySelector('.site-footer');
    const upd = () => {
      const past = window.scrollY > 560;
      const footRect = foot ? foot.getBoundingClientRect() : null;
      const footVisible = footRect && footRect.top < window.innerHeight * 0.85;
      const show = past && !footVisible;
      sticky.classList.toggle('is-visible', show);
      sticky.setAttribute('aria-hidden', show ? 'false' : 'true');
    };
    upd();
    window.addEventListener('scroll', upd, { passive: true });
    window.addEventListener('resize', upd);
  })();

  /* ---------- TOC scrollspy ---------- */
  (() => {
    const links = $$('.toc a[href^="#"]');
    if (!links.length) return;
    const map = new Map();
    links.forEach((a) => { const t = document.getElementById(a.getAttribute('href').slice(1)); if (t) map.set(t, a); });
    const targets = Array.from(map.keys());
    if (!targets.length) return;
    let current = null;
    const setActive = (a) => { if (a === current) return; links.forEach((l) => l.classList.remove('is-active')); if (a) a.classList.add('is-active'); current = a; };
    const io = new IntersectionObserver((entries) => {
      // pick the topmost intersecting heading
      const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (vis[0]) setActive(map.get(vis[0].target));
    }, { rootMargin: '-80px 0px -65% 0px', threshold: 0 });
    targets.forEach((t) => io.observe(t));
  })();

  /* ---------- Count-up ---------- */
  (() => {
    const nums = $$('[data-count]');
    if (!nums.length) return;
    const run = (node) => {
      const target = parseFloat(node.getAttribute('data-count'));
      const dec = (node.getAttribute('data-count').split('.')[1] || '').length;
      if (RM || isNaN(target)) { node.firstChild ? node.firstChild.nodeValue = target.toFixed(dec) : node.textContent = target.toFixed(dec); return; }
      const dur = 1100; let t0 = null;
      const unit = node.querySelector('.unit');
      const step = (ts) => {
        if (!t0) t0 = ts;
        const p = Math.min(1, (ts - t0) / dur);
        const e = 1 - Math.pow(1 - p, 3);
        const val = (target * e).toFixed(dec);
        node.childNodes[0] ? node.childNodes[0].nodeValue = val : node.textContent = val;
        if (unit) node.appendChild(unit);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } }), { threshold: 0.6 });
    nums.forEach((n) => io.observe(n));
  })();

  /* ---------- Widget registry (Dispatch läuft am Dateiende) ---------- */
  const builders = {};

  /* =====================================================================
     1) TEUFELSKREIS (cycle)
     ===================================================================== */
  builders.cycle = (root, body, c) => {
    const nodes = c.nodes || ['Auslöser', 'Körper schlägt Alarm', '„Ich sterbe / verliere die Kontrolle“', 'Flucht oder Vermeidung', 'Kurze Erleichterung'];
    const center = c.center || 'Dein Hirn lernt: „war gefährlich“';
    const S = 400, R = 140, cx = S / 2, cy = S / 2;
    const wrap = el('div', { class: 'cycle-wrap' });
    const svg = svgEl('svg', { class: 'cycle-svg', viewBox: `0 0 ${S} ${S}`, role: 'img', 'aria-label': 'Teufelskreis der Angst: ' + nodes.join(' → ') });
    wrap.appendChild(svg);
    const n = nodes.length;
    const pos = nodes.map((_, i) => { const ang = -Math.PI / 2 + (i * 2 * Math.PI) / n; return { x: cx + R * Math.cos(ang), y: cy + R * Math.sin(ang), ang }; });
    // arrows between consecutive nodes (curved)
    const arrows = [];
    for (let i = 0; i < n; i++) {
      const a = pos[i], b = pos[(i + 1) % n];
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      const k = 1.18; const qx = cx + (mx - cx) * k, qy = cy + (my - cy) * k;
      const p = svgEl('path', { class: 'cycle-arrow', d: `M ${a.x} ${a.y} Q ${qx} ${qy} ${b.x} ${b.y}` });
      svg.appendChild(p); arrows.push(p);
    }
    svg.appendChild(svgEl('text', { class: 'cycle-center', x: cx, y: cy - 6 })).textContent = '';
    const ctext = svgEl('text', { class: 'cycle-center', x: cx, y: cy });
    wrapText(ctext, center, cx, cy, 16); svg.appendChild(ctext);
    const gnodes = [];
    pos.forEach((p, i) => {
      const g = svgEl('g', { class: 'cycle-node' });
      g.appendChild(svgEl('circle', { cx: p.x, cy: p.y, r: 34 }));
      const t = svgEl('text', { x: p.x, y: p.y, 'text-anchor': 'middle', 'dominant-baseline': 'central' });
      wrapText(t, nodes[i], p.x, p.y, 11);
      g.appendChild(t); svg.appendChild(g); gnodes.push(g);
    });
    const RO = R + 42; // Läufer umkreist die Knoten von außen, statt den Text zu überdecken
    const orbit = (i) => ({ x: cx + RO * Math.cos(pos[i].ang), y: cy + RO * Math.sin(pos[i].ang) });
    const o0 = orbit(0);
    const runner = svgEl('circle', { class: 'cycle-runner', r: 8, cx: o0.x, cy: o0.y });
    svg.appendChild(runner);
    body.appendChild(wrap);

    const controls = el('div', { class: 'fig-controls' });
    const playBtn = el('button', { class: 'fig-btn', type: 'button' }, '▶ Kreislauf abspielen');
    controls.appendChild(playBtn); body.appendChild(controls);

    let step = 0, timer = null, playing = false;
    const light = (i) => {
      gnodes.forEach((g, j) => g.classList.toggle('is-on', j === i));
      arrows.forEach((a, j) => a.classList.toggle('is-on', j === ((i - 1 + n) % n)));
      const o = orbit(i); runner.setAttribute('cx', o.x); runner.setAttribute('cy', o.y);
    };
    const advance = () => { step = (step + 1) % n; light(step); };
    const stop = () => { playing = false; clearInterval(timer); playBtn.innerHTML = '▶ Kreislauf abspielen'; };
    const play = () => { playing = true; playBtn.innerHTML = '❚❚ Stoppen'; light(step); timer = setInterval(advance, 1400); };
    playBtn.addEventListener('click', () => { playing ? stop() : play(); });
    if (RM) { gnodes.forEach((g) => g.classList.add('is-on')); arrows.forEach((a) => a.classList.add('is-on')); runner.style.display = 'none'; playBtn.style.display = 'none'; }
    else light(0);
  };

  function wrapText(textEl, str, x, y, lh) {
    const words = String(str).split(' ');
    const lines = []; let line = '';
    words.forEach((w) => { if ((line + ' ' + w).trim().length > 10) { lines.push(line.trim()); line = w; } else { line += ' ' + w; } });
    if (line.trim()) lines.push(line.trim());
    const start = y - ((lines.length - 1) * lh) / 2;
    lines.forEach((l, i) => { const ts = svgEl('tspan', { x, y: start + i * lh }); ts.textContent = l; textEl.appendChild(ts); });
  }

  /* =====================================================================
     2) KOMFORTZONE-SLIDER (comfort)
     ===================================================================== */
  builders.comfort = (root, body, c) => {
    const stage = el('div', { class: 'comfort-stage' });
    const S = 480, H = 300, cx = S / 2, cy = H / 2;
    const svg = svgEl('svg', { class: 'comfort-svg', viewBox: `0 0 ${S} ${H}`, 'aria-hidden': 'true' });
    svg.appendChild(svgEl('circle', { class: 'comfort-world', cx, cy, r: 130 }));
    const zone = svgEl('circle', { class: 'comfort-zone', cx, cy, r: 110 });
    svg.appendChild(zone);
    const lab = svgEl('text', { class: 'comfort-label', x: cx, y: cy + 4 }); lab.textContent = 'Komfortzone';
    svg.appendChild(lab);
    stage.appendChild(svg); body.appendChild(stage);

    const ctr = el('div', { class: 'comfort-controls' });
    ctr.innerHTML = '<label for="' + uid('cz') + '">Monate, in denen du der Angst ausweichst: <b class="cz-m">0</b></label>';
    const id = ctr.querySelector('label').getAttribute('for');
    const range = el('input', { class: 'comfort-range', type: 'range', min: '0', max: '36', value: '0', id });
    ctr.appendChild(range);
    const read = el('div', { class: 'comfort-readout' });
    read.innerHTML = '<span>Komfortzone: <b class="cz-zone" style="color:var(--good)">100%</b></span><span>Was sich „zu viel“ anfühlt: <b class="cz-fear" style="color:var(--warn)">—</b></span>';
    ctr.appendChild(read); body.appendChild(ctr);

    const mEl = ctr.querySelector('.cz-m'), zEl = read.querySelector('.cz-zone'), fEl = read.querySelector('.cz-fear');
    const fears = ['nichts', 'volle Supermärkte', 'Restaurants', 'der Bus', 'Anrufe annehmen', 'Besuch empfangen', 'das Treppenhaus', 'die eigene Haustür'];
    const upd = () => {
      const m = +range.value;
      const pct = Math.max(8, 100 - m * 2.4);
      const r = 28 + (pct / 100) * 82;
      zone.setAttribute('r', r.toFixed(1));
      mEl.textContent = m;
      zEl.textContent = Math.round(pct) + '%';
      fEl.textContent = fears[Math.min(fears.length - 1, Math.floor(m / 5))];
    };
    range.addEventListener('input', upd); upd();
  };

  /* =====================================================================
     3) PANIK-KURVE (curve)
     ===================================================================== */
  builders.curve = (root, body, c) => {
    const W = 520, H = 280, padL = 44, padB = 36, padT = 16, padR = 16;
    const x0 = padL, x1 = W - padR, y0 = H - padB, y1 = padT;
    const svg = svgEl('svg', { class: 'curve-svg', viewBox: `0 0 ${W} ${H}`, role: 'img', 'aria-label': 'Verlauf einer Panikattacke: steiler Anstieg, Peak, dann fällt sie von selbst ab.' });
    const grad = svgEl('linearGradient', { id: uid('curveGrad'), x1: '0', y1: '0', x2: '0', y2: '1' });
    grad.appendChild(svgEl('stop', { offset: '0', 'stop-color': 'rgba(201,169,97,.45)' }));
    grad.appendChild(svgEl('stop', { offset: '1', 'stop-color': 'rgba(201,169,97,0)' }));
    const defs = svgEl('defs'); defs.appendChild(grad); svg.appendChild(defs);
    // axes
    svg.appendChild(svgEl('line', { class: 'curve-axis', x1: x0, y1: y0, x2: x1, y2: y0 }));
    svg.appendChild(svgEl('line', { class: 'curve-axis', x1: x0, y1: y0, x2: x0, y2: y1 }));
    const yl = svgEl('text', { x: x0 - 8, y: y1 + 6, 'text-anchor': 'end', 'font-size': '10', fill: 'var(--ink-faint)' }); yl.textContent = 'Angst';
    svg.appendChild(yl);
    const xl = svgEl('text', { x: x1, y: y0 + 24, 'text-anchor': 'end', 'font-size': '10', fill: 'var(--ink-faint)' }); xl.textContent = 'Zeit →';
    svg.appendChild(xl);
    // curve points (bell-ish, asymmetric): rise fast to peak ~35%, decay slow
    const pts = [];
    const N = 60;
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      let v;
      if (t < 0.32) v = Math.pow(t / 0.32, 1.6);
      else v = Math.exp(-(t - 0.32) * 3.4);
      pts.push({ x: x0 + t * (x1 - x0), y: y0 - v * (y0 - y1) * 0.92 });
    }
    const dLine = pts.map((p, i) => (i ? 'L' : 'M') + p.x.toFixed(1) + ' ' + p.y.toFixed(1)).join(' ');
    const fill = svgEl('path', { class: 'curve-fill', d: dLine + ` L ${x1} ${y0} L ${x0} ${y0} Z`, fill: `url(#${grad.id})` });
    svg.appendChild(fill);
    const line = svgEl('path', { class: 'curve-line', d: dLine });
    svg.appendChild(line);
    const peak = pts.reduce((a, b) => (b.y < a.y ? b : a));
    // flags
    const flee = svgEl('g', { class: 'curve-flag flee' });
    flee.appendChild(svgEl('line', { x1: peak.x, y1: peak.y - 4, x2: peak.x, y2: peak.y - 26, stroke: 'var(--warn)', 'stroke-width': '1.5', 'stroke-dasharray': '3 3' }));
    const ft = svgEl('text', { x: peak.x, y: peak.y - 32, 'text-anchor': 'middle' }); ft.textContent = 'Hier willst du fliehen';
    flee.appendChild(ft); svg.appendChild(flee);
    const fall = svgEl('g', { class: 'curve-flag fall' });
    const fp = pts[Math.round(N * 0.72)];
    const at = svgEl('text', { x: fp.x, y: fp.y - 12, 'text-anchor': 'middle' }); at.textContent = '…aber sie fällt. Immer.';
    fall.appendChild(at); svg.appendChild(fall);
    const dot = svgEl('circle', { class: 'curve-dot', r: 6, cx: pts[0].x, cy: pts[0].y });
    svg.appendChild(dot);
    body.appendChild(svg);

    const controls = el('div', { class: 'fig-controls' });
    const btn = el('button', { class: 'fig-btn', type: 'button' }, '▶ Attacke abspielen');
    controls.appendChild(btn); body.appendChild(controls);

    const total = line.getTotalLength();
    const animate = () => {
      btn.disabled = true; flee.classList.remove('show'); fall.classList.remove('show');
      const dur = 3600; let t0 = null;
      const tick = (ts) => {
        if (!t0) t0 = ts;
        const p = Math.min(1, (ts - t0) / dur);
        const pt = line.getPointAtLength(p * total);
        dot.setAttribute('cx', pt.x); dot.setAttribute('cy', pt.y);
        if (p > 0.32) flee.classList.add('show');
        if (p > 0.6) fall.classList.add('show');
        if (p < 1) requestAnimationFrame(tick); else btn.disabled = false;
      };
      requestAnimationFrame(tick);
    };
    if (RM) { dot.style.display = 'none'; flee.classList.add('show'); fall.classList.add('show'); btn.style.display = 'none'; }
    else btn.addEventListener('click', animate);
  };

  /* =====================================================================
     4) ANGSTLEITER-BUILDER (ladder)
     ===================================================================== */
  builders.ladder = (root, body, c) => {
    const key = 'faceit_ladder';
    const seed = c.seed || [];
    const form = el('form', { class: 'ladder-form' });
    form.innerHTML =
      '<input type="text" placeholder="Situation, die dir Angst macht…" aria-label="Situation" maxlength="80" required>' +
      '<select aria-label="Angst-Wert 0 bis 10">' + Array.from({ length: 11 }, (_, i) => `<option value="${i}">${i}/10</option>`).join('') + '</select>' +
      '<button class="fig-btn" type="submit">+ Stufe</button>';
    const list = el('ul', { class: 'ladder-rungs' });
    body.appendChild(form); body.appendChild(list);
    const foot = el('p', { class: 'ladder-gap', 'aria-live': 'polite' }); body.appendChild(foot);

    const txt = form.querySelector('input'), sel = form.querySelector('select');
    sel.value = '5';
    let rungs = [];
    try { rungs = JSON.parse(localStorage.getItem(key) || 'null') || seed.slice(); } catch (e) { rungs = seed.slice(); }
    const sudColor = (v) => `hsl(${Math.round(120 - v * 12)} 60% 42%)`;
    const save = () => { try { localStorage.setItem(key, JSON.stringify(rungs)); } catch (e) {} };
    const render = () => {
      rungs.sort((a, b) => a.v - b.v);
      list.innerHTML = '';
      if (!rungs.length) { list.appendChild(el('li', { class: 'ladder-empty' }, 'Noch leer. Trag deine erste Situation ein — fang bei etwas an, das dich nur leicht nervös macht (Wert 2–3).')); }
      rungs.forEach((r, i) => {
        const li = el('li', { class: 'ladder-rung' });
        const b = el('span', { class: 'sud' }); b.style.background = sudColor(r.v); b.textContent = r.v;
        li.appendChild(b);
        li.appendChild(el('span', { class: 'txt' }, escapeHtml(r.t)));
        const del = el('button', { class: 'del', type: 'button', 'aria-label': 'Stufe entfernen' }, '✕');
        del.addEventListener('click', () => { rungs.splice(i, 1); save(); render(); });
        li.appendChild(del); list.appendChild(li);
      });
      // gap hint
      let gap = '';
      for (let i = 1; i < rungs.length; i++) { if (rungs[i].v - rungs[i - 1].v > 3) { gap = `Großer Sprung zwischen „${rungs[i - 1].t}“ (${rungs[i - 1].v}) und „${rungs[i].t}“ (${rungs[i].v}). Bau eine Zwischenstufe — keine Lücke größer als 2–3.`; break; } }
      foot.textContent = rungs.length > 1 ? (gap || 'Gute Leiter: kleine Schritte, kein Sprung größer als 2–3. Fang ganz unten an.') : '';
    };
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const t = txt.value.trim(); if (!t) return;
      rungs.push({ t, v: +sel.value }); save(); render();
      txt.value = ''; sel.value = '5'; txt.focus();
    });
    render();
  };

  /* =====================================================================
     5) 5-4-3-2-1 GROUNDING
     ===================================================================== */
  builders.grounding = (root, body, c) => {
    const steps = c.steps || [
      { n: 5, sense: 'Dinge, die du SIEHST', hint: 'Schau dich um. Benenne sie still: die Lampe, deine Hand, ein Fleck an der Wand…' },
      { n: 4, sense: 'Dinge, die du FÜHLST', hint: 'Der Boden unter den Füßen. Der Stoff am Arm. Die Temperatur der Luft.' },
      { n: 3, sense: 'Dinge, die du HÖRST', hint: 'Weiter weg, näher dran. Ein Brummen, dein eigener Atem.' },
      { n: 2, sense: 'Dinge, die du RIECHST', hint: 'Kaffee, Waschmittel, einfach die Luft. Atme bewusst durch die Nase.' },
      { n: 1, sache: true, sense: 'Sache, die du SCHMECKST', hint: 'Der Geschmack im Mund. Oder nimm bewusst einen Schluck.' }
    ];
    const stage = el('div'); body.appendChild(stage);
    const dots = el('div', { class: 'ground-dots' });
    steps.forEach(() => dots.appendChild(el('i')));
    let i = -1;
    const renderStep = () => {
      const s = steps[i];
      stage.innerHTML = '';
      const wrap = el('div', { class: 'ground-step' });
      wrap.appendChild(el('div', { class: 'ground-count' }, String(s.n)));
      wrap.appendChild(el('div', { class: 'ground-sense' }, s.sense));
      wrap.appendChild(el('div', { class: 'ground-hint' }, s.hint));
      stage.appendChild(wrap);
      $$('i', dots).forEach((d, j) => { d.classList.toggle('done', j < i); d.classList.toggle('active', j === i); });
      next.textContent = i === steps.length - 1 ? 'Fertig' : 'Weiter';
    };
    const start = el('div', { class: 'ground-step' });
    start.appendChild(el('p', { class: 'ground-hint' }, 'Eine Übung, um aus dem Kopf zurück in den Raum zu kommen. Nicht um die Angst „wegzumachen“ — sondern um die Welle auszureiten. Tipp es einmal komplett durch.'));
    stage.appendChild(start);
    const controls = el('div', { class: 'fig-controls' });
    const next = el('button', { class: 'fig-btn', type: 'button' }, 'Übung starten');
    const reset = el('button', { class: 'fig-btn ghost', type: 'button' }, 'Neu');
    controls.appendChild(next); controls.appendChild(reset);
    body.appendChild(dots); body.appendChild(controls);
    next.addEventListener('click', () => {
      i++;
      if (i >= steps.length) {
        stage.innerHTML = '';
        const d = el('div', { class: 'ground-done' });
        d.appendChild(el('div', { class: 'big' }, 'Wieder im Raum.'));
        d.appendChild(el('p', { class: 'ground-hint' }, 'Die Welle ist kleiner geworden, oder? Sie wäre auch von allein gefallen. Genau das ist der Punkt: Du musstest nicht fliehen.'));
        stage.appendChild(d);
        $$('i', dots).forEach((dd) => { dd.classList.add('done'); dd.classList.remove('active'); });
        next.textContent = 'Nochmal';
        i = -1; return;
      }
      renderStep();
    });
    reset.addEventListener('click', () => { i = -1; stage.innerHTML = ''; stage.appendChild(start); $$('i', dots).forEach((d) => d.classList.remove('done', 'active')); next.textContent = 'Übung starten'; });
  };

  /* =====================================================================
     6) ATEM-TIMER 4-7-8 (breath)
     ===================================================================== */
  builders.breath = (root, body, c) => {
    const phases = [
      { k: 'inhale', label: 'Einatmen', sub: '4 Sekunden · durch die Nase', s: 4 },
      { k: 'hold', label: 'Halten', sub: '7 Sekunden', s: 7 },
      { k: 'exhale', label: 'Ausatmen', sub: '8 Sekunden · durch den Mund', s: 8 }
    ];
    const stage = el('div', { class: 'breath-stage' });
    const orb = el('div', { class: 'breath-orb' });
    const phaseEl = el('div', { class: 'breath-phase' }, 'Bereit?');
    const subEl = el('div', { class: 'breath-sub' }, 'Tipp auf Start');
    orb.appendChild(phaseEl); orb.appendChild(subEl);
    stage.appendChild(orb); body.appendChild(stage);
    const counter = el('div', { class: 'breath-counter' }, '0 Atemzüge'); body.appendChild(counter);
    const controls = el('div', { class: 'fig-controls', style: 'justify-content:center' });
    const btn = el('button', { class: 'fig-btn', type: 'button' }, '▶ Start'); controls.appendChild(btn); body.appendChild(controls);

    let running = false, pi = 0, cycles = 0, timer = null, countdown = null;
    const runPhase = () => {
      const p = phases[pi];
      orb.classList.remove('inhale', 'hold', 'exhale');
      void orb.offsetWidth;
      if (!RM) orb.classList.add(p.k);
      phaseEl.textContent = p.label;
      let left = p.s; subEl.textContent = left + ' …';
      clearInterval(countdown);
      countdown = setInterval(() => { left--; if (left >= 0) subEl.textContent = left + ' …'; }, 1000);
      timer = setTimeout(() => {
        pi++;
        if (pi >= phases.length) { pi = 0; cycles++; counter.textContent = cycles + (cycles === 1 ? ' Atemzug' : ' Atemzüge'); }
        if (running) runPhase();
      }, p.s * 1000);
    };
    const stop = () => { running = false; clearTimeout(timer); clearInterval(countdown); orb.classList.remove('inhale', 'hold', 'exhale'); phaseEl.textContent = 'Pause'; subEl.textContent = 'Start für weiter'; btn.innerHTML = '▶ Weiter'; };
    const start = () => { running = true; btn.innerHTML = '❚❚ Stopp'; runPhase(); };
    btn.addEventListener('click', () => { running ? stop() : start(); });
  };

  /* =====================================================================
     7) CHECKLISTE (checklist) — z.B. Sicherheitsverhalten
     ===================================================================== */
  builders.checklist = (root, body, c) => {
    const items = c.items || [];
    const tallyText = c.tally || ['Nichts angekreuzt — oder noch nicht ehrlich?', '{n} Stück. Jedes davon ist getarnte Vermeidung.', 'Über die Hälfte. Das ist kein Zufall, das ist ein Muster — und das gute daran: Muster kann man abbauen.'];
    const list = el('ul', { class: 'checklist' });
    const check = '<svg viewBox="0 0 24 24" fill="none" stroke="#FAF7F0" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
    items.forEach((it) => {
      const li = el('li');
      const btn = el('button', { class: 'check-item', type: 'button', 'aria-pressed': 'false' });
      btn.appendChild(el('span', { class: 'box' }, check));
      const t = el('span', { class: 'ci-txt' });
      t.innerHTML = '<strong>' + escapeHtml(it.t) + '</strong>' + (it.sub ? '<small>' + escapeHtml(it.sub) + '</small>' : '');
      btn.appendChild(t);
      btn.addEventListener('click', () => { const on = btn.classList.toggle('on'); btn.setAttribute('aria-pressed', on ? 'true' : 'false'); upd(); });
      li.appendChild(btn); list.appendChild(li);
    });
    const tally = el('p', { class: 'check-tally', 'aria-live': 'polite' });
    body.appendChild(list); body.appendChild(tally);
    const upd = () => {
      const n = $$('.check-item.on', list).length;
      let msg = tallyText[0];
      if (n > 0) msg = (n > items.length / 2 ? tallyText[2] : tallyText[1]);
      tally.textContent = msg.replace('{n}', n);
    };
    upd();
  };

  /* ---------- Widget dispatch (nach allen Builder-Definitionen) ---------- */
  $$('[data-widget]').forEach((root) => {
    const body = root.querySelector('.fig-body') || root;
    const fn = builders[root.getAttribute('data-widget')];
    if (fn) try { fn(root, body, cfg(root)); } catch (e) { if (window.console) console.warn('widget', root.getAttribute('data-widget'), e); }
  });

  /* ---------- helpers ---------- */
  function uid(p) { return (p || 'id') + '-' + (++_id); }
  function escapeHtml(s) { return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
})();
