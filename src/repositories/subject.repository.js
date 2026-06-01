import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const subjectsPath = join(__dirname, '..', 'public', 'json', 'subjects.json');
let cachedSubjects = null;

async function loadSubjects() {
  if (cachedSubjects === null) {
    const data = await readFile(subjectsPath, 'utf-8');
    cachedSubjects = JSON.parse(data);
  }
  return cachedSubjects;
}

const subjectRepository = {
  async getAllSubjects() {
    return await loadSubjects();
  },
  async getSubjectBySlug(slug) {
    const subjects = await loadSubjects();
    return subjects.find(s => s.slug === slug) || null;
  }
};

export default subjectRepository;