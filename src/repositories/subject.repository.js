import { jsonPath, readJson, memoize } from '../utils/json.utils.js';
import { findBySlug } from '../utils/collection.utils.js';

const loadSubjects = memoize(() => readJson(jsonPath('subjects.json')));

const subjectRepository = {
  getAllSubjects: () => loadSubjects(),
  async getSubjectBySlug(slug) {
    return findBySlug(await loadSubjects(), slug);
  },
};

export default subjectRepository;
