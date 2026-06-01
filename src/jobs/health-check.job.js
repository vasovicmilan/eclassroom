import cron from 'node-cron';
import { logger } from '../config/logger.config.js';

//INFO: Svakih 14 minuta (0,14,28,42,56)
cron.schedule('*/14 * * * *', async () => {
  logger.info('[CRON] Health check započet');
  try {
    // TODO: Ovde stavi stvarni API poziv, npr. fetch('http://localhost:3000/api/health')
    logger.info('[CRON] Health check uspešan');
  } catch (error) {
    logger.error({ err: error }, '[CRON] Health check neuspešan');
  }
}, {
  timezone: 'Europe/Belgrade',
});