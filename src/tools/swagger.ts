import { Application } from '@core/declarations';
import { RouteDefinition } from '@core/types';
import { AnySchema } from 'joi';
import j2s from 'joi-to-swagger';
import { oas30 } from 'openapi3-ts';

function replaceParamColonToBraces(input: string): string {
  const regex = /\/:([^\/]+)/g;
  const output = input.replace(regex, '/{$1}');
  return output;
}

export class SwaggerBuilder extends oas30.OpenApiBuilder {
  constructor({
    app,
    title,
    version,
    serverUrl,
  }: { app: Application; title: string; version: string; serverUrl: string }) {
    super();
    this.addInfo({ title, version })
      .addServer({ url: serverUrl })
      .addSecurityScheme('BearerAuth', { type: 'http', scheme: 'bearer' });

    this.addRoutes(app.get('routes'));
  }

  private addRoutes(routes: RouteDefinition[]) {
    routes.forEach((route) => {
      route.methods.forEach((method) => {
        const lowerCaseMethod = method.toLowerCase();
        const [controller, action] = route.handler.split('.');
        const secure = route.middleware.includes('Auth') ? { security: [{ BearerAuth: [lowerCaseMethod] }] } : {};

        const variables: Record<string, any> = {
          parameters: [],
          requestBody: undefined,
        };

        if (route.validator?.bodySchema) {
          const schema = this.getSchema(route.validator.bodySchema);
          variables.requestBody = { required: true, content: { 'application/json': { schema } } };
        }

        if (route.validator?.routeSchema) {
          const schema = this.getSchema(route.validator.routeSchema);
          variables.parameters.push(...this.getParams(schema, 'path'));
        };

        if (route.validator?.querySchema) {
          const schema = this.getSchema(route.validator.querySchema);
          variables.parameters.push(...this.getParams(schema, 'query'));
        };

        this.addPath(replaceParamColonToBraces(route.pattern), {
          [lowerCaseMethod]: {
            ...secure,
            ...variables,
            tags: [controller],
            description: action,
            responses: { '200': { description: 'OK' } }, // todo think about it
          },
        });
      });
    });
  }

  private getSchema(schema: AnySchema) {
    const { components } = j2s(schema);

    return Object.values(components?.schemas ?? {})[0];
  }

  private getParams(schema: any, type: 'path' | 'query') {
    return Object.keys(schema.properties ?? {}).map((key) => ({
      name: key,
      in: type,
      required: schema.required?.includes(key),
      schema: schema.properties[key],
    }));
  }
}
