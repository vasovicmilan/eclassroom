// Model materijala: public/json/materials/<slug-predmeta>.json je NIZ ovakvih objekata.
import { formatDate } from '../utils/date.utils.js';
import { missingFields, badDates, isNonNegativeInt } from '../utils/validate.utils.js';

/**
 * @typedef {Object} Material
 * @property {string}  subjectSlug
 * @property {number}  week           0 = materijal za ceo semestar (npr. dodatna literatura)
 * @property {string}  title
 * @property {string}  file           putanja ispod public/pdf/ (npr. "predmet/Prvo predavanje.pdf")
 * @property {string}  date           YYYY-MM-DD
 * @property {string}  formattedDate   DD.MM.YYYY. (ili slobodan tekst, npr. "Dostupno tokom celog semestra")
 * @property {boolean} available
 */
export function createMaterial({ subjectSlug, week, title, file, date, formattedDate, available = false }) {
  return { week, title, file, date, formattedDate: formattedDate || formatDate(date), available, subjectSlug };
}

export function validateMaterial(m) {
  const name = `materijal ${m.subjectSlug || '?'}/${m.title || '?'}`;
  const p = [];
  p.push(...missingFields(m, ['subjectSlug', 'title', 'file', 'date', 'formattedDate'], name));
  if (!isNonNegativeInt(m.week)) p.push(`${name}: "week" mora biti ceo broj (0 = ceo semestar)`);
  p.push(...badDates(m, ['date'], name));
  if (typeof m.available !== 'boolean') p.push(`${name}: "available" mora biti true ili false`);
  return p;
}
