# Arhitektura

```
routes  →  controllers  →  services  →  repositories  →  public/json/*.json
                              ↑
                           models (oblik + provera podataka)
```

- **routes** – samo mapiranje URL-a na funkcije; svi predmeti idu kroz `routes/web/subject.routes.js`.
- **controllers** – uzmu podatke iz servisa i pozovu `res.render`. Bez `try/catch`: Express 5 sam prosleđuje greške iz `async` funkcija u `error.middleware.js`. Greške se prave sa `errors.notFound(...)` itd.
- **services** – logika (sortiranje, grupisanje, plan rada, statistika). `subjectService.getSubjectPageData()` sastavlja sve za stranicu predmeta.
- **repositories** – samo čitanje JSON-a (keširano pri prvom zahtevu). Svaki je nekoliko linija preko `utils/json.utils.js`.
- **models** – `src/models/`: oblik, `create…` i `validate…` za predmet, lekciju, materijal i blok.

## Zajednički alati

| Fajl | Šta nudi |
|---|---|
| `config/paths.config.js` | `SRC_DIR`, `ROOT_DIR`, `PUBLIC_DIR`, `VIEWS_DIR`, `JSON_DIR`, `NODE_MODULES_DIR` (nigde više `__dirname`) |
| `utils/json.utils.js` | `readJson`, `writeJson`, `readJsonDir`, `readJsonDirFlat`, `jsonPath`, `memoize` |
| `utils/date.utils.js` | `formatDate`, `addDays`, `todayIso`, `startOfDay`, `dayStatus`, `isIsoDate` |
| `utils/string.utils.js` | `slugify`, `isSlug`, `SLUG_PATTERN` |
| `utils/collection.utils.js` | `groupBy`, `sortBy`, `findBySlug` |
| `utils/validate.utils.js` | `missingFields`, `badDates`, `isNonNegativeInt` (koriste ih svi modeli) |
| `utils/overview.utils.js` | `buildSubjectOverview` – status lekcija, statistika, plan rada, trenutna lekcija |
| `utils/error.utils.js` | `errors.notFound()...`, `createError`, `catchAsync` |
| `utils/cli.utils.js` | `takeOption`, `fail` (za skripte u `scripts/`) |
| `utils/block.types.js` | tipovi blokova i `validateBlocks` |

U šablonima je dostupna funkcija `isInPreparation(subject)` (postavlja je `view.engine.config.js`).
Skripte u `scripts/` koriste iste modele i alate kao server.
