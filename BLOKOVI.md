# Blokovi lekcije

Lekcija je niz blokova: `content.blocks` u `src/public/json/lections/<predmet>.json`.
Svaki blok je jedna stvar (naslov, pasus, lista...), redosled u nizu je redosled na stranici.
Tipovi su definisani na jednom mestu: `src/utils/block.types.js`. Prikaz svakog tipa je u `src/views/blocks/<tip>.ejs`.

Provera sadržaja pre commit-a: `node scripts/validate-content.js`
(isto se prijavljuje u logu pri pokretanju servera).

Tekstualna polja mogu da sadrže HTML (`<strong>`, `<code>`, `<br>`...).

| Tip | Polja | Napomena |
|---|---|---|
| `heading` | `level` (2/3/4), `text`, opciono `numbered` (samo za nivo 2) | 2 = glavni naslov (sa linijom iznad); `numbered: true` dodaje automatski broj odeljka |
| `paragraph` | `text`, `muted` (opciono) | |
| `callout` | `text`, `variant` (info/primary/secondary/success/warning/danger), `title`, `note` | istaknuta kutija |
| `list` | `items[]`, `style` (group/flush/numbered/bullets/ordered) | |
| `icon-list` | `items[{icon, text}]` | |
| `cards` | `layout` (grid/pair), `columns` (2/3/4), `items[{icon, title, text, items[], example}]` | `grid` = male kartice, `pair` = dve velike |
| `columns` | `left{title, items[]}`, `right{...}` | dve kolone sa listama |
| `table` | `headers[]`, `rows[[...]]` | svaki red mora imati koliko i headers |
| `code` | `code`, `description`, `summary` | sa `summary` je sklopivo |
| `image` | `src`, `alt`, `caption` | |
| `gallery` | `images[{src, caption}]` | |
| `image-text` | `images[]`, `paragraphs[]`, `items[]` | slika levo, tekst desno |
| `video` | `src` | |
| `links` | `items[{title, url}]` | |
| `accordion` | `id`, `items[{title, items[{code, text, examples[]}]}]` | `id` mora biti jedinstven na stranici |
| `download` | `url`, `label`, `description` | dugme |
| `badges` | `items[]` | |
| `quote` | `text`, `source` | |
| `panel` | `title`, `blocks[]` | kartica koja sadrži druge blokove |
| `flow` | `nodes[{title, sub}]` | niz sa strelicama |
| `distributions` | `items[{name, description, url, label}]` | |
| `divider` | – | horizontalna linija |
| `http-explorer`, `api-examples`, `dashboard` | `config`, `scripts[]` | interaktivni primeri (Otvoreno računarstvo) |
| `html` | `html` | izlaz u slučaju nužde; izbegavati |

## Primer lekcije

```json
{
  "slug": "01-uvod",
  "subjectSlug": "informatika",
  "title": "Uvod u informatiku",
  "description": "Kratak opis.",
  "week": 1,
  "date": "2026-10-05",
  "formattedDate": "05.10.2026.",
  "available": true,
  "content": {
    "blocks": [
      { "type": "heading", "level": 2, "text": "Šta je informatika?" },
      { "type": "paragraph", "text": "Prvi pasus sa <strong>naglašenim</strong> delom." },
      { "type": "callout", "variant": "primary", "text": "Ključna poruka." },
      { "type": "list", "style": "flush", "items": ["prva stavka", "druga stavka"] }
    ]
  }
}
```

## Novi tip bloka

1. Red u `BLOCK_TYPES` u `src/utils/block.types.js` (obavezna polja + opciona pravila).
2. Fajl `src/views/blocks/<tip>.ejs` (polje `block` je dostupno).

## Matematički blokovi (formule)

Formule se pišu u tekstualnim poljima kao `\( ... \)` (u liniji) ili `\[ ... \]` (poseban red); KaTeX se učitava sam samo na stranicama koje ih imaju (`public/js/math-render.js`).
U JSON-u se obrnuta kosa crta duplira: `"\\(P(A)=\\dfrac{m}{n}\\)"`. U inline formulama izbegavati `<` i `>` (pisati `\lt`, `\gt`).

| Tip | Polja | Napomena |
|---|---|---|
| `formula` | `items[{label, tex, note}]`, `note` (opciono) | `tex` je čist LaTeX bez delimitera, prikazuje se u posebnom redu |
| `worked-example` | `title`, `source`, `problem`, `given[]` (opciono), `steps[{title?, content}]`, `answer` | rešenje je sklopivo ("Prikaži rešenje") |

### Interaktivne vežbe (`simulation`)

Blok `simulation` ubacuje malu interaktivnu vežbu u lekciju (`src/public/js/simulations/`, stilovi `css/pages/simulations.css`).

| Polje | Napomena |
|---|---|
| `kind` | `dice` (kockice), `cards` (karte, sa/bez vraćanja), `combinatorics` (kalkulator V/C/P), `password` (jačina šifre), `bayes` (test i Bajes), `binomial`, `stats` (statistika uzorka) |
| `title`, `description`, `hint` | naslov kartice, uvodni tekst i savet ispod (HTML, mogu imati formule) |
| `config` | početna podešavanja (npr. `{"mode":"face","dice":3,"face":6,"cmp":">=","target":1}`) |
| `scripts` | obavezno: `["simulations/common.js", "simulations/<kind>.js"]` (za `combinatorics` je fajl `combo.js`) |

Nova vežba: fajl `js/simulations/<naziv>.js` sa `Sim.register('<kind>', function (root, config) {...})`, naziv dodat u `SIMULATION_KINDS` u `utils/block.types.js`.
