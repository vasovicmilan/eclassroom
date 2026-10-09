// Provera celokupnog sadržaja pre commit-a:  node scripts/validate-content.js
// Proverava predmete, lekcije i materijale prema modelima iz src/models/.
import { access } from 'fs/promises';
import { join } from 'path';
import { validateSubjects, validateLection, validateMaterial, BLOCK_EXAMPLES, validateBlocks } from '../src/models/index.js';
import { PUBLIC_DIR } from '../src/config/paths.config.js';
import { jsonPath, readJson, readJsonDir } from '../src/utils/json.utils.js';

const exists = p => access(p).then(() => true, () => false);
const problems = [];

const subjects = await readJson(jsonPath('subjects.json'));
problems.push(...validateSubjects(subjects));
const slugs = subjects.map(s => s.slug);

// lekcije: lections/<slug-predmeta>.json
let lectionCount = 0;
const seen = new Set();
for (const { file, data } of await readJsonDir(jsonPath('lections'))) {
  const expected = file.replace(/\.json$/, '');
  for (const l of data) {
    lectionCount++;
    problems.push(...validateLection(l));
    if (l.subjectSlug !== expected) problems.push(`${file}: lekcija "${l.slug}" ima subjectSlug "${l.subjectSlug}", a fajl je za "${expected}"`);
    if (!slugs.includes(l.subjectSlug)) problems.push(`${l.slug}: predmet "${l.subjectSlug}" ne postoji u subjects.json`);
    const key = `${l.subjectSlug}/${l.slug}`;
    if (seen.has(key)) problems.push(`${key}: duplirana lekcija (isti slug u istom predmetu)`);
    seen.add(key);
  }
}
for (const s of subjects) if (!(await exists(jsonPath('lections', `${s.slug}.json`)))) problems.push(`predmet ${s.slug}: nema fajla lections/${s.slug}.json`);

// materijali (opciono); PDF fajlovi se proveravaju samo kad folder public/pdf postoji
let materialCount = 0;
const hasPdfDir = await exists(join(PUBLIC_DIR, 'pdf'));
for (const { file, data } of await readJsonDir(jsonPath('materials'))) {
  for (const m of data) {
    materialCount++;
    problems.push(...validateMaterial(m));
    if (m.subjectSlug !== file.replace(/\.json$/, '')) problems.push(`materials/${file}: "${m.title}" ima drugi subjectSlug (${m.subjectSlug})`);
    if (hasPdfDir && m.available && m.file && !(await exists(join(PUBLIC_DIR, 'pdf', m.file)))) problems.push(`materijal "${m.title}": fajl public/pdf/${m.file} ne postoji`);
  }
}

// primeri blokova moraju biti ispravni
for (const [type, example] of Object.entries(BLOCK_EXAMPLES)) problems.push(...validateBlocks([example], `BLOCK_EXAMPLES.${type}`));

console.log(`Proverio ${subjects.length} predmeta, ${lectionCount} lekcija, ${materialCount} materijala.`);
if (problems.length) {
  console.log(`\nProblema: ${problems.length}\n` + problems.map(p => ' - ' + p).join('\n'));
  process.exit(1);
}
console.log('Sve je u redu.');
