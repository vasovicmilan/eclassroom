// Medicinski test i Bajesova formula: prirodne frekvencije na populaciji od 10 000 ljudi.
(function () {
  var S = window.Sim;
  S.register('bayes', function (root, cfg) {
    var N = 10000;
    var st = { prev: cfg.prevalence == null ? 1 : cfg.prevalence, sens: cfg.sensitivity == null ? 95 : cfg.sensitivity, fp: cfg.falsePositive == null ? 5 : cfg.falsePositive };
    var ui = {};
    function slider(label, min, max, step, key) {
      var out = S.h('strong', {});
      var r = S.h('input', { type: 'range', class: 'form-range', min: min, max: max, step: step, value: st[key] });
      r.addEventListener('input', function () { st[key] = Number(r.value); draw(); });
      ui[key] = out;
      return S.h('div', { style: 'min-width:15rem;flex:1' }, [S.h('label', { text: label + ': ' }), out, r]);
    }
    function build() {
      root.appendChild(S.h('div', { class: 'sim-row' }, [
        slider('Procenat obolelih u populaciji', 0.1, 50, 0.1, 'prev'),
        slider('Test je pozitivan kod obolelih (osetljivost) %', 50, 100, 1, 'sens'),
        slider('Test je pozitivan kod zdravih (lažno pozitivni) %', 0, 30, 0.5, 'fp')
      ]));
      ui.dots = S.h('div', { class: 'sim-dots my-2' });
      ui.legend = S.h('div', { class: 'sim-legend' });
      ui.out = S.h('div', { class: 'sim-out' });
      [ui.dots, ui.legend, ui.out].forEach(function (e) { root.appendChild(e); });
    }
    function draw() {
      ui.prev.textContent = S.num(st.prev, 1) + ' %'; ui.sens.textContent = st.sens + ' %'; ui.fp.textContent = S.num(st.fp, 1) + ' %';
      var sick = Math.round(N * st.prev / 100), healthy = N - sick;
      var tp = Math.round(sick * st.sens / 100), fn = sick - tp, fpc = Math.round(healthy * st.fp / 100), tn = healthy - fpc;
      var pos = tp + fpc, post = pos ? tp / pos : 0, negSick = (fn + tn) ? fn / (fn + tn) : 0;
      // 1000 tačkica (svaka predstavlja 10 ljudi), poredak: oboleli pozitivni, oboleli negativni, zdravi pozitivni, zdravi negativni
      var parts = [[tp, '#dc3545'], [fn, '#fd7e14'], [fpc, '#ffc107'], [tn, '#ced4da']], dots = [], used = 0;
      parts.forEach(function (p, i) {
        var d = i === parts.length - 1 ? 1000 - used : Math.round(p[0] / 10);
        if (tp > 0 && i === 0 && d === 0) d = 1;
        used += d; for (var j = 0; j < d; j++) dots.push(p[1]);
      });
      ui.dots.innerHTML = '';
      dots.slice(0, 1000).forEach(function (c) { ui.dots.appendChild(S.h('i', { style: 'background:' + c })); });
      ui.legend.innerHTML = '<span><i style="background:#dc3545"></i>bolestan, test pozitivan: ' + tp + ' &nbsp;</span><span><i style="background:#fd7e14"></i>bolestan, test negativan: ' + fn + ' &nbsp;</span><span><i style="background:#ffc107"></i>zdrav, test pozitivan: ' + fpc + ' &nbsp;</span><span><i style="background:#ced4da"></i>zdrav, test negativan: ' + tn + '</span> <span class="text-muted">(jedna tačkica = 10 ljudi od ' + N + ')</span>';
      ui.out.innerHTML = '';
      ui.out.appendChild(S.h('div', { text: '\\[ P(\\text{bolestan}\\mid +)=\\dfrac{P(H_1)\\,P(+\\mid H_1)}{P(H_1)\\,P(+\\mid H_1)+P(H_2)\\,P(+\\mid H_2)}=\\dfrac{' + tp + '}{' + tp + '+' + fpc + '} \\]' }));
      ui.out.appendChild(S.h('div', { class: 'sim-big', text: 'Ako je test pozitivan, verovatnoća da je osoba bolesna: ' + S.pct(post) }));
      ui.out.appendChild(S.h('div', { class: 'small', text: 'Ako je test negativan, verovatnoća da je osoba ipak bolesna: ' + S.pct(negSick) + '. Od ' + pos + ' pozitivnih testova stvarno je bolesno ' + tp + '.' }));
      S.renderMath(ui.out);
    }
    build(); draw();
  });
})();
