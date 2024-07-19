import { Provider } from '@core/abstract/provider';
import { Application } from '@core/declarations';
import { SwaggerBuilder } from 'src/tools/swagger';
import swaggerUi from 'swagger-ui-express';

export class SwaggerProvider extends Provider {
  public static provide(app: Application): void {
    const scheme = new SwaggerBuilder(this.setupConfig(app)).getSpecAsJson();

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(JSON.parse(scheme)));
  }

  private static setupConfig(app: Application) {
    const serverUrl = `http://${app.get('host')}:${app.get('port')}`;

    console.info(`swagger serverUrl: ${serverUrl}`);

    return {
      app,
      title: 'Express API',
      version: '0.0.1',
      serverUrl,
    };
  };
}
