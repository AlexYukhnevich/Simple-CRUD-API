import userService from './user.service';
import { HttpStatus } from 'src/constants/http.constants';
import { NotFoundError } from 'src/errors/client.error';
import {
  ClientRequestType,
  ServerResponseType,
} from 'src/interfaces/http.interface';
import { CreateUserDto } from './user.interface';

class UserController {
  getAllUsers = async (req: ClientRequestType, res: ServerResponseType) => {
    const allUsers = await userService.getAllUsers();

    return { data: allUsers, statusCode: HttpStatus.OK };
  };

  getUserById = async (req: ClientRequestType, res: ServerResponseType) => {
    const userId = req.params.id;
    const foundUser = await userService.getUserById(userId);

    if (!foundUser) {
      throw new NotFoundError('User not found');
    }

    return { data: foundUser, statusCode: HttpStatus.OK };
  };

  createUser = async (req: ClientRequestType, res: ServerResponseType) => {
    const body = req.body as unknown as CreateUserDto;
    const createdUser = await userService.createUser(body);

    return { data: createdUser, statusCode: HttpStatus.CREATED };
  };

  updateUser = async (req: ClientRequestType, res: ServerResponseType) => {
    const userId = req.params.id;
    const foundUser = await userService.updateUser(userId, req.body);

    if (!foundUser) {
      throw new NotFoundError('User not found');
    }

    return { data: foundUser, statusCode: HttpStatus.OK };
  };

  deleteUser = async (req: ClientRequestType, res: ServerResponseType) => {
    const userId = req.params.id;
    const deletedUser = await userService.deleteUser(userId);

    if (!deletedUser) {
      throw new NotFoundError('User not found');
    }

    return { statusCode: HttpStatus.NO_CONTENT };
  };
}

export default new UserController();
