import { jsonPath, readJson, memoize } from '../utils/json.utils.js';

const loadExtraMaterials = memoize(() => readJson(jsonPath('extra-material.json')));

const extraMaterialsRepository = {
  getAll: () => loadExtraMaterials(),
};

export default extraMaterialsRepository;
