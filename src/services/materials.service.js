import materialsRepository from '../repositories/materials.repository.js';

class MaterialsService {
  async getMaterialsBySubjectSlug(subjectSlug) {
    return await materialsRepository.getMaterialsBySubjectSlug(subjectSlug);
  }

  async getMaterialsGroupedByWeek(subjectSlug) {
    const materials = await this.getMaterialsBySubjectSlug(subjectSlug);
    const grouped = materials.reduce((acc, m) => {
      const week = m.week;
      if (!acc[week]) acc[week] = [];
      acc[week].push(m);
      return acc;
    }, {});
    return grouped;
  }
}

export default new MaterialsService();