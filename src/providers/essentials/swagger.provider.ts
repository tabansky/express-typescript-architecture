import { swaggerConfig } from '@config';
import { Provider } from '@core/abstract/abstract.provider';
import { Application } from '@core/declarations';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// todo add autogenerate
export class SwaggerProvider extends Provider {
  public static provide(app: Application): void {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(swaggerConfig)));
  }
}
