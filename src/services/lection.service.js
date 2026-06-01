import lectionRepository from '../repositories/lection.repository.js';

class LectionService {
  async getLectionsBySubject(subjectSlug) {
    const lections = await lectionRepository.getLectionsBySubjectSlug(subjectSlug);
    return lections.sort((a, b) => a.week - b.week);
  }

  async getLectionWithNavigation(slug, subjectSlug) {
    const lections = await this.getLectionsBySubject(subjectSlug);
    const index = lections.findIndex(lec => lec.slug === slug);
    if (index === -1) {
      return { lection: null, navigation: { prev: null, next: null } };
    }
    const lection = lections[index];
    const prev = index > 0 ? lections[index - 1] : null;
    const next = index < lections.length - 1 ? lections[index + 1] : null;
    return { lection, navigation: { prev, next } };
  }

  async getLectionBySlugAndSubject(slug, subjectSlug) {
    const lections = await this.getLectionsBySubject(subjectSlug);
    return lections.find(lec => lec.slug === slug) || null;
  }
}

export default new LectionService();