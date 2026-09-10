import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

export class ApiError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  logger.error(`${req.method} ${req.originalUrl} -> ${statusCode} ${message}`, {
    stack: err.stack,
  });

  res.status(statusCode).json({
    error: {
      message,
      details: err.details,
      ...(env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
}
