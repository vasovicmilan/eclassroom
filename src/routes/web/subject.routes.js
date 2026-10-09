import { Router } from 'express';
import {
  loadSubject,
  getIndexPage,
  getMaterialsPage,
  getLectionDataPage,
} from '../../controllers/web/subject.controller.js';

// Jedan router za sve predmete koji su opisani podacima.
// Montira se kao router.use('/:subjectSlug', subjectRoutes) u web.routes.js.
const router = Router({ mergeParams: true });

router.use(loadSubject);

router.get('/', getIndexPage);
router.get('/materijali', getMaterialsPage);
router.get('/lekcija/:slug', getLectionDataPage);

export default router;
