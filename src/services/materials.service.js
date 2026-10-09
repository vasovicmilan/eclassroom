import materialsRepository from '../repositories/materials.repository.js';
import { isUnlocked } from '../utils/unlock.utils.js';
import { groupBy } from '../utils/collection.utils.js';

class MaterialsService {
  // Materijali budućih nedelja se ne prikazuju dok ne nastupi njihov datum.
  async getMaterialsBySubjectSlug(subjectSlug) {
    return (await materialsRepository.getMaterialsBySubjectSlug(subjectSlug)).filter(isUnlocked);
  }

  /** { 0: [...], 1: [...] } – materijali po nedeljama (0 = ceo semestar). */
  async getMaterialsGroupedByWeek(subjectSlug) {
    return groupBy(await this.getMaterialsBySubjectSlug(subjectSlug), m => m.week);
  }
}

export default new MaterialsService();
