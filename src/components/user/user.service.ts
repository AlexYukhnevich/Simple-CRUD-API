import { CreateUserDto, UpdateUserDto } from './user.interface';
import userRepository from './user.repository';

class UserService {
  async getAllUsers() {
    return userRepository.getAllUsers();
  }

  async getUserById(id: string) {
    return userRepository.getUserById(id);
  }

  async createUser(body: CreateUserDto) {
    return userRepository.createUser(body);
  }

  async updateUser(id: string, data: UpdateUserDto) {
    return userRepository.updateUser(id, data);
  }

  async deleteUser(id: string) {
    return userRepository.deleteUser(id);
  }
}

export default new UserService();
