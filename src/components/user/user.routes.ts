/* eslint-disable no-unused-vars */
import { HttpMethod } from 'src/constants/http.constants';
import userController from 'src/components/user/user.controller';
import { RouteConfig } from 'src/interfaces/routes.interface';
import userValidator from 'src/components/user/user.validator';

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
