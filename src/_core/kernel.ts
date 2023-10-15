import { CREDENTIALS, HOST, PORT, databaseConfig, swaggerConfig } from '@config';
import { setupControllers } from '@controllers';
import { Application } from '@core/declarations';
import { ErrorMiddleware, NotFoundMiddleware } from '@core/middlewares';
import { Router } from '@core/router';
import { setupMiddlewares } from '@middlewares/setup';
import { setupRepositories } from '@repositories';
import { routeComponents } from '@routes';
import { logger } from '@utils/logger';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import hpp from 'hpp';
import knex from 'knex';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { sessionConfig } from '../config/session.config';

export class Kernel {
  constructor(private app: Application) {
    this.boot();
  }

  public static integrateTo(app: Application): void {
    new Kernel(app);
  }

  private boot() {
    this.showExecutingTime(
      this.initializeConstants,
      this.initializeDatabase,
      this.initializeMiddlewares,
      this.initializeRepositories,
      this.initializeControllers,
      this.initializeRoutes,
      this.initializeSwagger,
    );
  }

  private showExecutingTime(...funcs: Function[]): void {
    for (const func of funcs) {
      logger.info('initialize ' + func.name.replace('initialize', ''));
      console.time(func.name);

      func.apply(this);

      console.timeEnd(func.name);
    }

    logger.info('---------- initializing completed ----------');
  }

  private initializeConstants(): void {
    this.app.set('port', PORT);
    this.app.set('host', HOST);
  }

  private initializeDatabase(): void {
    this.app.set('knexClient', knex(databaseConfig));
  }

  private initializeMiddlewares(): void {
    this.app.use(cors({ origin: process.env.ORIGIN, credentials: CREDENTIALS }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(session(sessionConfig));
    this.app.use(ErrorMiddleware);
    // this.app.use(NotFoundMiddleware);

    setupMiddlewares(this.app);
  }

  private initializeRepositories(): void {
    setupRepositories(this.app);
  }

  private initializeControllers(): void {
    setupControllers(this.app);
  }

  private initializeRoutes(): void {
    new Router(this.app, routeComponents, 'api').commit();
  }

  private initializeSwagger(): void {
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(swaggerConfig)));
  }
}
