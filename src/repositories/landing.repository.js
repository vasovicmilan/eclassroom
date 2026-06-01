import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const landingPath = join(__dirname, '..', 'public', 'json', 'landing.json');
let cachedData = null;

async function loadLandingData() {
  if (cachedData === null) {
    const data = await readFile(landingPath, 'utf-8');
    cachedData = JSON.parse(data);
  }
  return cachedData;
}

const landingRepository = {
  async getFeatures() {
    const data = await loadLandingData();
    return data.features;
  },
  async getProjectInfo() {
    const data = await loadLandingData();
    return data.projectInfo;
  },
  async getMeta() {
    const data = await loadLandingData();
    return data.meta;
  },
  async getAll() {
    return await loadLandingData();
  }
};

export default landingRepository;