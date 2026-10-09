// Otključavanje po datumu: stavka (lekcija ili materijal) postaje vidljiva kada nastupi njen "date".
// Za pregled unapred pokreni server sa UNLOCK_ALL=true (npr. UNLOCK_ALL=true npm run start-dev).
const todayBelgrade = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Belgrade' });

export const isUnlocked = item => {
  if (process.env.UNLOCK_ALL === 'true') return true;
  return !item.date || item.date <= todayBelgrade();
};
