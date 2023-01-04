import { DatabaseTables } from 'src/constants/db.constants';
import database from 'src/db/db';
import { CreateUserDto, UpdateUserDto } from './user.interface';

class UserService {
  async getAllUsers() {
    return await database.find(DatabaseTables.Users);
  }

  async getUserById(id: string) {
    return await database.findOne(DatabaseTables.Users, id);
  }

  async createUser(body: CreateUserDto) {
    return await database.create<CreateUserDto>(DatabaseTables.Users, body);
  }

  async updateUser(id: string, data: UpdateUserDto) {
    return await database.update<UpdateUserDto>(DatabaseTables.Users, id, data);
  }

  async deleteUser(id: string) {
    return await database.delete(DatabaseTables.Users, id);
  }
}

export default new UserService();
