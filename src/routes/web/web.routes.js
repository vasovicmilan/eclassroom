import { Router } from 'express';
import { getIndexPage, getExtraMaterials } from '../../controllers/web/web.controller.js';
import { navSubjects } from '../../middlewares/nav.middleware.js';
import subjectRoutes from './subject.routes.js';

const router = Router();

// lista predmeta za navigaciju (res.locals.navSubjects)
router.use(navSubjects);

router.get('/', getIndexPage);

router.get('/dodatni-materijali', getExtraMaterials);

// Svi predmeti (subjects.json) rade kroz jedan generički router: /:subjectSlug, /materijali, /lekcija/:slug.
// Ako slug nije predmet, loadSubject prosleđuje zahtev dalje (npr. /api, 404).
router.use('/:subjectSlug', subjectRoutes);

export default router;
