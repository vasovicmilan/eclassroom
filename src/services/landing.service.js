import landingRepository from '../repositories/landing.repository.js';

class LandingService {
  async getFeatures() {
    return await landingRepository.getFeatures();
  }

  async getProjectInfo() {
    return await landingRepository.getProjectInfo();
  }

  async getMeta() {
    return await landingRepository.getMeta();
  }

  async getAllLandingData() {
    return await landingRepository.getAll();
  }
}

export default new LandingService();