import pino from 'pino';
import pinoHttp from 'pino-http';

const isProduction = process.env.NODE_ENV === 'production';

export const logger = pino({
  timestamp: pino.stdTimeFunctions.isoTime,
  transport: !isProduction
    ? { target: 'pino-pretty', options: { colorize: true, translateTime: 'SYS:standard' } }
    : undefined,
  level: isProduction ? 'info' : 'debug',
});

export const httpLogger = pinoHttp({
  logger,
  customLogLevel: (res, err) => {
    if (res.statusCode >= 400 && res.statusCode < 500) return 'warn';
    if (res.statusCode >= 500 || err) return 'error';
    return 'info';
  },
  autoLogging: true,
});