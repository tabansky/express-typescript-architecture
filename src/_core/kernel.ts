import { CREDENTIALS, HOST, PORT } from '@config';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import { logger } from 'utils/logger';

import { Provider } from './abstract/abstract.provider';
import { Application } from './declarations';
import { GlobalErrorHandler } from './handlers/error.handler';

export class Kernel {
  private app: Application;

  constructor() {
    this.app = express();
    this.preload();
  }

  public provide(providers: typeof Provider[]): this {
    this.showExecutingTime(providers);

    return this;
  };

  private showExecutingTime(providers: typeof Provider[]): void {
    logger.info('Boot providers...');

    for (const provider of providers) {
      console.time(provider.name);

      provider.provide(this.app);

      console.timeEnd(provider.name);
    }

    logger.info('Providers booted successfully!');
  }

  private preload(): void {
    // constants
    this.app.set('port', PORT);
    this.app.set('host', HOST);

    // core middlewares
    this.app.use(cors({ origin: process.env.ORIGIN, credentials: CREDENTIALS }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  public boot(): Application {
    // keep it after all providers
    this.app.use(GlobalErrorHandler);

    return this.app;
  }
}

