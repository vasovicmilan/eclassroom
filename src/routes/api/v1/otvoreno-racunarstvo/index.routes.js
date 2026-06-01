import { Router } from 'express';
import {
  exploreHttpEndpoint,
  getHandshakeEndpoint,
  getJsonExample,
  getHtmlExample,
  getImageExample,
  getPdfExample,
  receiveSensorData,
  getLatestReadings
} from '../../../../controllers/api/otvoreno-racunarstvo/index.controller.js';

const router = Router();

router.post('/http-explorer', exploreHttpEndpoint);
router.get('/http-explorer/handshake', getHandshakeEndpoint);
router.get('/examples/json', getJsonExample);
router.get('/examples/html', getHtmlExample);
router.get('/examples/image', getImageExample);
router.get('/examples/pdf', getPdfExample);
router.post('/iot/sensor-data', receiveSensorData);
router.get('/iot/latest-readings', getLatestReadings);

export default router;