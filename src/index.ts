import { logger } from '@utils/logger';

import app from '@/app';

const port = app.get('port');
const server = app.listen(port);

process.on('unhandledRejection', (reason: Error, p) => {
  logger.error('Unhandled Rejection at: Promise ', p, reason);
});

server.on('listening', () => logger.info(`Application started on http://${app.get('host')}:${port}`));
