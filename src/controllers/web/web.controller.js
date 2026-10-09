import subjectService from '../../services/subject.service.js';
import landingService from '../../services/landing.service.js';
import extraMaterialsService from '../../services/extra.materials.service.js';

const DEFAULT_EXTRA_META = {
  title: 'Dodatni materijali',
  description: 'Lični vodič kroz resurse za samoedukaciju - programiranje, web razvoj, baze, algoritmi i više.',
  keywords: 'programiranje, učenje, resursi, knjige, youtube, samoedukacija',
};

const pageMeta = meta => ({ pageTitle: meta.title, pageDescription: meta.description, pageKeywords: meta.keywords });

export async function getIndexPage(req, res) {
  const [subjects, features, projectInfo, meta, stats] = await Promise.all([
    subjectService.getAllSubjects(),
    landingService.getFeatures(),
    landingService.getProjectInfo(),
    landingService.getMeta(),
    subjectService.getLandingStats(),
  ]);
  res.render('landing/index', {
    ...pageMeta(meta),
    pageStyles: 'pages/home.css',
    subjects, features, projectInfo, stats,
    currentYear: new Date().getFullYear(),
    isHomePage: true,
  });
}

export async function getExtraMaterials(req, res) {
  const pageData = await extraMaterialsService.getPageData();
  res.render('public/extra-materials', {
    ...pageMeta(pageData.meta || DEFAULT_EXTRA_META),
    pageStyles: 'pages/extra-materials.css',
    ...pageData,
    currentYear: new Date().getFullYear(),
  });
}
