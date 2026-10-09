import subjectService from '../services/subject.service.js';
import { isInPreparation } from '../models/subject.model.js';

// Postavlja listu predmeta za navigaciju (res.locals.navSubjects),
// da navigacija ne mora da ima ručno upisane predmete.
export async function navSubjects(req, res, next) {
  try {
    const subjects = await subjectService.getAllSubjects();
    res.locals.navSubjects = subjects.map(s => ({ slug: s.slug, name: s.name, inPreparation: isInPreparation(s) }));
  } catch {
    res.locals.navSubjects = []; // navigacija ne sme da obori stranicu
  }
  next();
}
