import { logger } from '../config/logger.config.js';
import { errors } from '../utils/error.utils.js';

function isApiRequest(req) {
  return (
    req.baseUrl?.startsWith('/api') ||
    req.originalUrl?.startsWith('/api') ||
    req.headers.accept?.includes('application/json') ||
    req.xhr
  );
}

export function notFound(req, res, next) {
  next(errors.notFound(`Stranica nije pronađena: ${req.originalUrl}`));
}

export function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const errorId = Math.random().toString(36).substring(2, 10);
  const isDev = process.env.NODE_ENV === 'development';

  logger.error({ err, errorId, status, url: req.originalUrl }, err.message);
  if (isApiRequest(req)) {
    const response = {
      success: false,
      error: {
        id: errorId,
        message: err.message || 'Došlo je do greške',
        status,
      },
    };
    if (isDev) response.error.stack = err.stack;
    return res.status(status).json(response);
  }

  res.status(status).render('error/error', {
    title: `Greška ${status}`,
    message: err.message || 'Došlo je do greške',
    status,
    errorId,
    stack: isDev ? err.stack : null,
  });
}