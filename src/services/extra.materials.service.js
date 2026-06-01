import extraMaterialsRepository from '../repositories/extra.materials.repository.js';

class ExtraMaterialsService {
  async getPageData() {
    return await extraMaterialsRepository.getAll();
  }
}

export default new ExtraMaterialsService();