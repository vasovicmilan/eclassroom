import lectionRepository from '../repositories/lection.repository.js';
import { isUnlocked } from '../utils/unlock.utils.js';
import { sortBy, findBySlug } from '../utils/collection.utils.js';

// Lekcija se otključava kada nastupi njen datum (jednom nedeljno), a samo ako je available: true.
const applyUnlock = lection => (lection.available && !isUnlocked(lection) ? { ...lection, available: false } : lection);

class LectionService {
  async getLectionsBySubject(subjectSlug) {
    const all = await lectionRepository.getLectionsBySubjectSlug(subjectSlug);
    return sortBy(all.map(applyUnlock), l => l.week);
  }

  async getLectionWithNavigation(slug, subjectSlug) {
    const lections = await this.getLectionsBySubject(subjectSlug);
    const index = lections.findIndex(l => l.slug === slug);
    if (index === -1) return { lection: null, navigation: { prev: null, next: null } };
    return {
      lection: lections[index],
      navigation: { prev: lections[index - 1] || null, next: lections[index + 1] || null },
    };
  }

  async getLectionBySlugAndSubject(slug, subjectSlug) {
    return findBySlug(await this.getLectionsBySubject(subjectSlug), slug);
  }
}

export default new LectionService();
