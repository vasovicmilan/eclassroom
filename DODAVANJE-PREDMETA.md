# Predmeti, lekcije i materijali – modeli i uputstvo

Svi predmeti rade kroz jedan generički router (`src/routes/web/subject.routes.js`).
Ne treba novi kontroler, nove rute ni nova navigacija – sve se čita iz podataka:

```
src/public/json/
  subjects.json              niz predmeta
  lections/<slug>.json       niz lekcija jednog predmeta
  materials/<slug>.json      niz materijala (PDF/PPTX) jednog predmeta
```

## Modeli (jedino mesto gde je definisan oblik podataka)

| Fajl | Šta sadrži |
|---|---|
| `src/models/subject.model.js` | oblik predmeta, `createSubject()`, `validateSubject(s)` |
| `src/models/lection.model.js` | oblik lekcije, `createLection()`, `validateLection()` (uključuje pravila strukture) |
| `src/models/material.model.js` | oblik materijala, `createMaterial()`, `validateMaterial()` |
| `src/models/block.model.js` | po jedan ispravan primer za svaki tip bloka, `createBlock(tip, izmene)` |
| `src/models/templates.js` | šabloni lekcija: `prazna`, `teorijska`, `prakticna` |

Zajednički alati (datumi, JSON, slug, provere) su u `src/utils/` – vidi `ARHITEKTURA.md`.

Oblik je namerno ravan (sve se vezuje preko `slug`-a), pa se kasnije lako prenosi u bazu
(npr. MongoDB kolekcije `subjects`, `lections`, `materials`).

Gotovi šabloni za ručno kopiranje su u `templates/` (generišu se sa `node scripts/export-templates.js`).

## Komande

```bash
node scripts/validate-content.js                      # provera svega (radi i pri pokretanju servera kao upozorenja u logu)
node scripts/new-subject.js "Naziv predmeta" KOD --start 2026-10-12 [--emoji 📘] [--weeks 15]
node scripts/new-lection.js <slug-predmeta> "Naslov lekcije" [--template teorijska|prakticna|prazna] [--week 3] [--date 2026-10-20]
node scripts/export-templates.js                      # osvežava templates/
```

- `new-subject` upisuje predmet u `subjects.json` (sa oznakom "U pripremi") i pravi `lections/<slug>.json`
  sa 15 zaključanih lekcija, po jedna svakih 7 dana od zadatog početka.
- `new-lection` dodaje jednu zaključanu lekciju sa strukturom iz šablona; nedelja i datum se nastavljaju na poslednju lekciju.

## Novi predmet ručno = 2 koraka

1. Unos u `subjects.json` (kopiraj `templates/subject.template.json`).
2. Fajl `lections/<slug-predmeta>.json` sa nizom lekcija.

Predmet se odmah pojavljuje na početnoj, u padajućem meniju "Predmeti" i na svojoj stranici.

## Polja predmeta (`subjects.json`)

| Polje | Napomena |
|---|---|
| `id`, `slug`, `code` | jedinstveni; `slug` je kebab-case i deo URL-a |
| `espb` | ceo broj ili `null` |
| `lectures`, `exercises` | tekst ("2 časa nedeljno") ili `null` – prikazuje se "–" |
| `weeks`, `startDate`, `endDate` | broj nedelja i period nastave (`YYYY-MM-DD`) |
| `status` | `"u-pripremi"` prikazuje oznaku i ne računa predmet u "Aktivna predmeta". Kad je spreman, obriši polje. |
| `resources.plan / results / questions` | linkovi (Drive, PDF...); `"#"` dok ne postoje |
| `grading` | izostavljeno = standardno ocenjivanje 10/10/30/30/20 (stari predmeti). `{"items": []}` = "biće objavljeno". Sa stavkama: `{ "items": [{ "label": "Kolokvijum 1", "icon": "📝", "points": 30 }], "passThreshold": 51, "note": "..." }`. `points: null` prikazuje "–". Ako su svi bodovi upisani, zbir mora biti 100. |

## Polja lekcije (`lections/<slug>.json`)

`slug`, `subjectSlug`, `title`, `description`, `week`, `date`, `formattedDate`, `available`, `content.blocks[]`.

- `available: false` – lekcija je zaključana (🔒). Kad je sadržaj spreman: popuni blokove i postavi `true`.
- `formattedDate` mora odgovarati `date` (provera javlja grešku ako ne odgovara).
- Tipovi blokova i polja: `BLOKOVI.md`.

### Pravila strukture lekcije (proverava validator)

- Naslovi idu redom: `h2` → `h3` → `h4`, bez preskakanja nivoa.
- Glavni odeljci su `h2`; podteme su `h3`. Ne stavljaj podteme kao `h2`.
- Ne upisuj ručno brojeve u naslov ("1. Uvod"). Za numerisane odeljke dodaj `"numbered": true` na `h2` blok – brojevi se računaju sami.
- Naslov se ne završava dvotačkom.
- Preporučeni kostur: Uvod → glavni odeljci → primer → Zaključak (vidi šablone `teorijska` i `prakticna`).

## Materijali (`materials/<slug>.json`)

`subjectSlug`, `week` (0 = ceo semestar), `title`, `file` (putanja ispod `public/pdf/`), `date`, `formattedDate`, `available`.
Fajl mora postojati u `src/public/pdf/<file>` (validator proverava kad taj folder postoji).

## Napomena

Nazivi lekcija u novim predmetima su predlog standardnog plana – prepravi ih prema stvarnom programu.

## Otključavanje po datumu

Lekcija i materijal (nedelja ≥ 1) vide se tek kada nastupi njihov `date` (po beogradskom vremenu). Lekcija pre toga pokazuje „zaključano“, a materijal se ne prikazuje.
Za pregled unapred pokreni: `UNLOCK_ALL=true npm run start-dev` (na Windows-u: `set UNLOCK_ALL=true && npm run start-dev`).
Napomena: sam PDF fajl i dalje može da se otvori ako neko zna tačan link do njega.
