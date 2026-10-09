import { jsonPath, readJson, memoize } from '../utils/json.utils.js';

const loadLanding = memoize(() => readJson(jsonPath('landing.json')));

const landingRepository = {
  getAll: () => loadLanding(),
  getFeatures: async () => (await loadLanding()).features,
  getProjectInfo: async () => (await loadLanding()).projectInfo,
  getMeta: async () => (await loadLanding()).meta,
};

export default landingRepository;
