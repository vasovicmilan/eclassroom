import { join } from 'path';
import express from 'express';
import { PUBLIC_DIR, NODE_MODULES_DIR } from './paths.config.js';

export const staticConfig = (app) => {
  app.use(express.static(PUBLIC_DIR));

  app.use('/bootstrap-css', express.static(join(NODE_MODULES_DIR, 'bootstrap', 'dist', 'css')));
  app.use('/bootstrap-js', express.static(join(NODE_MODULES_DIR, 'bootstrap', 'dist', 'js')));
  app.use('/popper', express.static(join(NODE_MODULES_DIR, '@popperjs', 'core', 'dist', 'umd')));
  // formule u lekcijama (KaTeX), učitava se samo na stranicama sa formulama
  app.use('/katex', express.static(join(NODE_MODULES_DIR, 'katex', 'dist')));
  app.use('/icons', express.static(join(NODE_MODULES_DIR, 'bootstrap-icons', 'font')));
};
