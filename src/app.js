import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import methodOverride from 'method-override';

import { helmetConfig } from './config/helmet.config.js';
import { viewEngineConfig } from './config/view.engine.config.js';
import { staticConfig } from './config/static.config.js';
import { httpLogger, logger } from './config/logger.config.js';

import indexRoutes from './routes/index.routes.js';

import { globalLimiter } from './middlewares/rate.limiter.middleware.js';
import { notFound, errorHandler } from './middlewares/error.middleware.js';

import './jobs/health-check.job.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(globalLimiter);

app.use(helmet(helmetConfig));

app.use(httpLogger);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride('_method'));

viewEngineConfig(app);

staticConfig(app);

app.use('/', indexRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server radi na portu ${PORT} u ${process.env.NODE_ENV || 'development'} modu`);
});

export default app;