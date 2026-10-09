// Datumi u podacima su ISO stringovi (YYYY-MM-DD); prikazuju se kao DD.MM.YYYY.
export const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export const isIsoDate = v => typeof v === 'string' && ISO_DATE.test(v);

/** '2026-10-05' -> '05.10.2026.' */
export function formatDate(iso) {
  const [y, m, d] = iso.split('-');
  return `${d}.${m}.${y}.`;
}

/** Dodaje broj dana na ISO datum i vraća ISO datum. */
export function addDays(iso, days) {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export const todayIso = () => new Date().toISOString().slice(0, 10);

export function startOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Da li je datum pre danas / tačno danas. */
export function dayStatus(iso, today = startOfDay()) {
  const day = startOfDay(iso);
  return { isPast: day < today, isCurrent: day.getTime() === today.getTime() };
}
