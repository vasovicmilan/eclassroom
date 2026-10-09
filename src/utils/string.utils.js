export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const isSlug = v => typeof v === 'string' && SLUG_PATTERN.test(v);

/** "Čudna lekcija: šta, đe?" -> "cudna-lekcija-sta-dje" */
export function slugify(text) {
  return text.toLowerCase()
    .replace(/đ/g, 'dj').replace(/[čć]/g, 'c').replace(/š/g, 's').replace(/ž/g, 'z')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
