// Dodaje novi predmet i prazan fajl lekcija (15 zaključanih lekcija, po jedna nedeljno).
//   node scripts/new-subject.js "Naziv predmeta" KOD --start 2026-10-12 [--emoji 📘] [--weeks 15]
import { createSubject, createLection, validateSubjects, validateLection } from '../src/models/index.js';
import { jsonPath, readJson, writeJson } from '../src/utils/json.utils.js';
import { addDays } from '../src/utils/date.utils.js';
import { slugify } from '../src/utils/string.utils.js';
import { takeOption, fail } from '../src/utils/cli.utils.js';

const args = process.argv.slice(2);
const start = takeOption(args, 'start');
const icon = takeOption(args, 'emoji') || '📘';
const weeks = Number(takeOption(args, 'weeks') || 15);
const [name, code] = args;
if (!name || !code || !start) {
  console.log('Upotreba: node scripts/new-subject.js "Naziv predmeta" KOD --start YYYY-MM-DD [--emoji 📘] [--weeks 15]');
  process.exit(1);
}

const subjectsFile = jsonPath('subjects.json');
const subjects = await readJson(subjectsFile);
const slug = slugify(name);
if (subjects.some(s => s.slug === slug)) fail(`Predmet "${slug}" već postoji.`);

const weekDate = i => addDays(start, 7 * i);
const subject = createSubject({
  id: Math.max(0, ...subjects.map(s => s.id)) + 1, slug, name, code, icon, weeks,
  startDate: weekDate(0), endDate: weekDate(weeks - 1),
});
const lections = Array.from({ length: weeks }, (_, i) =>
  createLection({ subjectSlug: slug, title: `Lekcija ${i + 1}`, week: i + 1, date: weekDate(i), blocks: [] }));

const problems = [...validateSubjects([...subjects, subject]), ...lections.flatMap(validateLection)];
if (problems.length) fail(problems);

await writeJson(subjectsFile, [...subjects, subject]);
await writeJson(jsonPath('lections', `${slug}.json`), lections);
console.log(`Predmet "${name}" dodat (slug: ${slug}, ${weeks} lekcija od ${weekDate(0)}).`);
console.log(`Dopuni opis, ESPB, časove i linkove u subjects.json; nazive lekcija menjaj u lections/${slug}.json.`);
