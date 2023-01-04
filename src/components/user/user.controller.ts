import userService from './user.service';
import { MimeType, MIME_TYPES, HttpStatus } from 'src/constants/http.constants';
import { NotFoundError } from 'src/errors/client.error';
import {
  ClientRequestType,
  ServerResponseType,
} from 'src/interfaces/http.interface';
import { toJSON } from 'src/utils/json.utils';
import { CreateUserDto } from './user.interface';

class UserController {
  getAllUsers = async (req: ClientRequestType, res: ServerResponseType) => {
    const allUsers = await userService.getAllUsers();
    res
      .writeHead(HttpStatus.OK, { 'Content-Type': MIME_TYPES[MimeType.JSON] })
      .end(
        toJSON({
          data: allUsers,
          statusCode: HttpStatus.OK,
        })
      );
  };

  getUserById = async (req: ClientRequestType, res: ServerResponseType) => {
    const userId = req.params.id;
    const foundUser = await userService.getUserById(userId);

    if (!foundUser) {
      throw new NotFoundError('User not found');
    }

    res
      .writeHead(HttpStatus.OK, { 'Content-Type': MIME_TYPES[MimeType.JSON] })
      .end(
        toJSON({
          data: foundUser,
          statusCode: HttpStatus.OK,
        })
      );
  };

  createUser = async (req: ClientRequestType, res: ServerResponseType) => {
    const body = req.body as unknown as CreateUserDto;
    const createdUser = await userService.createUser(body);

    res
      .writeHead(HttpStatus.CREATED, {
        'Content-Type': MIME_TYPES[MimeType.JSON],
      })
      .end(
        toJSON({
          data: createdUser,
          statusCode: HttpStatus.CREATED,
        })
      );
  };

  updateUser = async (req: ClientRequestType, res: ServerResponseType) => {
    const userId = req.params.id;
    const foundUser = await userService.updateUser(userId, req.body);

    if (!foundUser) {
      throw new NotFoundError('User not found');
    }

    res
      .writeHead(HttpStatus.OK, { 'Content-Type': MIME_TYPES[MimeType.JSON] })
      .end(
        toJSON({
          data: foundUser,
          statusCode: HttpStatus.OK,
        })
      );
  };

  deleteUser = async (req: ClientRequestType, res: ServerResponseType) => {
    const userId = req.params.id;
    const foundUser = await userService.deleteUser(userId);

    if (!foundUser) {
      throw new NotFoundError('User not found');
    }

    res.writeHead(HttpStatus.NO_CONTENT).end();
  };
}

export default new UserController();
