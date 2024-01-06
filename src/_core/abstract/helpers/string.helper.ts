export function camelToSnake(input: string): string {
  return input.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
}

export function snakeToCamel(input: string): string {
  return input.replace(/_([a-z])/g, (_, group) => group.toUpperCase());
}
