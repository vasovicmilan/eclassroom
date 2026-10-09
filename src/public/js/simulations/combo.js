// Kalkulator kombinatorike: permutacije, varijacije i kombinacije sa i bez ponavljanja, uz nabrajanje malih slučajeva.
(function () {
  var S = window.Sim;
  var LET = 'ABCDEFGHIJ';

  function prodText(n, k) { // n·(n−1)·…·(n−k+1)
    if (k <= 0) return '1';
    var terms = [];
    for (var i = 0; i < k; i++) terms.push(n - i);
    if (terms.length > 6) return terms.slice(0, 3).join('\\cdot ') + '\\cdots ' + terms[terms.length - 1];
    return terms.join('\\cdot ');
  }
  function product(n, k) { var r = 1n; for (var i = 0; i < k; i++) r *= BigInt(n - i); return r; }

  // nabrajanje (najviše limit stavki)
  function enumerate(type, n, k, limit) {
    var out = [], letters = LET.slice(0, n).split('');
    function rec(prefix, start, used) {
      if (out.length >= limit) return;
      if (prefix.length === k) { out.push(prefix.join('')); return; }
      for (var i = (type === 'C' || type === 'Crep') ? start : 0; i < n; i++) {
        if ((type === 'V' || type === 'P') && used[i]) continue;
        used[i] = true; prefix.push(letters[i]);
        rec(prefix, type === 'C' ? i + 1 : i, used);
        prefix.pop(); used[i] = false;
        if (out.length >= limit) return;
      }
    }
    rec([], 0, []);
    return out;
  }

  S.register('combinatorics', function (root, cfg) {
    var st = { type: cfg.type || 'C', n: cfg.n || 5, k: cfg.k || 3 };
    var ui = {};
    function build() {
      ui.type = S.select([
        ['P', 'Permutacije (raspoređuju se svi elementi)'],
        ['V', 'Varijacije bez ponavljanja (redosled bitan)'],
        ['Vrep', 'Varijacije sa ponavljanjem (redosled bitan)'],
        ['C', 'Kombinacije bez ponavljanja (redosled nebitan)'],
        ['Crep', 'Kombinacije sa ponavljanjem (redosled nebitan)']
      ], st.type, function (v) { st.type = v; draw(); });
      ui.n = S.number(1, 60, st.n, function (v) { st.n = v; draw(); });
      ui.k = S.number(0, 60, st.k, function (v) { st.k = v; draw(); });
      ui.kWrap = S.field('k (koliko biramo)', ui.k);
      root.appendChild(S.h('div', { class: 'sim-row' }, [S.field('Vrsta', ui.type), S.field('n (koliko ima elemenata)', ui.n), ui.kWrap]));
      ui.out = S.h('div', { class: 'sim-out' });
      ui.list = S.h('div', { class: 'mt-3' });
      root.appendChild(ui.out); root.appendChild(ui.list);
    }
    function draw() {
      var n = st.n, k = st.k, type = st.type, result, tex, steps, err = null;
      ui.kWrap.style.display = type === 'P' ? 'none' : '';
      if (type === 'P') { k = n; result = S.bigFact(n); tex = 'P_{' + n + '} = ' + n + '! = ' + prodText(n, n); }
      else if (type === 'V') {
        if (k > n) err = 'Bez ponavljanja ne možeš izabrati više od n elemenata (k ≤ n).';
        else { result = product(n, k); tex = 'V_{' + n + '}^{' + k + '} = \\dfrac{' + n + '!}{' + (n - k) + '!} = ' + prodText(n, k); }
      } else if (type === 'Vrep') { result = BigInt(n) ** BigInt(k); tex = '\\overline{V}_{' + n + '}^{' + k + '} = ' + n + '^{' + k + '}'; }
      else if (type === 'C') {
        if (k > n) err = 'Bez ponavljanja ne možeš izabrati više od n elemenata (k ≤ n).';
        else { result = S.bigChoose(n, k); tex = 'C_{' + n + '}^{' + k + '} = \\dbinom{' + n + '}{' + k + '} = \\dfrac{' + prodText(n, k) + '}{' + k + '!}'; }
      } else { result = S.bigChoose(n + k - 1, k); tex = '\\overline{C}_{' + n + '}^{' + k + '} = \\dbinom{' + (n + k - 1) + '}{' + k + '} = \\dfrac{' + prodText(n + k - 1, k) + '}{' + k + '!}'; }
      ui.out.innerHTML = ''; ui.list.innerHTML = '';
      if (err) { ui.out.appendChild(S.h('div', { class: 'text-danger', text: err })); return; }
      ui.out.appendChild(S.h('div', { text: '\\[ ' + tex + ' \\]' }));
      ui.out.appendChild(S.h('div', { class: 'sim-big', text: 'Ukupno: ' + S.fmtBig(result) + (result > 10n ** 12n ? ' (≈ ' + Number(result).toExponential(2).replace('.', ',') + ')' : '') }));
      S.renderMath(ui.out);
      if (n <= 8 && result <= 5000n || n <= 5) {
        var items = enumerate(type, n, k, 120);
        ui.list.appendChild(S.h('div', { class: 'small text-muted mb-1', text: 'Svi slučajevi (elementi su ' + LET.slice(0, n).split('').join(', ') + '); prikazano ' + items.length + (result > BigInt(items.length) ? ' od ' + result : '') + ':' }));
        ui.list.appendChild(S.h('div', { class: 'sim-list' }, items.map(function (s) { return S.h('span', { text: s }); })));
      } else {
        ui.list.appendChild(S.h('div', { class: 'small text-muted', text: 'Za n ≤ 5 (ili manje od 5000 rezultata) ispod se nabrajaju i svi slučajevi.' }));
      }
    }
    build(); draw();
  });
})();
