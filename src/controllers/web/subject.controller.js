import subjectService from '../../services/subject.service.js';
import lectionService from '../../services/lection.service.js';
import materialsService from '../../services/materials.service.js';
import { errors } from '../../utils/error.utils.js';

// Generički kontroler za sve predmete (subjects.json + lections/<slug>.json).
// Predmet dolazi iz req.subject, koji postavlja loadSubject u routes/web/subject.routes.js.
// Express 5 sam prosleđuje greške iz async funkcija error handleru – try/catch nije potreban.

export async function loadSubject(req, res, next) {
  const subject = await subjectService.getSubjectBySlug(req.params.subjectSlug);
  if (!subject) return next('router'); // nije predmet - pusti ostale rute / 404
  req.subject = subject;
  next();
}

export async function getIndexPage(req, res) {
  const { subject } = req;
  res.render('public/subject', {
    ...(await subjectService.getSubjectPageData(subject)),
    pageTitle: subject.name,
    pageDescription: subject.description,
  });
}

export async function getMaterialsPage(req, res) {
  const { subject } = req;
  res.render('public/materials', {
    subject,
    materialsGrouped: await materialsService.getMaterialsGroupedByWeek(subject.slug),
    pageTitle: `${subject.name} – Materijali`,
    pageDescription: `Svi materijali za predmet ${subject.name}`,
  });
}

export async function getLectionDataPage(req, res, next) {
  const { subject } = req;
  const { lection, navigation } = await lectionService.getLectionWithNavigation(req.params.slug, subject.slug);
  if (!lection) return next(errors.notFound('Lekcija nije pronađena'));
  res.render('public/lection', {
    lection,
    navigation,
    lections: await lectionService.getLectionsBySubject(subject.slug),
    subjectSlug: subject.slug,
    pageTitle: lection.title,
    pageDescription: lection.description,
  });
}
