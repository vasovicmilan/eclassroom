// Generiše kopirljive šablone u templates/ (node scripts/export-templates.js)
import { mkdir } from 'fs/promises';
import { join } from 'path';
import { createSubject, createLection, createMaterial, BLOCK_EXAMPLES } from '../src/models/index.js';
import { LECTION_TEMPLATES } from '../src/models/templates.js';
import { ROOT_DIR } from '../src/config/paths.config.js';
import { writeJson } from '../src/utils/json.utils.js';

const out = join(ROOT_DIR, 'templates');
await mkdir(out, { recursive: true });
const save = (name, data) => writeJson(join(out, name), data);

await save('subject.template.json', createSubject({ id: 0, slug: 'novi-predmet', name: 'Novi predmet', code: 'NP', startDate: '2026-10-05', endDate: '2027-01-11' }));
for (const [name, build] of Object.entries(LECTION_TEMPLATES)) {
  await save(`lection-${name}.template.json`, createLection({ subjectSlug: 'novi-predmet', title: 'Naslov lekcije', week: 1, date: '2026-10-05', description: 'Kratak opis lekcije.', blocks: build() }));
}
await save('material.template.json', createMaterial({ subjectSlug: 'novi-predmet', week: 1, title: 'Prvo predavanje', file: 'novi-predmet/prvo-predavanje.pdf', date: '2026-10-05' }));
await save('blocks.examples.json', Object.values(BLOCK_EXAMPLES));
console.log('Šabloni upisani u templates/');
