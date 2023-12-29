import { logger } from 'utils/logger';

import app from './app';

const port = app.get('port');
const server = app.listen(port);

process.on('unhandledRejection', (reason: Error, promise) => {
  logger.error('Unhandled Rejection at: Promise ', promise, reason);
});

server.on('listening', () => logger.info(`Application started on http://${app.get('host')}:${port}`));

