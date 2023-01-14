/* eslint-disable no-unused-vars */
import { HttpMethod } from '../../constants/http.constants';
import userController from '../../components/user/user.controller';
import { RouteConfig } from '../../interfaces/routes.interface';
import userValidator from '../../components/user/user.validator';

export enum UsersEndpoint {
  ById = '/api/users/:id',
  All = '/api/users',
}

export const usersRoutesConfig: RouteConfig[] = [
  {
    method: HttpMethod.Get,
    endpoint: UsersEndpoint.ById,
    controller: userController.getUserById,
    validator: userValidator.validateUserById,
  },
  {
    method: HttpMethod.Get,
    endpoint: UsersEndpoint.All,
    controller: userController.getAllUsers,
    validator: null,
  },
  {
    method: HttpMethod.Post,
    endpoint: UsersEndpoint.All,
    controller: userController.createUser,
    validator: userValidator.validateCreateUser,
  },
  {
    method: HttpMethod.Put,
    endpoint: UsersEndpoint.ById,
    controller: userController.updateUser,
    validator: userValidator.validateUpdateUser,
  },
  {
    method: HttpMethod.Delete,
    endpoint: UsersEndpoint.ById,
    controller: userController.deleteUser,
    validator: userValidator.validateDeleteUser,
  },
];

export const usersEndpoints = Object.values(UsersEndpoint);
