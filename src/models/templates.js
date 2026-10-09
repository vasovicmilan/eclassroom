// Šabloni za nove lekcije: kostur strukture sa tekstom-podsetnikom.
// Koristi ih scripts/new-lection.js  (node scripts/new-lection.js --help)
import { createBlock as b } from './block.model.js';

export const LECTION_TEMPLATES = {
  prazna: () => [
    b('heading', { text: 'Uvod' }),
    b('paragraph', { text: 'Napiši uvod u temu.' }),
    b('heading', { text: 'Zaključak' }),
    b('paragraph', { text: 'Rezime najvažnijeg iz lekcije.' }),
  ],

  // Predavanje: uvod → pojmovi → primer → zaključak
  teorijska: () => [
    b('heading', { text: 'Uvod' }),
    b('paragraph', { text: 'Šta se obrađuje i zašto je važno.' }),
    b('callout', { variant: 'info', title: 'Cilj lekcije', text: 'Šta student treba da zna nakon ove lekcije.' }),
    b('heading', { text: 'Osnovni pojmovi' }),
    b('paragraph', { text: 'Definicije i objašnjenja ključnih pojmova.' }),
    b('list', { style: 'bullets', items: ['Pojam 1', 'Pojam 2'] }),
    b('heading', { level: 3, text: 'Podtema' }),
    b('paragraph', { text: 'Detaljnije objašnjenje jedne podteme.' }),
    b('heading', { text: 'Primer iz prakse' }),
    b('paragraph', { text: 'Konkretan primer koji povezuje teoriju sa praksom.' }),
    b('heading', { text: 'Zaključak' }),
    b('callout', { variant: 'success', text: 'Najvažnija poruka lekcije u jednoj do dve rečenice.' }),
  ],

  // Vežbe: cilj → priprema → koraci → zadaci
  prakticna: () => [
    b('heading', { text: 'Cilj vežbe' }),
    b('paragraph', { text: 'Šta će student napraviti ili naučiti da radi.' }),
    b('heading', { text: 'Priprema' }),
    b('list', { style: 'bullets', items: ['Potreban alat ili program', 'Potrebni fajlovi'] }),
    b('heading', { text: 'Koraci' }),
    b('heading', { level: 3, text: '1. Prvi korak' }),
    b('paragraph', { text: 'Opis prvog koraka.' }),
    b('code', { language: 'bash', code: 'komanda --opcija' }),
    b('heading', { level: 3, text: '2. Drugi korak' }),
    b('paragraph', { text: 'Opis drugog koraka.' }),
    b('heading', { text: 'Zadaci za samostalni rad' }),
    b('list', { style: 'numbered', items: ['Zadatak 1', 'Zadatak 2'] }),
    b('heading', { text: 'Korisni linkovi' }),
    b('links', { items: [{ title: 'Dokumentacija', url: 'https://example.com' }] }),
  ],
};

export const TEMPLATE_NAMES = Object.keys(LECTION_TEMPLATES);
