import { camelToSnake } from './helpers/string.helper';

// todo refactor abstract model
export abstract class Model {
  public static aliases() {
    return Object.keys(this).reduce((acc, key) => {
      acc[key] = [camelToSnake(key), key];

      return acc;
    }, {});
  };
}
