// Jačina šifre: broj kombinacija (varijacije sa ponavljanjem N^k), entropija i procena vremena probijanja grubom silom.
(function () {
  var S = window.Sim;
  var SETS = [['digits', 'cifre (10)', 10], ['lower', 'mala slova (26)', 26], ['upper', 'velika slova (26)', 26], ['symbols', 'simboli (32)', 32]];
  var SPEEDS = [
    ['1e3', 'sporo, preko interneta (1 000 pokušaja u sekundi)'],
    ['1e9', 'jak računar, brza hash funkcija (1 milijarda u sekundi)'],
    ['1e12', 'veliki klaster (1 000 milijardi u sekundi)']
  ];
  function dur(sec) {
    if (sec < 1) return 'manje od sekunde';
    var u = [['godina', 31557600], ['dana', 86400], ['sati', 3600], ['minuta', 60], ['sekundi', 1]];
    if (sec >= 31557600 * 1e9) return 'više od milijardu godina (≈ ' + (sec / 31557600).toExponential(1).replace('.', ',') + ' godina)';
    if (sec >= 31557600 * 1000) return (sec / 31557600).toLocaleString('sr-RS', { maximumFractionDigits: 0 }) + ' godina';
    for (var i = 0; i < u.length; i++) if (sec >= u[i][1]) return (sec / u[i][1]).toLocaleString('sr-RS', { maximumFractionDigits: 1 }) + ' ' + u[i][0];
    return '';
  }
  S.register('password', function (root, cfg) {
    var st = { len: cfg.length || 8, sets: { digits: cfg.digits !== false, lower: cfg.lower !== false, upper: !!cfg.upper, symbols: !!cfg.symbols }, speed: '1e9' };
    var ui = {};
    function build() {
      var checks = SETS.map(function (s) {
        var cb = S.h('input', { type: 'checkbox', class: 'form-check-input', id: 'pw-' + s[0] + Math.random().toString(36).slice(2, 6) });
        cb.checked = st.sets[s[0]];
        cb.addEventListener('change', function () { st.sets[s[0]] = cb.checked; draw(); });
        return S.h('div', { class: 'form-check form-check-inline' }, [cb, S.h('label', { class: 'form-check-label', for: cb.id, text: s[1], style: 'display:inline' })]);
      });
      var range = S.h('input', { type: 'range', class: 'form-range', min: 1, max: 24, value: st.len });
      ui.lenLabel = S.h('strong', { text: String(st.len) });
      range.addEventListener('input', function () { st.len = Number(range.value); draw(); });
      root.appendChild(S.h('div', { class: 'sim-row' }, [S.h('div', {}, [S.h('label', { text: 'Dozvoljeni znaci' }), S.h('div', {}, checks)])]));
      root.appendChild(S.h('div', { class: 'sim-row' }, [S.h('div', { style: 'min-width:16rem' }, [S.h('label', { text: 'Dužina šifre: ' }), ui.lenLabel, range]), S.field('Napadač proba…', S.select(SPEEDS, st.speed, function (v) { st.speed = v; draw(); }))]));
      ui.out = S.h('div', { class: 'sim-out' });
      root.appendChild(ui.out);
    }
    function draw() {
      var a = SETS.reduce(function (sum, s) { return sum + (st.sets[s[0]] ? s[2] : 0); }, 0);
      ui.lenLabel.textContent = String(st.len);
      ui.out.innerHTML = '';
      if (a === 0) { ui.out.appendChild(S.h('div', { class: 'text-danger', text: 'Izaberi bar jednu vrstu znakova.' })); return; }
      var combos = BigInt(a) ** BigInt(st.len), bits = st.len * Math.log2(a), speed = Number(st.speed);
      var avg = Number(combos) / speed / 2;
      var level = bits < 28 ? ['vrlo slaba', '#dc3545', 15] : bits < 40 ? ['slaba', '#fd7e14', 35] : bits < 60 ? ['osrednja', '#ffc107', 55] : bits < 80 ? ['jaka', '#198754', 80] : ['vrlo jaka', '#0d6efd', 100];
      ui.out.appendChild(S.h('div', { text: '\\[ N = ' + a + '^{' + st.len + '} \\]' }));
      ui.out.appendChild(S.h('div', { class: 'sim-big', text: S.fmtBig(combos) + ' mogućih šifri' }));
      ui.out.appendChild(S.h('div', { html: 'Entropija: <strong>' + bits.toFixed(1).replace('.', ',') + ' bita</strong> (' + st.len + ' · log₂ ' + a + ') · Prosečno vreme probijanja: <strong>' + dur(avg) + '</strong>' }));
      ui.out.appendChild(S.h('div', { class: 'sim-meter my-2' }, [S.h('div', { style: 'width:' + level[2] + '%;background:' + level[1] })]));
      ui.out.appendChild(S.h('div', { html: 'Ocena: <strong style="color:' + level[1] + '">' + level[0] + '</strong>' }));
      ui.out.appendChild(S.h('div', { class: 'small text-muted mt-2', text: 'Napomena: ovo važi za šifru čiji su znaci birani potpuno nasumično. Ljudske šifre (reči, datumi, „sifra123“) imaju mnogo manje mogućnosti i probijaju se rečnicima. Prosečno se šifra pronađe posle polovine pokušaja.' }));
      S.renderMath(ui.out);
    }
    build(); draw();
  });
})();
