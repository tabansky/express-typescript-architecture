export type RouteHandler = `${string}.${string}`;

export type MiddlewareHandler = string;

export type RouteDefinition = {
  pattern: string,
  handler: RouteHandler,
  methods: string[],
  middleware: MiddlewareHandler[],
};

export type ResourceRouteNames = 'index' | 'edit' | 'store' | 'update' | 'destroy';
