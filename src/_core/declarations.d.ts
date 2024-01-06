import { Application as ExpressApplication } from 'express';

export interface ProvidedTypes {
  port: number;
  host: string;
}

export interface Application extends ExpressApplication {
  get<N extends keyof ProvidedTypes>(name: N): ProvidedTypes[N];
}
