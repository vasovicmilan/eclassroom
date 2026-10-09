// Zajednički deo interaktivnih vežbi: registracija, pomoćne funkcije i učitavanje stilova.
// Svaka vežba je zaseban fajl (dice.js, cards.js...) koji se registruje sa Sim.register('naziv', function (root, config) {...}).
(function () {
  var registry = {};
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/css/pages/simulations.css';
  document.head.appendChild(link);

  function h(tag, attrs, children) {
    var el = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === 'text') el.textContent = attrs[k];
      else if (k === 'html') el.innerHTML = attrs[k];
      else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] !== false && attrs[k] != null) el.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return el;
  }

  // field('Naziv', input) -> blok sa labelom
  function field(label, input) { return h('div', {}, [h('label', { text: label }), input]); }
  function select(options, value, onchange) {
    var s = h('select', { class: 'form-select form-select-sm' }, options.map(function (o) {
      return h('option', { value: String(o[0]), text: o[1] });
    }));
    s.value = String(value);
    s.addEventListener('change', function () { onchange(s.value); });
    return s;
  }
  function number(min, max, value, onchange, step) {
    var i = h('input', { type: 'number', class: 'form-control form-control-sm', min: min, max: max, step: step || 1, value: value });
    i.addEventListener('change', function () {
      var v = Number(i.value);
      if (isNaN(v)) v = value;
      v = Math.min(max, Math.max(min, v));
      i.value = v;
      onchange(v);
    });
    return i;
  }
  function button(text, onclick, cls) {
    return h('button', { type: 'button', class: 'btn btn-sm ' + (cls || 'btn-primary'), text: text, onclick: onclick });
  }

  // matematika
  function choose(n, k) { // double, za male brojeve
    if (k < 0 || k > n) return 0;
    k = Math.min(k, n - k);
    var r = 1;
    for (var i = 1; i <= k; i++) r = r * (n - k + i) / i;
    return Math.round(r);
  }
  function bigFact(n) { var r = 1n; for (var i = 2n; i <= BigInt(n); i++) r *= i; return r; }
  function bigChoose(n, k) {
    if (k < 0 || k > n) return 0n;
    k = Math.min(k, n - k);
    var r = 1n;
    for (var i = 1; i <= k; i++) r = r * BigInt(n - k + i) / BigInt(i);
    return r;
  }
  function fmtBig(b) { return b.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }
  function pct(p) { return (p * 100).toFixed(2).replace('.', ',') + ' %'; }
  function num(x, d) { return Number(x).toFixed(d == null ? 4 : d).replace('.', ','); }
  function renderMath(el) { if (window.renderLessonMath) window.renderLessonMath(el); }

  // histogram: values[{label, emp, theo, hit}], emp i theo su udeli (0..1)
  function chart(items, opts) {
    opts = opts || {};
    var max = 0;
    items.forEach(function (it) { max = Math.max(max, it.emp || 0, it.theo || 0); });
    if (max === 0) max = 1;
    var cols = h('div', { class: 'sim-chart' }, items.map(function (it) {
      var col = h('div', { class: 'sim-col' + (it.hit ? ' hit' : ''), title: it.label + ': empirijski ' + pct(it.emp || 0) + ', teorijski ' + pct(it.theo || 0) });
      col.appendChild(h('div', { class: 'bar', style: 'height:' + ((it.emp || 0) / max * 100) + '%' }));
      if (!opts.noTheory) col.appendChild(h('div', { class: 'theo', style: 'bottom:' + ((it.theo || 0) / max * 100) + '%' }));
      return col;
    }));
    var step = items.length > 30 ? 5 : (items.length > 16 ? 2 : 1);
    var labels = h('div', { class: 'sim-labels' }, items.map(function (it, i) { return h('span', { text: i % step === 0 ? it.label : '' }); }));
    var legend = opts.noTheory ? h('div', { class: 'sim-legend', html: '<i style="background:#198754"></i>mod (najčešća vrednost)' }) : h('div', { class: 'sim-legend' }, [
      h('span', { html: '<i style="background:#6c8ebf"></i>dobijeno u pokušajima &nbsp; ' }),
      h('span', { html: '<i style="background:#198754"></i>ishod koji pripada događaju &nbsp; ' }),
      h('span', { html: '<i style="background:#dc3545;height:3px"></i>teorijska verovatnoća' })
    ]);
    return h('div', {}, [cols, labels, legend]);
  }

  window.Sim = {
    register: function (kind, init) { registry[kind] = init; },
    h: h, field: field, select: select, number: number, button: button,
    choose: choose, bigFact: bigFact, bigChoose: bigChoose, fmtBig: fmtBig, pct: pct, num: num, chart: chart, renderMath: renderMath,
  };

  function boot() {
    document.querySelectorAll('.sim[data-sim]').forEach(function (root) {
      var init = registry[root.getAttribute('data-sim')];
      if (!init) { root.textContent = 'Nepoznata vežba: ' + root.getAttribute('data-sim'); return; }
      var cfg = {};
      try { cfg = JSON.parse(root.getAttribute('data-config') || '{}'); } catch (e) { /* prazna konfiguracija */ }
      init(root, cfg);
    });
  }
  // vežbe se registruju u svojim skriptama koje se učitavaju posle ovog, zato čekamo kraj učitavanja
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else setTimeout(boot, 0);
})();
