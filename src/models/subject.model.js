// Model predmeta: public/json/subjects.json je NIZ ovakvih objekata.

/**
 * @typedef {Object} GradingItem
 * @property {string} label
 * @property {string} [icon]
 * @property {number|null} points  null = bodovi još nisu određeni
 *
 * @typedef {Object} Subject
 * @property {number}  id
 * @property {string}  slug          kebab-case, deo URL-a (/<slug>)
 * @property {string}  name
 * @property {string}  code          kratka oznaka (npr. "OR")
 * @property {string}  icon          emoji
 * @property {string}  description
 * @property {number}  weeks         broj nedelja nastave
 * @property {number|null} espb
 * @property {string|null} lectures  npr. "2 časa nedeljno"
 * @property {string|null} exercises npr. "3 časa nedeljno"
 * @property {string}  startDate     YYYY-MM-DD
 * @property {string}  endDate       YYYY-MM-DD
 * @property {{plan:string, results:string, questions:string}} resources   "#" = još nema linka
 * @property {'u-pripremi'} [status] samo za predmete koji još nisu počeli (značka "U pripremi")
 * @property {{items: GradingItem[], passThreshold: number|null, note: string|null}} [grading]
 *           izostavljeno = stari predmeti (fiksna podela 10/10/30/30/20); {items: []} = "biće objavljeno"
 */

import { isIsoDate } from '../utils/date.utils.js';
import { isSlug } from '../utils/string.utils.js';
import { missingFields, badDates } from '../utils/validate.utils.js';

export const STATUS_IN_PREPARATION = 'u-pripremi';
export const SUBJECT_STATUSES = [STATUS_IN_PREPARATION];

/** Predmet koji još nije počeo (prikazuje se sa značkom "U pripremi"). */
export const isInPreparation = subject => subject.status === STATUS_IN_PREPARATION;

export function createSubject({ id, slug, name, code, icon = '📘', description = '', weeks = 15, espb = null, lectures = null, exercises = null,
  startDate, endDate, resources = {}, status = STATUS_IN_PREPARATION, grading = { items: [], passThreshold: null, note: null } }) {
  const s = {
    id, slug, name, code, icon, description, weeks, espb, lectures, exercises, startDate, endDate,
    resources: { plan: '#', results: '#', questions: '#', ...resources },
  };
  if (status) s.status = status;
  if (grading !== undefined) s.grading = grading;
  return s;
}

export function validateSubject(s) {
  const name = `predmet ${s.slug || s.id || '?'}`;
  const p = [];
  p.push(...missingFields(s, ['id', 'slug', 'name', 'code', 'icon', 'startDate', 'endDate'], name));
  if (s.slug && !isSlug(s.slug)) p.push(`${name}: slug mora biti kebab-case`);
  p.push(...badDates(s, ['startDate', 'endDate'], name));
  if (isIsoDate(s.startDate) && isIsoDate(s.endDate) && s.endDate < s.startDate) p.push(`${name}: endDate je pre startDate`);
  if (!Number.isInteger(s.weeks) || s.weeks < 1) p.push(`${name}: "weeks" mora biti ceo broj > 0`);
  if (s.espb !== null && !Number.isInteger(s.espb)) p.push(`${name}: "espb" mora biti ceo broj ili null`);
  for (const f of ['lectures', 'exercises']) if (s[f] !== null && typeof s[f] !== 'string') p.push(`${name}: "${f}" mora biti tekst (npr. "2 časa nedeljno") ili null`);
  if (s.status !== undefined && !SUBJECT_STATUSES.includes(s.status)) p.push(`${name}: nepoznat status "${s.status}"`);
  if (!s.resources || ['plan', 'results', 'questions'].some(k => typeof s.resources[k] !== 'string')) p.push(`${name}: resources mora imati plan, results i questions (može "#")`);
  if (s.grading !== undefined) {
    const g = s.grading;
    if (!g || !Array.isArray(g.items)) p.push(`${name}: grading.items mora biti niz`);
    else {
      g.items.forEach((i, n) => {
        if (!i.label) p.push(`${name}: grading.items[${n}] nema label`);
        if (i.points !== null && typeof i.points !== 'number') p.push(`${name}: grading.items[${n}].points mora biti broj ili null`);
      });
      const pts = g.items.map(i => i.points);
      if (pts.length && pts.every(v => typeof v === 'number') && pts.reduce((a, b) => a + b, 0) !== 100) p.push(`${name}: zbir bodova je ${pts.reduce((a, b) => a + b, 0)}, a trebalo bi 100`);
    }
  }
  return p;
}

export function validateSubjects(list) {
  const p = list.flatMap(validateSubject);
  const dup = (key) => { const seen = new Set(); list.forEach(s => { if (seen.has(s[key])) p.push(`predmet: duplikat polja "${key}" = ${s[key]}`); seen.add(s[key]); }); };
  ['id', 'slug', 'code'].forEach(dup);
  return p;
}
