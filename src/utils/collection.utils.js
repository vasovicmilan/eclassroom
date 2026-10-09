/** Grupiše niz po ključu: groupBy(items, m => m.week) -> { 1: [...], 2: [...] } */
export function groupBy(items, keyFn) {
  return items.reduce((acc, item) => {
    (acc[keyFn(item)] ??= []).push(item);
    return acc;
  }, {});
}

/** Sortirana kopija (original se ne menja). */
export const sortBy = (items, keyFn) => [...items].sort((a, b) => keyFn(a) - keyFn(b));

export const findBySlug = (items, slug) => items.find(i => i.slug === slug) || null;
