// Model bloka: minimalan ispravan primer za svaki tip (koristi se za šablone, dokumentaciju i test).
// Pravila provere su u utils/block.types.js.
import { BLOCK_TYPES, validateBlocks } from '../utils/block.types.js';

export const BLOCK_EXAMPLES = {
  heading:   { type: 'heading', level: 2, text: 'Naslov odeljka' },
  paragraph: { type: 'paragraph', text: 'Tekst pasusa. Dozvoljen je HTML (<strong>, <em>, <code>, <a>).' },
  callout:   { type: 'callout', variant: 'info', title: 'Naslov (opciono)', text: 'Istaknuta napomena.' },
  list:      { type: 'list', style: 'bullets', items: ['Prva stavka', 'Druga stavka'] },
  'icon-list': { type: 'icon-list', items: [{ icon: '✅', text: 'Stavka sa ikonom' }] },
  cards:     { type: 'cards', layout: 'grid', columns: 3, items: [{ icon: '📦', title: 'Naslov', text: 'Opis' }] },
  columns:   { type: 'columns', left: { title: 'Levo', items: ['a'] }, right: { title: 'Desno', items: ['b'] } },
  table:     { type: 'table', headers: ['Kolona 1', 'Kolona 2'], rows: [['a', 'b']] },
  code:      { type: 'code', language: 'js', code: 'console.log("zdravo");' },
  image:     { type: 'image', src: '/images/predmet/slika.png', alt: 'Opis slike' },
  gallery:   { type: 'gallery', images: [{ src: '/images/predmet/slika.png', alt: 'Opis' }] },
  'image-text': { type: 'image-text', images: [{ src: '/images/predmet/slika.png', alt: 'Opis' }], text: 'Tekst pored slike' },
  video:     { type: 'video', src: 'https://www.youtube.com/embed/ID', title: 'Naslov videa' },
  links:     { type: 'links', items: [{ title: 'Naziv', url: 'https://example.com' }] },
  accordion: { type: 'accordion', id: 'grupa-1', items: [{ title: 'Grupa', items: ['Stavka'] }] },
  download:  { type: 'download', label: 'Preuzmi PDF', url: '/pdf/predmet/fajl.pdf' },
  badges:    { type: 'badges', items: ['Oznaka 1', 'Oznaka 2'] },
  divider:   { type: 'divider' },
  quote:     { type: 'quote', text: 'Citat', author: 'Autor' },
  panel:     { type: 'panel', title: 'Naslov panela', blocks: [{ type: 'paragraph', text: 'Sadržaj panela' }] },
  flow:      { type: 'flow', nodes: [{ label: 'Korak 1' }, { label: 'Korak 2' }] },
  distributions: { type: 'distributions', items: [{ name: 'Naziv', url: 'https://example.com', description: 'Opis' }] },
  'http-explorer': { type: 'http-explorer', config: { form: 'http-form' }, scripts: ['otvoreno-racunarstvo/http-explorer.js'] },
  'api-examples':  { type: 'api-examples', config: { selector: '.api-example' }, scripts: ['otvoreno-racunarstvo/api-example.js'] },
  dashboard: { type: 'dashboard', config: { containerId: 'dashboard' }, scripts: ['otvoreno-racunarstvo/iot-example.js'] },
  html:      { type: 'html', html: '<p>Poslednja opcija – koristi samo kad nijedan blok ne odgovara.</p>' },
};

/** Vraća kopiju primera za dati tip, sa opcionim izmenama. */
export function createBlock(type, overrides = {}) {
  if (!BLOCK_EXAMPLES[type]) throw new Error(`Nepoznat tip bloka "${type}". Dostupni: ${Object.keys(BLOCK_TYPES).join(', ')}`);
  return { ...structuredClone(BLOCK_EXAMPLES[type]), ...overrides };
}

export { BLOCK_TYPES, validateBlocks };
