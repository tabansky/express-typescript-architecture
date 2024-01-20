import app from './app';
import { logger } from './tools/logger';

const port = app.get('port');
const server = app.listen(port);

process.on('unhandledRejection', (reason: Error, promise) => {
  logger.error(`Unhandled Rejection at: Promise ${JSON.stringify(promise)}\n Reason: ${reason}`);
});

server.on('listening', () => logger.info(`Application started on http://${app.get('host')}:${port}`));

