import express from 'express';
import webRoutes from './web/web.routes.js';
import apiRoutes from './api/api.routes.js';
import { apiLimiter } from '../middlewares/rate.limiter.middleware.js';

const router = express.Router();

router.use('/', webRoutes);
router.use('/api', apiLimiter, apiRoutes); 

export default router;