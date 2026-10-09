import { Router } from 'express';
import otvorenoRacunarstvoRoutes from './otvoreno-racunarstvo/index.routes.js';

const router = Router();

// API koji koriste interaktivni blokovi u lekcijama (http-explorer, primeri, IoT)
router.use('/otvoreno-racunarstvo', otvorenoRacunarstvoRoutes);

export default router;
