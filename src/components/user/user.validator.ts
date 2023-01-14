import {
  HttpStatus,
  ERROR_MESSAGES,
  userFieldsCollection,
} from '../../constants';
import { BadRequestError } from '../../errors/client.error';
import {
  ClientRequestType,
  ServerResponseType,
} from '../../interfaces/http.interface';
import { ValidationRange, Validator } from '../../services/validator.service';
import { CreateUserDto, UpdateUserDto } from './user.interface';

export class UserValidator extends Validator {
  private checkUsername(username: unknown) {
    if (!this.isString(username)) {
      throw new BadRequestError(
        ERROR_MESSAGES[HttpStatus.BAD_REQUEST]?.incorrectFieldDataType(
          'username',
          'string'
        )
      );
    }
  }

  private checkAge(age: unknown) {
    if (!this.isInt(age)) {
      throw new BadRequestError(
        ERROR_MESSAGES[HttpStatus.BAD_REQUEST]?.incorrectFieldDataType(
          'age',
          'int'
        )
      );
    }

    const ageRange: ValidationRange = { min: 1, max: 100 };
    if (!this.isRange(age as number, ageRange)) {
      throw new BadRequestError(
        ERROR_MESSAGES[HttpStatus.BAD_REQUEST]?.incorrectFieldRange(
          'age',
          ageRange
        )
      );
    }
  }

  private checkHobbies(hobbies: unknown[]) {
    if (!this.isArray(hobbies)) {
      throw new BadRequestError(
        ERROR_MESSAGES[HttpStatus.BAD_REQUEST]?.incorrectFieldDataType(
          'hobbies',
          'array'
        )
      );
    }

    if (
      this.isArray(hobbies) &&
      hobbies.length &&
      !Object.values(hobbies).every(this.isString)
    ) {
      throw new BadRequestError(
        ERROR_MESSAGES[HttpStatus.BAD_REQUEST]?.incorrectArrayFieldDataType(
          'hobbies',
          'string'
        )
      );
    }
  }

  private validateParams(params?: Record<string, string>) {
    const id = params?.id;

    if (!id) {
      throw new BadRequestError(
        ERROR_MESSAGES[HttpStatus.BAD_REQUEST]?.requiredParam('id')
      );
    }

    if (!this.isValidUUID(id)) {
      throw new BadRequestError(
        ERROR_MESSAGES[HttpStatus.BAD_REQUEST]?.incorrectParamPattern(
          'id',
          'UUID'
        )
      );
    }
  }

  public validateUserById = (
    req: ClientRequestType,
    res: ServerResponseType
  ) => {
    this.validateParams(req.params);
  };

  public validateCreateUser = (
    req: ClientRequestType,
    res: ServerResponseType
  ) => {
    const body = req.body as unknown as CreateUserDto;
    const requiredFields = Array.from(userFieldsCollection);

    const hasAllRequiredFields = requiredFields.every((field) => field in body);
    if (!hasAllRequiredFields) {
      throw new BadRequestError(
        ERROR_MESSAGES[HttpStatus.BAD_REQUEST]?.requiredFields(requiredFields)
      );
    }

    const hasExtraFields = Object.keys(body).some(
      (bodyField) => !userFieldsCollection.has(bodyField)
    );

    if (hasExtraFields) {
      const extraFields = Object.keys(body).filter(
        (bodyField) => !userFieldsCollection.has(bodyField)
      );
      throw new BadRequestError(
        ERROR_MESSAGES[HttpStatus.BAD_REQUEST]?.extraFields(extraFields)
      );
    }

    this.checkUsername(body.username);
    this.checkAge(body.age);
    this.checkHobbies(body.hobbies);
  };

  public validateUpdateUser = (
    req: ClientRequestType,
    res: ServerResponseType
  ) => {
    this.validateParams(req.params);

    const body = req.body as unknown as UpdateUserDto;
    const hasExtraFields = Object.keys(body).some(
      (bodyField) => !userFieldsCollection.has(bodyField)
    );
    if (hasExtraFields) {
      const extraFields = Object.keys(body).filter(
        (bodyField) => !userFieldsCollection.has(bodyField)
      );
      throw new BadRequestError(
        ERROR_MESSAGES[HttpStatus.BAD_REQUEST]?.extraFields(extraFields)
      );
    }

    if (body.username) this.checkUsername(body.username);
    if (body.age) this.checkAge(body.age);
    if (body.hobbies) this.checkHobbies(body.hobbies);
  };

  public validateDeleteUser = (req: any, res: ServerResponseType) => {
    this.validateParams(req.params);
  };
}

export default new UserValidator();
