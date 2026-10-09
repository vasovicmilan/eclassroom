// Čitanje i pisanje JSON podataka (public/json/...) i keširanje učitanih podataka.
import { readFile, readdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { JSON_DIR } from '../config/paths.config.js';

/** Putanja unutar public/json, npr. jsonPath('lections', 'x.json'). */
export const jsonPath = (...parts) => join(JSON_DIR, ...parts);

export async function readJson(file) {
  return JSON.parse(await readFile(file, 'utf-8'));
}

export async function writeJson(file, data) {
  await writeFile(file, JSON.stringify(data, null, 2) + '\n');
}

/** Svi .json fajlovi u folderu (po abecedi) kao [{ file, data }]. Nepostojeći folder = prazna lista. */
export async function readJsonDir(dir) {
  let files = [];
  try {
    files = (await readdir(dir)).filter(f => f.endsWith('.json')).sort();
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }
  return Promise.all(files.map(async file => ({ file, data: await readJson(join(dir, file)) })));
}

/** Svi nizovi iz foldera spojeni u jedan niz. */
export async function readJsonDirFlat(dir) {
  return (await readJsonDir(dir)).flatMap(({ data }) => data);
}

/** Izvršava loader jednom i pamti rezultat (podaci se učitavaju pri prvom zahtevu). */
export function memoize(loader) {
  let promise = null;
  return () => (promise ??= loader().catch(err => { promise = null; throw err; }));
}
