import { userFieldsCollection } from 'src/constants/db.constants';
import { BadRequestError } from 'src/errors/client.error';
import {
  ClientRequestType,
  ServerResponseType,
} from 'src/interfaces/http.interface';
import { Validator } from 'src/services/validator.service';
import { CreateUserDto, UpdateUserDto } from './user.interface';

export class UserValidator extends Validator {
  private checkUsername(username: unknown) {
    if (!this.isString(username)) {
      throw new BadRequestError('Field "username" must have "string" type');
    }
  }

  private checkAge(age: unknown) {
    if (!this.isInt(age)) {
      throw new BadRequestError('Field "age" must have "int" type');
    }

    if (!this.isRange(age as number, { max: 100, min: 1 })) {
      throw new BadRequestError('Field "age" must be more 0 but less than 101');
    }
  }

  private checkHobbies(hobbies: unknown[]) {
    if (!this.isArray(hobbies)) {
      throw new BadRequestError('Field "hobbies" must have array');
    }

    if (
      this.isArray(hobbies) &&
      hobbies.length &&
      !Object.values(hobbies).every(this.isString)
    ) {
      throw new BadRequestError(
        'Field "hobbies" must have only "string" type inside array'
      );
    }
  }

  private validateParams(params?: Record<string, string>) {
    const id = params?.id;

    if (!id) {
      throw new BadRequestError('"id" must be specified');
    }

    if (!this.isValidUUID(id)) {
      throw new BadRequestError('"id" does not match UUID pattern');
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

    if (!Array.from(userFieldsCollection).every((field) => field in body)) {
      throw new BadRequestError('Must be specified all required fields');
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

    if (!Object.keys(body).every((field) => userFieldsCollection.has(field))) {
      throw new BadRequestError('Incorrect fields');
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
