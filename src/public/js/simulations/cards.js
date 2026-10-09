// Izvlačenje karata iz špila od 52 karte: sa vraćanjem / bez vraćanja, poređenje sa teorijom
// (bez vraćanja: hipergeometrijska raspodela, sa vraćanjem: binomna).
(function () {
  var S = window.Sim;
  var RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  var SUITS = ['♠', '♥', '♦', '♣'];
  var N = 52;

  // Koliko karata u špilu pripada "cilju" i kako se prepoznaje
  function targetInfo(kind, value) {
    if (kind === 'rank') return { K: 4, test: function (c) { return c.r === value; }, name: 'karata ranga ' + value };
    if (kind === 'suit') return { K: 13, test: function (c) { return c.s === value; }, name: 'karata boje ' + value };
    if (kind === 'red') return { K: 26, test: function (c) { return c.s === '♥' || c.s === '♦'; }, name: 'crvenih karata' };
    return { K: 12, test: function (c) { return c.r === 'J' || c.r === 'Q' || c.r === 'K'; }, name: 'slika (J, Q, K)' };
  }
  function pmf(k, K, replace) { // verovatnoće da među k izvučenih bude j ciljnih, j = 0..k
    var out = [], j;
    for (j = 0; j <= k; j++) {
      if (replace) out.push(S.choose(k, j) * Math.pow(K / N, j) * Math.pow(1 - K / N, k - j));
      else out.push(j > K || k - j > N - K ? 0 : S.choose(K, j) * S.choose(N - K, k - j) / S.choose(N, k));
    }
    return out;
  }

  S.register('cards', function (root, cfg) {
    var st = { k: cfg.draw || 5, replace: !!cfg.replace, kind: cfg.targetKind || 'rank', value: cfg.targetValue || 'A', cmp: cfg.cmp || '>=', m: cfg.m == null ? 1 : cfg.m, counts: {}, total: 0, last: [] };
    var ui = {};
    function maxK() { return st.replace ? 20 : 20; }
    function reset() { st.counts = {}; st.total = 0; st.last = []; draw(); }
    function test(x) { return st.cmp === '=' ? x === st.m : (st.cmp === '>=' ? x >= st.m : x <= st.m); }

    function drawHand() {
      var hand = [], i;
      if (st.replace) {
        for (i = 0; i < st.k; i++) hand.push({ r: RANKS[Math.floor(Math.random() * 13)], s: SUITS[Math.floor(Math.random() * 4)] });
      } else {
        var deck = [];
        SUITS.forEach(function (s) { RANKS.forEach(function (r) { deck.push({ r: r, s: s }); }); });
        for (i = 0; i < st.k; i++) { var j = i + Math.floor(Math.random() * (N - i)); var t = deck[i]; deck[i] = deck[j]; deck[j] = t; hand.push(deck[i]); }
      }
      return hand;
    }
    function record(hand) {
      var info = targetInfo(st.kind, st.value), x = hand.filter(info.test).length;
      st.counts[x] = (st.counts[x] || 0) + 1; st.total++; st.last = hand;
    }
    function run(times) { for (var i = 0; i < times; i++) record(drawHand()); draw(); }

    function valueControl() {
      ui.valWrap.innerHTML = '';
      if (st.kind === 'rank') ui.valWrap.appendChild(S.field('Rang', S.select(RANKS.map(function (r) { return [r, r]; }), st.value, function (v) { st.value = v; reset(); })));
      else if (st.kind === 'suit') ui.valWrap.appendChild(S.field('Boja', S.select(SUITS.map(function (s) { return [s, s]; }), st.value, function (v) { st.value = v; reset(); })));
    }
    function build() {
      var row1 = S.h('div', { class: 'sim-row' }, [
        S.field('Broj izvučenih karata', S.number(1, maxK(), st.k, function (v) { st.k = v; if (st.m > v) st.m = v; reset(); })),
        S.field('Vraćanje karte u špil', S.select([['no', 'bez vraćanja'], ['yes', 'sa vraćanjem']], st.replace ? 'yes' : 'no', function (v) { st.replace = v === 'yes'; reset(); }))
      ]);
      ui.valWrap = S.h('div', {});
      var row2 = S.h('div', { class: 'sim-row' }, [
        S.field('Računamo broj…', S.select([['rank', 'karata istog ranga (npr. asova)'], ['suit', 'karata izabrane boje'], ['red', 'crvenih karata'], ['face', 'slika (J, Q, K)']], st.kind, function (v) { st.kind = v; st.value = v === 'rank' ? 'A' : '♠'; valueControl(); reset(); })),
        ui.valWrap,
        S.field('Događaj: broj ciljnih karata je…', S.select([['=', 'tačno'], ['>=', 'najmanje'], ['<=', 'najviše']], st.cmp, function (v) { st.cmp = v; draw(); })),
        S.field('vrednost', S.number(0, 20, st.m, function (v) { st.m = v; draw(); }))
      ]);
      var buttons = S.h('div', { class: 'sim-row' }, [
        S.button('🃏 Izvuci', function () { run(1); }),
        S.button('Izvuci 100×', function () { run(100); }, 'btn-outline-primary'),
        S.button('Izvuci 1000×', function () { run(1000); }, 'btn-outline-primary'),
        S.button('Izvuci 10000×', function () { run(10000); }, 'btn-outline-primary'),
        S.button('Poništi', reset, 'btn-outline-secondary')
      ]);
      ui.cards = S.h('div', { class: 'sim-cards', 'aria-live': 'polite' });
      ui.out = S.h('div', { class: 'sim-out' });
      ui.chart = S.h('div', { class: 'mt-3' });
      [row1, row2, buttons, ui.cards, ui.out, ui.chart].forEach(function (e) { root.appendChild(e); });
      valueControl();
    }
    function draw() {
      var info = targetInfo(st.kind, st.value);
      ui.cards.innerHTML = '';
      st.last.forEach(function (c) {
        var red = c.s === '♥' || c.s === '♦';
        ui.cards.appendChild(S.h('div', { class: 'playing-card' + (red ? ' red' : '') + (info.test(c) ? ' hit' : '') }, [S.h('span', { text: c.r }), S.h('small', { text: c.s })]));
      });
      var th = pmf(st.k, info.K, st.replace), items = [], pT = 0, pE = 0;
      for (var x = 0; x <= st.k; x++) {
        var emp = st.total ? (st.counts[x] || 0) / st.total : 0, hit = test(x);
        if (hit) { pT += th[x]; pE += emp; }
        items.push({ label: String(x), emp: emp, theo: th[x], hit: hit });
      }
      var cmpTxt = st.cmp === '=' ? 'tačno ' : (st.cmp === '>=' ? 'najmanje ' : 'najviše ');
      ui.out.innerHTML = '';
      ui.out.appendChild(S.h('div', { html: 'Događaj: među ' + st.k + ' izvučenih ima <strong>' + cmpTxt + st.m + '</strong> ' + info.name + ' (u špilu ih je ' + info.K + ', špil ima 52 karte; ' + (st.replace ? 'sa vraćanjem' : 'bez vraćanja') + ')' }));
      ui.out.appendChild(S.h('div', { class: 'sim-big', text: st.total ? 'U ' + S.pct(pE) + ' izvlačenja (' + Math.round(pE * st.total) + ' od ' + st.total + ')' : 'Izvuci karte!' }));
      ui.out.appendChild(S.h('div', { html: 'Teorijska verovatnoća: <strong>' + S.pct(pT) + '</strong> (' + S.num(pT, 6) + ')' }));
      ui.out.appendChild(S.h('div', { class: 'small text-muted mt-1', text: st.replace ? 'Sa vraćanjem svako izvlačenje je nezavisno: broj ciljnih karata ima binomnu raspodelu B(k, K/52).' : 'Bez vraćanja izvlačenja su zavisna: broj ciljnih karata ima hipergeometrijsku raspodelu, P(X = j) = C(K, j)·C(52−K, k−j) / C(52, k).' }));
      ui.chart.innerHTML = '';
      ui.chart.appendChild(S.chart(items));
      ui.chart.appendChild(S.h('div', { class: 'small text-muted', text: 'Na x-osi je broj ciljnih karata u izvučenoj ruci.' }));
    }
    build(); draw();
  });
})();
