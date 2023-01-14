import { validate as uuidValidate } from 'uuid';

export type ValidationRange = { max: number; min: number };

export class Validator {
  protected isValidUUID(id: string) {
    return uuidValidate(id);
  }

  protected isInt(value: unknown) {
    return Number.isInteger(value);
  }

  protected isString(value: unknown) {
    return typeof value === 'string';
  }

  protected hasLength(
    value: string | Array<unknown>,
    range: { min: number; max: number }
  ) {
    const length = value.length;
    const { min, max } = range;
    return length >= min && length <= max;
  }

  protected isRange(value: number, range: ValidationRange) {
    const { min, max } = range;
    return value >= min && value <= max;
  }

  protected isArray(value: unknown) {
    return typeof value === 'object' && Array.isArray(value);
  }

  protected isTruthy(v: unknown) {
    return !!v;
  }
}
