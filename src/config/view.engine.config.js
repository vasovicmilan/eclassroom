import { VIEWS_DIR } from './paths.config.js';
import { BLOCK_TYPE_NAMES } from '../utils/block.types.js';
import { isInPreparation } from '../models/subject.model.js';

export const viewEngineConfig = (app) => {
  app.set('views', VIEWS_DIR);
  app.set('view engine', 'ejs');
  // dozvoljeni tipovi blokova (koristi views/blocks/block.ejs)
  app.locals.blockTypes = BLOCK_TYPE_NAMES;
  // dostupno u svim šablonima: <% if (isInPreparation(subject)) { %>
  app.locals.isInPreparation = isInPreparation;
};
