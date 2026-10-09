// Priprema podataka za stranicu predmeta: status lekcija, statistika, plan rada, trenutna lekcija.
import { dayStatus, startOfDay } from './date.utils.js';
import { sortBy } from './collection.utils.js';

export function buildSubjectOverview(lections, today = startOfDay()) {
  const withStatus = lections.map(l => ({ ...l, ...dayStatus(l.date, today) }));

  const total = withStatus.length;
  const available = withStatus.filter(l => l.available).length;
  const stats = { total, available, percent: total ? Math.round((available / total) * 100) : 0 };

  const workPlan = sortBy(withStatus, l => l.week)
    .map(({ week, title, date, formattedDate, isPast, isCurrent }) => ({ week, title, date, formattedDate, isPast, isCurrent }));

  const upcoming = sortBy(withStatus.filter(l => !l.isPast), l => l.week);
  const currentLection = withStatus.find(l => l.isCurrent) || upcoming[0] || withStatus[withStatus.length - 1];

  return { stats, workPlan, currentLection, today };
}
