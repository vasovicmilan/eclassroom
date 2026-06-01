import { Router } from 'express';
import otvorenoRacunarstvoRoutes from './otvoreno-racunarstvo/index.routes.js';
import multimedijalneAplikacijeRoutes from './multimedijalne-aplikacije/index.routes.js';
import teorijaSistemaRoutes from './teorija-sistema/index.routes.js';
import { getIndexPage, getExtraMaterials } from '../../controllers/web/web.controller.js';

const router = Router();

router.get('/', getIndexPage);

router.get('/dodatni-materijali', getExtraMaterials);

router.use('/otvoreno-racunarstvo', otvorenoRacunarstvoRoutes);
router.use('/multimedijalne-aplikacije', multimedijalneAplikacijeRoutes);
router.use('/teorija-sistema', teorijaSistemaRoutes);

// INFO: add new subjects like Verovatnoca i Statistika and Objektno Orijentisano Programiranje 3

export default router;