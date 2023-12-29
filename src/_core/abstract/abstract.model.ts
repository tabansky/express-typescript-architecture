import { camelToSnake, snakeToCamel } from './helpers/string.helper';

// todo refactor abstract model
export abstract class Model {
  public toCamelCase(data: Record<string, unknown>): Model {
    const result = {} as Model;

    for (const key of Object.keys(data)) {
      result[snakeToCamel(key)] = data[key];
    }

    return result;
  };

  public toSnakeCase(data: Model): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    for (const key of Object.keys(data)) {
      result[camelToSnake(key)] = data[key];
    }

    return result;
  };
}
