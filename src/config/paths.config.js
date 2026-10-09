// Jedino mesto gde se računaju putanje projekta (umesto __dirname u svakom fajlu).
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

export const SRC_DIR = join(dirname(fileURLToPath(import.meta.url)), '..');
export const ROOT_DIR = join(SRC_DIR, '..');
export const PUBLIC_DIR = join(SRC_DIR, 'public');
export const VIEWS_DIR = join(SRC_DIR, 'views');
export const JSON_DIR = join(PUBLIC_DIR, 'json');
export const NODE_MODULES_DIR = join(ROOT_DIR, 'node_modules');
