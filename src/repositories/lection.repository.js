import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const lectionsPath = join(__dirname, '..', 'public', 'json', 'lections.json');

let cachedLections = null;

async function loadLections() {
  if (cachedLections === null) {
    const data = await readFile(lectionsPath, 'utf-8');
    cachedLections = JSON.parse(data);
  }
  return cachedLections;
}


const lectionRepository = {
  async getAllLections() {
    return await loadLections();
  },

  async getLectionsBySubjectSlug(subjectSlug) {
    const lections = await loadLections();
    return lections.filter(lec => lec.subjectSlug === subjectSlug);
  },

  async getLectionBySlug(slug) {
    const lections = await loadLections();
    return lections.find(lec => lec.slug === slug) || null;
  },

  async getLectionBySlugAndSubjectSlug(slug, subjectSlug) {
    const lections = await loadLections();
    return lections.find(lec => lec.slug === slug && lec.subjectSlug === subjectSlug) || null;
  }
};

export default lectionRepository;