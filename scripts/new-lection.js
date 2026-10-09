// Dodaje novu (zaključanu) lekciju u public/json/lections/<predmet>.json
//   node scripts/new-lection.js <slug-predmeta> "Naslov lekcije" [--template teorijska|prakticna|prazna] [--week 3] [--date 2026-10-20]
// Bez --week i --date uzima sledeću nedelju i datum 7 dana posle poslednje lekcije.
import { createLection, validateLection } from '../src/models/index.js';
import { LECTION_TEMPLATES, TEMPLATE_NAMES } from '../src/models/templates.js';
import { jsonPath, readJson, writeJson } from '../src/utils/json.utils.js';
import { addDays, todayIso } from '../src/utils/date.utils.js';
import { takeOption, fail } from '../src/utils/cli.utils.js';

const args = process.argv.slice(2);
const template = takeOption(args, 'template') || 'teorijska';
const weekArg = takeOption(args, 'week');
const dateArg = takeOption(args, 'date');
const [subjectSlug, title] = args;

if (!subjectSlug || !title || args.includes('--help')) {
  console.log(`Upotreba: node scripts/new-lection.js <slug-predmeta> "Naslov" [--template ${TEMPLATE_NAMES.join('|')}] [--week N] [--date YYYY-MM-DD]`);
  process.exit(args.includes('--help') ? 0 : 1);
}
if (!LECTION_TEMPLATES[template]) fail(`Nepoznat šablon "${template}". Dostupni: ${TEMPLATE_NAMES.join(', ')}`);

const file = jsonPath('lections', `${subjectSlug}.json`);
const lections = await readJson(file).catch(() => fail(`Predmet "${subjectSlug}" nema fajl lections/${subjectSlug}.json`));

const last = lections.at(-1);
const week = weekArg ? Number(weekArg) : (last ? last.week + 1 : 1);
const date = dateArg || (last ? addDays(last.date, 7) : todayIso());
const lection = createLection({ subjectSlug, title, week, date, blocks: LECTION_TEMPLATES[template]() });

if (lections.some(l => l.slug === lection.slug)) fail(`Lekcija sa slugom "${lection.slug}" već postoji.`);
const problems = validateLection(lection);
if (problems.length) fail(problems);

await writeJson(file, [...lections, lection]);
console.log(`Dodata lekcija "${title}" (slug: ${lection.slug}, nedelja ${week}, ${lection.formattedDate}) u lections/${subjectSlug}.json.`);
console.log('Zaključana je (available: false) – postavi "available": true kad je sadržaj spreman.');
