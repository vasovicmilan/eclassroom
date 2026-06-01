import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const staticConfig = (app) => {
  app.use(express.static(path.join(__dirname, '..', 'public')));

  app.use('/bootstrap-css', express.static(
    path.join(__dirname, '..', '..', 'node_modules', 'bootstrap', 'dist', 'css')
  ));

  app.use('/bootstrap-js', express.static(
    path.join(__dirname, '..', '..', 'node_modules', 'bootstrap', 'dist', 'js')
  ));

  app.use('/popper', express.static(
    path.join(__dirname, '..', '..', 'node_modules', '@popperjs', 'core', 'dist', 'umd')
  ));

  app.use('/icons', express.static(
    path.join(__dirname, '..', '..', 'node_modules', 'bootstrap-icons', 'font')
  ));
};