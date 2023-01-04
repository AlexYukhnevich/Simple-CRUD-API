export class Validator {
  protected isValidUUID(id: string) {
    // Regular expression to check if string is a valid UUID
    const uuidPattern =
      /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
    return uuidPattern.test(id);
  }

  protected isInt(value: unknown) {
    const parsedNumber = Number(value);
    return !isNaN(parsedNumber);
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

  protected isRange(value: number, range: { min: number; max: number }) {
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
