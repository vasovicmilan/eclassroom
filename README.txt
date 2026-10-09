Verovatnoća i statistika – lekcije u tvom blok-formatu (bez ruta, kontrolera i izmena tvojih ejs fajlova osim end.ejs)

1. Raspakuj preko projekta (zamenjuje samo ove fajlove):
   src/public/json/lections/verovatnoca-i-statistika.json   (8 lekcija popunjeno u tvojim slotovima 01–07 i 10; ostalo ostaje "u pripremi")
   src/utils/block.types.js        (+2 tipa: formula, worked-example)
   src/views/blocks/formula.ejs, worked-example.ejs   (novo)
   src/views/includes/end.ejs      (+1 red: <script src="/js/math-render.js" defer>)
   src/public/js/math-render.js, src/public/css/pages/math.css   (novo)
   BLOKOVI.md                      (+ opis dva nova bloka)
   NAPOMENA: block.types.js, end.ejs i BLOKOVI.md su uzeti iz kopije koju si poslao – ako si ih posle menjao, spoji ručno (samo ta dva reda / jedan red).

2. U terminalu:  npm install katex

3. U src/config/static.config.js dodaj (pored ostalih app.use):
   app.use('/katex', express.static(path.join(__dirname, '..', '..', 'node_modules', 'katex', 'dist')));

4. U subjects.json, u unosu predmeta verovatnoca-i-statistika: obriši "status": "u-pripremi" i dodaj
   "grading": { "items": [
       { "label": "Kolokvijum 1", "icon": "📝", "points": null },
       { "label": "Kolokvijum 2", "icon": "📝", "points": null },
       { "label": "Seminarski rad", "icon": "📄", "points": null } ],
     "note": "Bez završnog ispita. Raspodela poena biće naknadno objavljena." }

5. node scripts/validate-content.js
