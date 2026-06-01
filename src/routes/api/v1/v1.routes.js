import { Router } from 'express';
import otvorenoRacunarstvoRoutes from './otvoreno-racunarstvo/index.routes.js';
// import multimedijalneAplikacijeRoutes from './multimedijalne-aplikacije/index.routes.js';
// import teorijaSistemaRoutes from './teorija-sistema/index.routes.js';

const router = Router();

router.use('/otvoreno-racunarstvo', otvorenoRacunarstvoRoutes);
// INFO: in future if we add api routes for this subjects and lections
// router.use('/multimedijalne-aplikacije', multimedijalneAplikacijeRoutes);
// router.use('/teorija-sistema', teorijaSistemaRoutes);

export default router;