// Deskriptivna statistika: unesi uzorak i vidi sve mere sa postupkom.
(function () {
  var S = window.Sim;
  function parse(text) { return text.split(/[;\s]+/).map(function (s) { return s.trim().replace(',', '.'); }).filter(Boolean).map(Number).filter(function (x) { return isFinite(x); }); }
  S.register('stats', function (root, cfg) {
    var data = cfg.sample || [2, 3, 3, 5, 7];
    var ui = {};
    function build() {
      ui.ta = S.h('textarea', { class: 'form-control', rows: 2 }); ui.ta.value = data.join(' ');
      ui.ta.addEventListener('input', draw);
      root.appendChild(S.h('div', { class: 'sim-row' }, [S.h('div', { style: 'flex:1;min-width:16rem' }, [S.h('label', { text: 'Uzorak (brojevi razdvojeni razmakom ili tačkom‑zarezom)' }), ui.ta])]));
      root.appendChild(S.h('div', { class: 'sim-row' }, [
        S.button('Nasumičan uzorak', function () { ui.ta.value = Array.from({ length: 8 }, function () { return 1 + Math.floor(Math.random() * 10); }).join(' '); draw(); }, 'btn-outline-primary')
      ]));
      ui.out = S.h('div', { class: 'sim-out' }); ui.table = S.h('div', { class: 'mt-3 table-responsive' }); ui.chart = S.h('div', { class: 'mt-3' });
      [ui.out, ui.table, ui.chart].forEach(function (e) { root.appendChild(e); });
    }
    function draw() {
      var x = parse(ui.ta.value);
      ui.out.innerHTML = ''; ui.table.innerHTML = ''; ui.chart.innerHTML = '';
      if (!x.length) { ui.out.appendChild(S.h('div', { class: 'text-danger', text: 'Unesi bar jedan broj.' })); return; }
      var n = x.length, sorted = x.slice().sort(function (a, b) { return a - b; });
      var mean = x.reduce(function (a, b) { return a + b; }, 0) / n;
      var ss = x.reduce(function (a, b) { return a + (b - mean) * (b - mean); }, 0);
      var s2 = ss / n, s2c = n > 1 ? ss / (n - 1) : NaN;
      var med = n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
      var freq = {}; x.forEach(function (v) { freq[v] = (freq[v] || 0) + 1; });
      var mx = Math.max.apply(null, Object.keys(freq).map(function (k) { return freq[k]; }));
      var modes = Object.keys(freq).filter(function (k) { return freq[k] === mx; }).map(Number).sort(function (a, b) { return a - b; });
      var f = function (v) { return S.num(v, 4).replace(/,?0+$/, ''); };
      ui.out.appendChild(S.h('div', { text: '\\[ \\bar x=\\dfrac1n\\sum x_i=' + f(mean).replace(',', '{,}') + ',\\qquad S^2=\\dfrac1n\\sum (x_i-\\bar x)^2=' + f(s2).replace(',', '{,}') + ' \\]' }));
      ui.out.appendChild(S.h('div', { html: 'n = <strong>' + n + '</strong> · sredina <strong>' + f(mean) + '</strong> · medijana <strong>' + f(med) + '</strong> · mod <strong>' + (mx === 1 ? 'nema (svi se javljaju jednom)' : modes.map(f).join(', ')) + '</strong> · opseg <strong>' + f(sorted[n - 1] - sorted[0]) + '</strong>' }));
      ui.out.appendChild(S.h('div', { html: 'Disperzija uzorka S² = <strong>' + f(s2) + '</strong> (S = ' + f(Math.sqrt(s2)) + ') · ispravljena disperzija S*² = <strong>' + (n > 1 ? f(s2c) : '–') + '</strong> (deli se sa n − 1)' }));
      S.renderMath(ui.out);
      var rows = sorted.slice(0, 15).map(function (v) { return '<tr><td>' + f(v) + '</td><td>' + f(v - mean) + '</td><td>' + f((v - mean) * (v - mean)) + '</td></tr>'; }).join('');
      ui.table.innerHTML = '<table class="table table-sm table-bordered w-auto"><thead class="table-light"><tr><th>x<sub>i</sub></th><th>x<sub>i</sub> − x̄</th><th>(x<sub>i</sub> − x̄)²</th></tr></thead><tbody>' + rows + '</tbody><tfoot><tr><th colspan="2">Zbir kvadrata odstupanja</th><th>' + f(ss) + '</th></tr></tfoot></table>' + (n > 15 ? '<div class="small text-muted">Prikazano prvih 15 (sortirano).</div>' : '');
      var keys = Object.keys(freq).map(Number).sort(function (a, b) { return a - b; });
      if (keys.length <= 30) ui.chart.appendChild(S.chart(keys.map(function (k) { return { label: f(k), emp: freq[k] / n, theo: 0, hit: modes.indexOf(k) >= 0 && mx > 1 }; }), { noTheory: true }));
    }
    build(); draw();
  });
})();
