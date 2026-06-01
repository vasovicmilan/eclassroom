import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const materialsPath = join(__dirname, '..', 'public', 'json', 'materials.json');
let cachedMaterials = null;

async function loadMaterials() {
  if (cachedMaterials === null) {
    const data = await readFile(materialsPath, 'utf-8');
    cachedMaterials = JSON.parse(data);
  }
  return cachedMaterials;
}

const materialsRepository = {
  async getAllMaterials() {
    return await loadMaterials();
  },
  async getMaterialsBySubjectSlug(subjectSlug) {
    const materials = await loadMaterials();
    return materials.filter(m => m.subjectSlug === subjectSlug);
  }
};

export default materialsRepository;