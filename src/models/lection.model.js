// Model lekcije: public/json/lections/<slug-predmeta>.json je NIZ ovakvih objekata.
import { validateBlocks } from '../utils/block.types.js';
import { isIsoDate, formatDate } from '../utils/date.utils.js';
import { isSlug, slugify } from '../utils/string.utils.js';
import { missingFields, badDates, isNonNegativeInt } from '../utils/validate.utils.js';

// Vrste lekcija: predavanje (teorija) i vežba (praktičan rad). Bez polja "kind" lekcija je predavanje.
export const LECTION_KINDS = {
  predavanje: { label: 'Predavanje', icon: '🎓' },
  vezba: { label: 'Vežba', icon: '✏️' },
};
export const DEFAULT_LECTION_KIND = 'predavanje';
export const lectionKind = lection => LECTION_KINDS[lection && lection.kind] || LECTION_KINDS[DEFAULT_LECTION_KIND];

/**
 * @typedef {Object} Lection
 * @property {string}  [kind]        vrsta: 'predavanje' (podrazumevano) ili 'vezba'
 * @property {string}  slug           jedinstven u okviru predmeta, kebab-case, deo URL-a (ne menjati kad je objavljeno)
 * @property {string}  subjectSlug    slug predmeta iz subjects.json
 * @property {string}  title          naslov lekcije
 * @property {string}  description    kratak opis (ispod naslova i u <meta>)
 * @property {number}  week           nedelja nastave (1..)
 * @property {string}  date           ISO datum otključavanja, YYYY-MM-DD
 * @property {string}  formattedDate  isti datum kao DD.MM.YYYY.
 * @property {boolean} available      false = zaključana ("Lekcija još nije dostupna")
 * @property {{blocks: Object[]}} content
 */

export function createLection({ subjectSlug, title, week, date, slug, description = '', available = false, blocks = [], kind = DEFAULT_LECTION_KIND }) {
  return {
    slug: slug || slugify(title), subjectSlug, kind, title, description,
    week, date, formattedDate: formatDate(date), available,
    content: { blocks },
  };
}

/** Pravila strukture: nivoi naslova bez preskakanja, bez ručne numeracije i dvotački u naslovu. */
function checkStructure(blocks, name) {
  const problems = [];
  let prev = 1;
  blocks.forEach((b, i) => {
    if (b.type !== 'heading') return;
    if (b.level - prev > 1) problems.push(`${name}.blocks[${i}]: naslov "${b.text}" preskače nivo (h${prev} → h${b.level})`);
    prev = b.level;
    if (/^\d+\.\s/.test(b.text) && b.level === 2) problems.push(`${name}.blocks[${i}]: naslov "${b.text}" ima ručnu numeraciju – koristi "numbered": true`);
    if (/:\s*$/.test(b.text)) problems.push(`${name}.blocks[${i}]: naslov "${b.text}" se završava dvotačkom`);
    if (b.numbered && b.level !== 2) problems.push(`${name}.blocks[${i}]: "numbered" važi samo za nivo 2`);
  });
  return problems;
}

/** Vraća listu problema (prazna lista = ispravno). */
export function validateLection(lection) {
  const name = `${lection.subjectSlug || '?'}/${lection.slug || '?'}`;
  const problems = [];
  problems.push(...missingFields(lection, ['slug', 'subjectSlug', 'title', 'week', 'date'], name));
  if (lection.slug && !isSlug(lection.slug)) problems.push(`${name}: slug mora biti kebab-case (mala slova, brojevi, crtice)`);
  if (lection.week !== undefined && !isNonNegativeInt(lection.week)) problems.push(`${name}: "week" mora biti ceo broj`);
  const dateProblems = badDates(lection, ['date'], name);
  problems.push(...dateProblems);
  if (lection.date && isIsoDate(lection.date) && lection.formattedDate !== formatDate(lection.date)) problems.push(`${name}: "formattedDate" (${lection.formattedDate}) ne odgovara datumu (${formatDate(lection.date)})`);
  if (lection.kind !== undefined && !LECTION_KINDS[lection.kind]) problems.push(`${name}: nepoznata vrsta "${lection.kind}" (dozvoljeno: ${Object.keys(LECTION_KINDS).join(', ')})`);
  if (typeof lection.available !== 'boolean') problems.push(`${name}: "available" mora biti true ili false`);
  if (lection.content && lection.content.sections) problems.push(`${name}: stari ključ "content.sections" – koristi "content.blocks"`);
  const blocks = lection.content && lection.content.blocks;
  if (lection.available && !(Array.isArray(blocks) && blocks.length)) problems.push(`${name}: lekcija je dostupna, a nema blokova`);
  if (blocks) {
    const bp = validateBlocks(blocks, `${name}.blocks`);
    problems.push(...bp);
    if (!bp.length) problems.push(...checkStructure(blocks, name));
  }
  return problems;
}
