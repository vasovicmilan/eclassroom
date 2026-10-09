// Jedino mesto gde su definisani tipovi blokova za lekcije.
// - views/blocks/<tip>.ejs  -> kako se blok prikazuje
// - validateBlocks()        -> provera blokova (koristi je models/lection.model.js)
//
// Novi tip bloka = jedan red ovde + jedan partial u src/views/blocks/.
// Dokumentacija po tipu: BLOKOVI.md

const isNonEmptyString = v => typeof v === 'string' && v.trim() !== '';
const isArray = v => Array.isArray(v);
const nonEmptyArray = v => Array.isArray(v) && v.length > 0;

// vrste interaktivnih vežbi (js/simulations/<naziv>.js)
export const SIMULATION_KINDS = ['dice', 'cards', 'combinatorics', 'password', 'bayes', 'binomial', 'stats'];

// required: polja koja moraju postojati; check: dodatna pravila (vraća poruku greške ili null)
export const BLOCK_TYPES = {
  heading:       { required: { text: isNonEmptyString }, check: b => ([2, 3, 4].includes(b.level) ? null : 'level mora biti 2, 3 ili 4') },
  paragraph:     { required: { text: isNonEmptyString } },
  callout:       { required: { text: isNonEmptyString }, check: b => (!b.variant || ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'].includes(b.variant) ? null : `nepoznata varijanta "${b.variant}"`) },
  list:          { required: { items: nonEmptyArray }, check: b => (!b.style || ['group', 'flush', 'numbered', 'bullets', 'ordered'].includes(b.style) ? null : `nepoznat style "${b.style}"`) },
  'icon-list':   { required: { items: nonEmptyArray }, check: b => (b.items.every(i => i && i.text) ? null : 'svaka stavka mora imati text') },
  cards:         { required: { items: nonEmptyArray }, check: b => (b.items.every(i => i && i.title) ? null : 'svaka kartica mora imati title') },
  columns:       { required: { left: v => v && isArray(v.items), right: v => v && isArray(v.items) } },
  table:         { required: { headers: nonEmptyArray, rows: isArray }, check: b => (b.rows.every(r => isArray(r) && r.length === b.headers.length) ? null : 'svaki red mora imati isto kolona koliko ima headers') },
  code:          { required: { code: isNonEmptyString } },
  image:         { required: { src: isNonEmptyString } },
  gallery:       { required: { images: nonEmptyArray } },
  'image-text':  { required: { images: nonEmptyArray } },
  video:         { required: { src: isNonEmptyString } },
  links:         { required: { items: nonEmptyArray }, check: b => (b.items.every(i => i && i.url && i.title) ? null : 'svaki link mora imati title i url') },
  accordion:     { required: { items: nonEmptyArray }, check: b => (b.items.every(i => i && i.title && isArray(i.items)) ? null : 'svaka grupa mora imati title i items') },
  download:      { required: { url: isNonEmptyString, label: isNonEmptyString } },
  badges:        { required: { items: nonEmptyArray } },
  divider:       { required: {} },
  quote:         { required: { text: isNonEmptyString } },
  panel:         { required: { blocks: nonEmptyArray } },
  flow:          { required: { nodes: nonEmptyArray } },
  distributions: { required: { items: nonEmptyArray }, check: b => (b.items.every(i => i && i.name && i.url) ? null : 'svaka stavka mora imati name i url') },
  'http-explorer': { required: { config: v => v && v.form } },
  'api-examples':  { required: { config: v => v && v.selector } },
  dashboard:       { required: { config: v => v && v.containerId } },
  formula:         { required: { items: nonEmptyArray }, check: b => (b.items.every(i => i && isNonEmptyString(i.tex)) ? null : 'svaka stavka mora imati tex') },
  'worked-example': { required: { problem: isNonEmptyString, steps: nonEmptyArray, answer: isNonEmptyString }, check: b => (b.steps.every(s => s && isNonEmptyString(s.content)) ? null : 'svaki korak mora imati content') },
  simulation:      { required: { kind: v => SIMULATION_KINDS.includes(v), scripts: nonEmptyArray } },
  html:          { required: { html: isNonEmptyString } },
};

export const BLOCK_TYPE_NAMES = Object.keys(BLOCK_TYPES);

/** Vraća listu problema u nizu blokova (prazna lista = sve u redu). */
export function validateBlocks(blocks, where = '') {
  const problems = [];
  if (!Array.isArray(blocks)) return [`${where}: blocks mora biti niz`];
  blocks.forEach((block, i) => {
    const at = `${where}[${i}]`;
    if (!block || typeof block !== 'object') { problems.push(`${at}: blok nije objekat`); return; }
    const def = BLOCK_TYPES[block.type];
    if (!def) { problems.push(`${at}: nepoznat tip bloka "${block.type}"`); return; }
    for (const [field, ok] of Object.entries(def.required)) {
      if (!ok(block[field])) problems.push(`${at} (${block.type}): polje "${field}" nedostaje ili nije ispravno`);
    }
    if (def.check && Object.keys(def.required).every(f => def.required[f](block[f]))) {
      const msg = def.check(block);
      if (msg) problems.push(`${at} (${block.type}): ${msg}`);
    }
    if (block.type === 'panel' && Array.isArray(block.blocks)) {
      problems.push(...validateBlocks(block.blocks, `${at}.blocks`));
    }
  });
  return problems;
}
