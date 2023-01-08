import appEnv from 'src/config/env';
import { DatabaseTables } from 'src/constants/db.constants';
import { database } from 'src/db/db';
import { CreateUserDto, UpdateUserDto } from './user.interface';
import { isObject } from 'src/utils/typeCheck.utils';
import { MessageType } from 'src/constants/process.constants';

type UsersRepositoryMessage = {
  type: string;
  data: unknown;
};

class UserRepository {
  private async listenMessage() {
    return new Promise((resolve) => {
      process.on('message', (msg) => {
        if (this.validateProcessMessage(msg)) resolve(msg.data);
      });
    });
  }

  async getAllUsers() {
    if (appEnv.isCluster) {
      process.send?.({ method: 'find', model: DatabaseTables.Users });
      return this.listenMessage();
    } else {
      return database.find(DatabaseTables.Users);
    }
  }

  async getUserById(id: string) {
    if (appEnv.isCluster) {
      process.send?.({
        method: 'findOne',
        model: DatabaseTables.Users,
        data: { id },
      });
      return this.listenMessage();
    } else {
      return database.findOne(DatabaseTables.Users, { id });
    }
  }

  async createUser(body: CreateUserDto) {
    if (appEnv.isCluster) {
      process.send?.({
        method: 'create',
        model: DatabaseTables.Users,
        data: body,
      });
      return this.listenMessage();
    } else {
      return database.create<CreateUserDto>(DatabaseTables.Users, body);
    }
  }

  async updateUser(id: string, data: UpdateUserDto) {
    if (appEnv.isCluster) {
      process.send?.({
        method: 'update',
        model: DatabaseTables.Users,
        data: { ...data, id },
      });
      return this.listenMessage();
    } else {
      return database.update<UpdateUserDto>(DatabaseTables.Users, {
        id,
        data,
      });
    }
  }

  async deleteUser(id: string) {
    if (appEnv.isCluster) {
      process.send?.({
        method: 'delete',
        model: DatabaseTables.Users,
        data: { id },
      });
      return this.listenMessage();
    } else {
      return database.delete(DatabaseTables.Users, { id });
    }
  }

  private validateProcessMessage(msg: unknown): msg is UsersRepositoryMessage {
    return (
      isObject(msg) &&
      'type' in msg &&
      'data' in msg &&
      msg.type === MessageType.Users
    );
  }
}

export default new UserRepository();
