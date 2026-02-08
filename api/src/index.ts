import 'dotenv/config';
import { app } from './app';
import logger from './logger';
import config from './config';

const server = app.listen(config.port, () => {
  logger.info(`Server running on port ${config.port}`);
});

process.on('SIGINT', () => {
  logger.info('Shutting down');
  server.close(() => process.exit(0));
});
