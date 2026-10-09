// Binomna raspodela B(n, p): raspodela, očekivanje, disperzija i simulacija ponavljanja eksperimenta.
(function () {
  var S = window.Sim;
  S.register('binomial', function (root, cfg) {
    var st = { n: cfg.n || 10, p: cfg.p == null ? 0.5 : cfg.p, k: cfg.k == null ? 5 : cfg.k, counts: {}, total: 0 };
    var ui = {};
    function pmf() { var out = []; for (var k = 0; k <= st.n; k++) out.push(S.choose(st.n, k) * Math.pow(st.p, k) * Math.pow(1 - st.p, st.n - k)); return out; }
    function reset() { st.counts = {}; st.total = 0; draw(); }
    function run(times) {
      for (var t = 0; t < times; t++) { var x = 0; for (var i = 0; i < st.n; i++) if (Math.random() < st.p) x++; st.counts[x] = (st.counts[x] || 0) + 1; st.total++; }
      draw();
    }
    function build() {
      var p = S.h('input', { type: 'range', class: 'form-range', min: 0, max: 1, step: 0.05, value: st.p });
      ui.pLabel = S.h('strong', {});
      p.addEventListener('input', function () { st.p = Number(p.value); reset(); });
      root.appendChild(S.h('div', { class: 'sim-row' }, [
        S.field('Broj pokušaja n', S.number(1, 40, st.n, function (v) { st.n = v; if (st.k > v) st.k = v; ui.k.value = st.k; reset(); })),
        S.h('div', { style: 'min-width:14rem' }, [S.h('label', { text: 'Verovatnoća uspeha p: ' }), ui.pLabel, p]),
        S.field('k (broj uspeha)', (ui.k = S.number(0, 40, st.k, function (v) { st.k = Math.min(v, st.n); draw(); })))
      ]));
      root.appendChild(S.h('div', { class: 'sim-row' }, [
        S.button('Ponovi eksperiment 1×', function () { run(1); }),
        S.button('100×', function () { run(100); }, 'btn-outline-primary'),
        S.button('1000×', function () { run(1000); }, 'btn-outline-primary'),
        S.button('Poništi', reset, 'btn-outline-secondary')
      ]));
      ui.out = S.h('div', { class: 'sim-out' }); ui.chart = S.h('div', { class: 'mt-3' });
      root.appendChild(ui.out); root.appendChild(ui.chart);
    }
    function draw() {
      ui.pLabel.textContent = S.num(st.p, 2);
      var th = pmf(), items = [], cdf = 0;
      for (var k = 0; k <= st.n; k++) {
        if (k <= st.k) cdf += th[k];
        items.push({ label: String(k), emp: st.total ? (st.counts[k] || 0) / st.total : 0, theo: th[k], hit: k === st.k });
      }
      var q = 1 - st.p;
      ui.out.innerHTML = '';
      ui.out.appendChild(S.h('div', { text: '\\[ P(X=' + st.k + ')=\\dbinom{' + st.n + '}{' + st.k + '}\\,' + S.num(st.p, 2).replace(',', '{,}') + '^{' + st.k + '}\\cdot' + S.num(q, 2).replace(',', '{,}') + '^{' + (st.n - st.k) + '} \\]' }));
      ui.out.appendChild(S.h('div', { class: 'sim-big', text: 'P(X = ' + st.k + ') = ' + S.num(th[st.k], 5) + '   ·   P(X ≤ ' + st.k + ') = ' + S.num(cdf, 5) }));
      ui.out.appendChild(S.h('div', { html: 'E(X) = np = <strong>' + S.num(st.n * st.p, 2) + '</strong> · D(X) = npq = <strong>' + S.num(st.n * st.p * q, 3) + '</strong> · σ = <strong>' + S.num(Math.sqrt(st.n * st.p * q), 3) + '</strong>' + (st.total ? ' · prosek u ' + st.total + ' ponavljanja: ' + S.num(Object.keys(st.counts).reduce(function (s, k) { return s + k * st.counts[k]; }, 0) / st.total, 3) : '') }));
      S.renderMath(ui.out);
      ui.chart.innerHTML = ''; ui.chart.appendChild(S.chart(items));
      ui.chart.appendChild(S.h('div', { class: 'small text-muted', text: 'Zeleni stubić je izabrano k. Crvena crta je P(X = k), plavi stubić je učestalost u simulaciji.' }));
    }
    build(); draw();
  });
})();
