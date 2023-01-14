export const isString = (value: unknown) => typeof value === 'string';
export const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && !Array.isArray(value) && value !== null;
