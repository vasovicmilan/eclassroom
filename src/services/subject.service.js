import subjectRepository from '../repositories/subject.repository.js';
import lectionService from './lection.service.js';
import materialsService from './materials.service.js';
import { isInPreparation } from '../models/subject.model.js';
import { buildSubjectOverview } from '../utils/overview.utils.js';

class SubjectService {
  getAllSubjects() {
    return subjectRepository.getAllSubjects();
  }

  getSubjectBySlug(slug) {
    return subjectRepository.getSubjectBySlug(slug);
  }

  /** Svi podaci za stranicu predmeta (lekcije, materijali, plan rada, statistika). */
  async getSubjectPageData(subject) {
    const [lections, materialsGrouped] = await Promise.all([
      lectionService.getLectionsBySubject(subject.slug),
      materialsService.getMaterialsGroupedByWeek(subject.slug),
    ]);
    return { subject, lections, materialsGrouped, ...buildSubjectOverview(lections) };
  }

  /** Brojke za početnu stranicu (predmeti "u pripremi" se ne računaju). */
  async getLandingStats() {
    const active = (await this.getAllSubjects()).filter(s => !isInPreparation(s));
    return {
      activeSubjects: active.length,
      totalLessons: active.reduce((sum, s) => sum + (s.weeks || 15), 0),
      openAccess: 100,
    };
  }
}

export default new SubjectService();
