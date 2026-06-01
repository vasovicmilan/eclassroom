import { logger } from '../config/logger.config.js';

function isApiRequest(req) {
  return (
    req.baseUrl?.startsWith('/api') ||
    req.originalUrl?.startsWith('/api') ||
    req.headers.accept?.includes('application/json') ||
    req.xhr
  );
}

export function notFound(req, res, next) {
  const error = new Error(`Stranica nije pronađena: ${req.originalUrl}`);
  error.status = 404;
  next(error);
}

export function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const errorId = Math.random().toString(36).substring(2, 10);

  logger.error({ err, errorId, status, url: req.originalUrl }, err.message);
  if (process.env.NODE_ENV === 'development') {
    // Ako logger ne prikaže stack dovoljno jasno, možemo i console.error
    // console.error(err.stack); // može ostati, ali nije obavezno
  }

  if (isApiRequest(req)) {
    const response = {
      success: false,
      error: {
        id: errorId,
        message: err.message || 'Došlo je do greške',
        status,
      },
    };
    if (process.env.NODE_ENV === 'development') {
      response.error.stack = err.stack;
    }
    return res.status(status).json(response);
  }

  res.status(status).render('error/error', {
    title: `Greška ${status}`,
    message: err.message || 'Došlo je do greške',
    status,
    errorId,
    stack: process.env.NODE_ENV === 'development' ? err.stack : null,
  });
}