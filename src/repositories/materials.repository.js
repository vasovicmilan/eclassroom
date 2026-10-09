import { jsonPath, readJsonDirFlat, memoize } from '../utils/json.utils.js';

// Materijali svakog predmeta su u zasebnom fajlu: public/json/materials/<slug-predmeta>.json
const loadMaterials = memoize(() => readJsonDirFlat(jsonPath('materials')));

const materialsRepository = {
  getAllMaterials: () => loadMaterials(),
  async getMaterialsBySubjectSlug(subjectSlug) {
    return (await loadMaterials()).filter(m => m.subjectSlug === subjectSlug);
  },
};

export default materialsRepository;
