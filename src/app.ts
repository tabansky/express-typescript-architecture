import { CREDENTIALS, PORT, databaseConfig } from '@config';
import { Routes } from '@interfaces/routes.interface';
import { ErrorMiddleware } from '@middlewares/error.middleware';
import { initializeRepositories } from '@repositories';
import { logger } from '@utils/logger';
import compression from 'compression';
import cookieParser from 'cookie-parser'; // use for jwt?
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import knex, { Knex } from 'knex';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

export class App {
  public app: express.Application;
  public port: number;

  constructor(routes: Routes[]) {
    this.app = express();
    this.port = PORT || 3000;

    this.initializeDatabase();
    this.initializeMiddlewares();
    initializeRepositories(this.app);
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
  }

  public boot() {
    this.app.listen(this.port, () => logger.info(`App listening on the port ${this.port}`));
  }

  public getServer() {
    return this.app;
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
  }

  private initializeRoutes(routes: Routes[]): void {
    routes.forEach(route => {
      this.app.use('/', route.router);
    });
  }

  private initializeSwagger(): void {
    const options = {
      swaggerDefinition: {
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'Example docs',
        },
      },
      apis: ['swagger.yaml'],
    };

    const specs = swaggerJSDoc(options);
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  }

  private initializeErrorHandling(): void {
    this.app.use(ErrorMiddleware);
  }
}
