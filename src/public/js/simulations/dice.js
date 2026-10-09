// Simulator bacanja kockica: zbir ili broj kockica sa izabranim brojem, poređenje sa teorijskom raspodelom.
(function () {
  var S = window.Sim;
  var PIPS = { 1: [[5, 5]], 2: [[2.5, 2.5], [7.5, 7.5]], 3: [[2.5, 2.5], [5, 5], [7.5, 7.5]], 4: [[2.5, 2.5], [7.5, 2.5], [2.5, 7.5], [7.5, 7.5]], 5: [[2.5, 2.5], [7.5, 2.5], [5, 5], [2.5, 7.5], [7.5, 7.5]], 6: [[2.5, 2.5], [7.5, 2.5], [2.5, 5], [7.5, 5], [2.5, 7.5], [7.5, 7.5]] };
  // Kockica kao SVG (vektorska, oštra u svakoj veličini). f = 1..6, 0 = još nebačena ("?")
  function dieSvg(f, size, hit) {
    var body = '<rect x="0.5" y="0.5" width="9" height="9" rx="1.6" fill="#fff" stroke="' + (hit ? '#198754' : '#495057') + '" stroke-width="' + (hit ? 0.7 : 0.4) + '"/>';
    if (f) body += PIPS[f].map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="0.85" fill="' + (hit ? '#198754' : '#212529') + '"/>'; }).join('');
    else body += '<text x="5" y="6.9" font-size="5.2" text-anchor="middle" fill="#adb5bd" font-weight="700">?</text>';
    return '<svg class="die" viewBox="0 0 10 10" width="' + size + '" height="' + size + '" role="img" aria-label="' + (f ? 'kockica ' + f : 'kockica') + '">' + body + '</svg>';
  }

  function pmfSum(n) { // raspodela zbira n kockica (konvolucija)
    var d = [0, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6]; // po jednoj kocki
    var cur = [1]; // zbir 0
    for (var i = 0; i < n; i++) {
      var next = new Array(cur.length + 6).fill(0);
      for (var s = 0; s < cur.length; s++) if (cur[s]) for (var f = 1; f <= 6; f++) next[s + f] += cur[s] * d[f];
      cur = next;
    }
    return cur.slice(0, 6 * n + 1);
  }
  function pmfCount(n) { // broj kockica sa izabranim brojem: binomna B(n, 1/6)
    var out = [];
    for (var k = 0; k <= n; k++) out.push(S.choose(n, k) * Math.pow(1 / 6, k) * Math.pow(5 / 6, n - k));
    return out;
  }

  S.register('dice', function (root, cfg) {
    var st = { n: cfg.dice || 2, mode: cfg.mode || 'sum', face: cfg.face || 6, cmp: cfg.cmp || '>=', t: cfg.target, counts: {}, total: 0, sumX: 0, sumX2: 0, last: [] };
    var maxDice = cfg.maxDice || 10;
    var ui = {};

    function range() { return st.mode === 'sum' ? [st.n, 6 * st.n] : [0, st.n]; }
    function defaultTarget() { return st.mode === 'sum' ? Math.round(3.5 * st.n) : 1; }
    if (st.t == null) st.t = defaultTarget();
    function stat(roll) { return st.mode === 'sum' ? roll.reduce(function (a, b) { return a + b; }, 0) : roll.filter(function (x) { return x === st.face; }).length; }
    function test(x) { return st.cmp === '=' ? x === st.t : (st.cmp === '>=' ? x >= st.t : x <= st.t); }
    function reset() { st.counts = {}; st.total = 0; st.sumX = 0; st.sumX2 = 0; st.last = []; draw(); }
    function theory() { return st.mode === 'sum' ? pmfSum(st.n) : pmfCount(st.n); }

    function rollOnce() { var r = []; for (var i = 0; i < st.n; i++) r.push(1 + Math.floor(Math.random() * 6)); return r; }
    function record(r) { var x = stat(r); st.counts[x] = (st.counts[x] || 0) + 1; st.total++; st.sumX += x; st.sumX2 += x * x; st.last = r; }
    function roll(times) {
      if (times === 1) {
        ui.dice.classList.add('rolling');
        setTimeout(function () { ui.dice.classList.remove('rolling'); record(rollOnce()); draw(); }, 350);
        return;
      }
      for (var i = 0; i < times; i++) record(rollOnce());
      draw();
    }

    function build() {
      var controls = S.h('div', { class: 'sim-row' }, [
        S.field('Broj kockica', S.select(Array.from({ length: maxDice }, function (_, i) { return [i + 1, i + 1]; }), st.n, function (v) { st.n = Number(v); st.t = defaultTarget(); rebuildTarget(); reset(); })),
        S.field('Šta posmatramo', S.select([['sum', 'zbir svih kockica'], ['face', 'broj kockica sa izabranim brojem']], st.mode, function (v) { st.mode = v; st.t = defaultTarget(); rebuildTarget(); reset(); }))
      ]);
      ui.faceWrap = S.h('div', {});
      ui.target = S.h('div', { class: 'sim-row' });
      var buttons = S.h('div', { class: 'sim-row' }, [
        S.button('🎲 Baci 1×', function () { roll(1); }),
        S.button('Baci 100×', function () { roll(100); }, 'btn-outline-primary'),
        S.button('Baci 1000×', function () { roll(1000); }, 'btn-outline-primary'),
        S.button('Baci 10000×', function () { roll(10000); }, 'btn-outline-primary'),
        S.button('Poništi', reset, 'btn-outline-secondary')
      ]);
      ui.dice = S.h('div', { class: 'sim-dice', 'aria-live': 'polite' });
      ui.out = S.h('div', { class: 'sim-out' });
      ui.chart = S.h('div', { class: 'mt-3' });
      root.appendChild(controls); root.appendChild(ui.target); root.appendChild(buttons);
      root.appendChild(ui.dice); root.appendChild(ui.out); root.appendChild(ui.chart);
      rebuildTarget();
    }
    function rebuildTarget() {
      ui.target.innerHTML = '';
      var r = range();
      if (st.mode === 'face') ui.target.appendChild(S.field('Izabrani broj na kockici', S.select([1, 2, 3, 4, 5, 6].map(function (f) { return [f, String(f)]; }), st.face, function (v) { st.face = Number(v); reset(); })));
      ui.target.appendChild(S.field('Događaj: vrednost je…', S.select([['=', 'tačno jednaka'], ['>=', 'najmanje'], ['<=', 'najviše']], st.cmp, function (v) { st.cmp = v; draw(); })));
      ui.target.appendChild(S.field(st.mode === 'sum' ? 'zbiru ' + r[0] + '–' + r[1] : 'broju kockica 0–' + st.n, S.number(r[0], r[1], st.t, function (v) { st.t = v; draw(); })));
    }

    function draw() {
      ui.dice.innerHTML = '';
      var shown = st.last.length ? st.last : Array.apply(null, Array(st.n)).map(function () { return 0; });
      ui.dice.innerHTML = shown.map(function (f) { return dieSvg(f, st.n > 6 ? 56 : 72, st.mode === 'face' && f === st.face); }).join('');
      var th = theory(), r = range(), items = [], pT = 0, pE = 0;
      for (var x = r[0]; x <= r[1]; x++) {
        var emp = st.total ? (st.counts[x] || 0) / st.total : 0, hit = test(x);
        if (hit) { pT += th[x]; pE += emp; }
        items.push({ label: String(x), emp: emp, theo: th[x], hit: hit });
      }
      var evText = (st.mode === 'sum' ? 'zbir' : 'broj kockica sa brojem ' + st.face) + ' ' + (st.cmp === '=' ? '=' : (st.cmp === '>=' ? '≥' : '≤')) + ' ' + st.t;
      var mean = st.total ? st.sumX / st.total : 0, varE = st.total ? st.sumX2 / st.total - mean * mean : 0;
      var th_mean = 0, th_var = 0;
      th.forEach(function (p, x) { th_mean += x * p; });
      th.forEach(function (p, x) { th_var += x * x * p; });
      th_var -= th_mean * th_mean;
      ui.out.innerHTML = '';
      ui.out.appendChild(S.h('div', { html: 'Događaj <strong>' + evText + '</strong>' }));
      ui.out.appendChild(S.h('div', { class: 'sim-big', text: st.total ? 'U ' + S.pct(pE) + ' pokušaja (' + Math.round(pE * st.total) + ' od ' + st.total + ')' : 'Baci kockice!' }));
      ui.out.appendChild(S.h('div', { html: 'Teorijska verovatnoća: <strong>' + S.pct(pT) + '</strong> (' + S.num(pT, 5) + ')' + (st.total ? ' &nbsp;·&nbsp; razlika: ' + S.num(Math.abs(pE - pT) * 100, 2) + ' p.p.' : '') }));
      ui.out.appendChild(S.h('div', { class: 'small text-muted mt-1', text: 'Prosek: ' + (st.total ? S.num(mean, 3) : '–') + ' (teorijski ' + S.num(th_mean, 3) + ') · disperzija: ' + (st.total ? S.num(varE, 3) : '–') + ' (teorijski ' + S.num(th_var, 3) + ')' }));
      ui.chart.innerHTML = '';
      ui.chart.appendChild(S.chart(items));
      ui.chart.appendChild(S.h('div', { class: 'small text-muted', text: 'Što se više puta baci, to je obojeni stubić bliži crvenoj crti — zakon velikih brojeva.' }));
    }
    build(); draw();
  });
})();
