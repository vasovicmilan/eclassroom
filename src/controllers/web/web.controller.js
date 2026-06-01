import subjectService from '../../services/subject.service.js';
import landingService from '../../services/landing.service.js';
import extraMaterialsService from '../../services/extra.materials.service.js';

export async function getIndexPage(req, res, next) {
  try {
    const subjects = await subjectService.getAllSubjects();
    const features = await landingService.getFeatures();
    const projectInfo = await landingService.getProjectInfo();
    const meta = await landingService.getMeta();

    const totalLessons = subjects.reduce((sum, s) => sum + (s.weeks || 15), 0);
    const stats = {
      activeSubjects: subjects.length,
      totalLessons,
      openAccess: 100
    };

    res.render('landing/index', {
      pageTitle: meta.title,
      pageDescription: meta.description,
      pageKeywords: meta.keywords,
      pageStyles: 'pages/home.css',
      subjects,
      features,
      projectInfo,
      stats,
      currentYear: new Date().getFullYear(),
      isHomePage: true
    });
  } catch (err) {
    next(err);
  }
}

export async function getExtraMaterials(req, res, next) {
  try {
    const pageData = await extraMaterialsService.getPageData();
    const meta = pageData.meta || {
      title: 'Dodatni materijali',
      description: 'Lični vodič kroz resurse za samoedukaciju - programiranje, web razvoj, baze, algoritmi i više.',
      keywords: 'programiranje, učenje, resursi, knjige, youtube, samoedukacija'
    };

    res.render('public/extra-materials', {
      pageTitle: meta.title,
      pageDescription: meta.description,
      pageKeywords: meta.keywords,
      pageStyles: 'pages/extra-materials.css',
      ...pageData,
      currentYear: new Date().getFullYear()
    });
  } catch (err) {
    next(err);
  }
}