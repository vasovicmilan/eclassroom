// Zajednički delovi provere modela (subject / lection / material).
import { isIsoDate } from './date.utils.js';

/** Poruke za polja koja nedostaju ili su prazna. */
export const missingFields = (obj, fields, label) =>
  fields.filter(f => obj[f] === undefined || obj[f] === null || obj[f] === '').map(f => `${label}: nedostaje polje "${f}"`);

/** Poruke za polja koja nisu ispravan ISO datum (preskače polja koja ne postoje). */
export const badDates = (obj, fields, label) =>
  fields.filter(f => obj[f] && !isIsoDate(obj[f])).map(f => `${label}: "${f}" mora biti YYYY-MM-DD`);

export const isNonNegativeInt = v => Number.isInteger(v) && v >= 0;
