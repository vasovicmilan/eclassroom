import subjectRepository from '../repositories/subject.repository.js';

class SubjectService {
  async getAllSubjects() {
    return await subjectRepository.getAllSubjects();
  }

  async getSubjectBySlug(slug) {
    return await subjectRepository.getSubjectBySlug(slug);
  }
}

export default new SubjectService();