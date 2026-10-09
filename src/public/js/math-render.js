// Matematika u lekcijama: inline \( ... \), u posebnom redu \[ ... \].
// KaTeX (/katex) se učitava samo ako stranica ima formule (ili ako ih interaktivna vežba doda), i to jednom.
(function () {
  var DELIMS = [
    { left: '\\[', right: '\\]', display: true },
    { left: '\\(', right: '\\)', display: false }
  ];
  function load(tag, attrs) {
    return new Promise(function (resolve, reject) {
      var el = document.createElement(tag);
      Object.keys(attrs).forEach(function (k) { el[k] = attrs[k]; });
      el.onload = resolve; el.onerror = reject;
      document.head.appendChild(el);
    });
  }
  var ready = null;
  function ensure() {
    if (!ready) {
      load('link', { rel: 'stylesheet', href: '/katex/katex.min.css' });
      load('link', { rel: 'stylesheet', href: '/css/pages/math.css' });
      ready = load('script', { src: '/katex/katex.min.js' })
        .then(function () { return load('script', { src: '/katex/contrib/auto-render.min.js' }); });
    }
    return ready;
  }
  function render(el) {
    return ensure().then(function () { renderMathInElement(el, { delimiters: DELIMS, throwOnError: false }); }).catch(function () { /* bez KaTeX-a ostaje običan tekst */ });
  }
  window.renderLessonMath = render; // koristi je interaktivne vežbe (js/simulations)

  function run() {
    var root = document.querySelector('main') || document.body;
    var text = root.textContent || '';
    if (text.indexOf('\\(') === -1 && text.indexOf('\\[') === -1) return;
    render(root);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
