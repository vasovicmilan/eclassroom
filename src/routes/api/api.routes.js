import { Router } from 'express';
import v1Routes from './v1/v1.routes.js';
import { healthCheck } from '../../controllers/api/api.controller.js';

const router = Router();

router.get('/health', healthCheck);

router.use('/v1', v1Routes);

// INFO: later can be added new version same way

export default router;
