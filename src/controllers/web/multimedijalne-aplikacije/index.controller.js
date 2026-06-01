import subjectService from '../../../services/subject.service.js';
import lectionService from '../../../services/lection.service.js';
import materialsService from '../../../services/materials.service.js';

const SUBJECT_SLUG = 'multimedijalne-aplikacije';

export async function getIndexPage(req, res, next) {
  try {
    const subject = await subjectService.getSubjectBySlug(SUBJECT_SLUG);
    if (!subject) {
      return res.status(404).render('error/error', { message: 'Predmet nije pronađen' });
    }

    const lections = await lectionService.getLectionsBySubject(SUBJECT_SLUG);
    const materialsGrouped = await materialsService.getMaterialsGroupedByWeek(SUBJECT_SLUG);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lectionsWithStatus = lections.map(lec => {
      const lecDate = new Date(lec.date);
      lecDate.setHours(0, 0, 0, 0);
      const isPast = lecDate < today;
      const isCurrent = lecDate.getTime() === today.getTime();
      return { ...lec, isPast, isCurrent };
    });

    const total = lectionsWithStatus.length;
    const available = lectionsWithStatus.filter(l => l.available).length;
    const percent = Math.round((available / total) * 100);
    const stats = { total, available, percent };

    const workPlan = lectionsWithStatus
      .map(lec => ({
        week: lec.week,
        title: lec.title,
        date: lec.date,
        formattedDate: lec.formattedDate,
        isPast: lec.isPast,
        isCurrent: lec.isCurrent,
      }))
      .sort((a, b) => a.week - b.week);
      
    let currentLection = lectionsWithStatus.find(l => l.isCurrent);
    if (!currentLection) {
      const upcoming = lectionsWithStatus.filter(l => !l.isPast).sort((a, b) => a.week - b.week);
      currentLection = upcoming[0] || lectionsWithStatus[lectionsWithStatus.length - 1];
    }

    res.render('public/subject', {
      subject,
      lections,
      materialsGrouped,
      stats,
      workPlan,
      currentLection,
      today,
      pageTitle: subject.name,
      pageDescription: subject.description,
    });
  } catch (err) {
    next(err);
  }
}

export async function getMaterialsPage(req, res, next) {
  try {
    const subject = await subjectService.getSubjectBySlug(SUBJECT_SLUG);
    if (!subject) {
      return res.status(404).render('error/error', { message: 'Predmet nije pronađen' });
    }
    const materialsGrouped = await materialsService.getMaterialsGroupedByWeek(SUBJECT_SLUG);
    res.render('public/materials', {
      subject,
      materialsGrouped,
      pageTitle: `${subject.name} – Materijali`,
      pageDescription: `Svi materijali za predmet ${subject.name}`,
    });
  } catch (err) {
    next(err);
  }
}

export async function getLectionDataPage(req, res, next) {
  const { slug } = req.params;
  try {
    const { lection, navigation } = await lectionService.getLectionWithNavigation(slug, SUBJECT_SLUG);
    if (!lection) {
      return res.status(404).render('error/error', { message: 'Lekcija nije pronađena' });
    }
    const lections = await lectionService.getLectionsBySubject(SUBJECT_SLUG);
    res.render('public/lection', {
      lection,
      navigation,
      lections,
      subjectSlug: SUBJECT_SLUG,
      pageTitle: lection.title,
      pageDescription: lection.description,
    });
  } catch (err) {
    next(err);
  }
}