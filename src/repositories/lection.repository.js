import { logger } from '../config/logger.config.js';
import { jsonPath, readJsonDirFlat, memoize } from '../utils/json.utils.js';
import { findBySlug } from '../utils/collection.utils.js';
import { validateLection } from '../models/lection.model.js';

// Lekcije svakog predmeta su u zasebnom fajlu: public/json/lections/<slug-predmeta>.json
const loadLections = memoize(async () => {
  const lections = await readJsonDirFlat(jsonPath('lections'));
  // greške u sadržaju se samo prijavljuju u logu, stranica se i dalje prikazuje
  for (const lection of lections) {
    for (const problem of validateLection(lection)) logger.warn(problem);
  }
  return lections;
});

const lectionRepository = {
  getAllLections: () => loadLections(),

  async getLectionsBySubjectSlug(subjectSlug) {
    return (await loadLections()).filter(l => l.subjectSlug === subjectSlug);
  },

  async getLectionBySlug(slug) {
    return findBySlug(await loadLections(), slug);
  },

  async getLectionBySlugAndSubjectSlug(slug, subjectSlug) {
    return findBySlug(await this.getLectionsBySubjectSlug(subjectSlug), slug);
  },
};

export default lectionRepository;
