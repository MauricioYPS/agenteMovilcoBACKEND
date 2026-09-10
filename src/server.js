import app from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { prisma } from './lib/prisma.js';

const server = app.listen(env.PORT, () => {
  logger.info(`Servidor escuchando en http://localhost:${env.PORT} (${env.NODE_ENV})`);
});

async function shutdown(signal) {
  logger.info(`${signal} recibido, cerrando servidor...`);
  server.close(async () => {
    await prisma.$disconnect();
    logger.info('Servidor cerrado correctamente.');
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection:', reason);
});
