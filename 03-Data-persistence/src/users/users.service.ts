import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  createUser(createUserDto: CreateUserDto): Promise<User> {
    return this.usersRepository.createUser(createUserDto);
  }

  getUsers(): Promise<User[]> {
    return this.usersRepository.getUsers();
  }

  updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return this.usersRepository.updateUser(id, updateUserDto);
  }

  deleteUser(id: string): Promise<void> {
    return this.usersRepository.deleteUser(id);
  }
}
