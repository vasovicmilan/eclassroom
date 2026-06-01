import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const extraMaterialsPath = join(__dirname, '..', 'public', 'json', 'extra-material.json');
let cachedData = null;

async function loadExtraMaterials() {
  if (cachedData === null) {
    const data = await readFile(extraMaterialsPath, 'utf-8');
    cachedData = JSON.parse(data);
  }
  return cachedData;
}

const extraMaterialsRepository = {
  async getAll() {
    return await loadExtraMaterials();
  }
};

export default extraMaterialsRepository;