/* eslint-disable no-unused-vars */
import { ValidationRange } from 'src/services/validator.service';
import { HttpStatus } from './http.constants';

type ErrorCallable = (...any: any[]) => string;

export const ERROR_MESSAGES: {
  [statusCode in HttpStatus]?: {
    [key: string]: ErrorCallable;
  };
} = {
  [HttpStatus.NOT_FOUND]: {
    entityNotFound: (entity: string) => `${entity} not found`,
  },
  [HttpStatus.BAD_REQUEST]: {
    incorrectFieldDataType: (field: string, type: string) =>
      `Field "${field}" must have "${type}" type`,
    incorrectArrayFieldDataType: (field: string, type: string) =>
      `Field "${field}" must have "${type}" type in array`,
    incorrectFieldRange: (field: string, range: ValidationRange) =>
      `Field "${field}" must be more or equal "${range.min}" but less or equal than ${range.max}`,
    incorrectParamPattern: (param: string, pattern: string) =>
      `Param "${param}" does not match "${pattern}" pattern`,
    requiredParam: (param: string) => `Param "${param}" must be specified`,
    requiredFields: (fields: string[]) =>
      `Must be specified all required fields: [${fields.join(', ')}]`,
    extraFields: (fields: string[]) =>
      `It has extra fields: [${fields.join(', ')}]`,
    forbiddenOptions: (field: string, fields: string[]) =>
      `"${field}" forbidden. Available values: [${fields.join(', ')}]`,
  },
};
