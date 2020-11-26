import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import {
  UserCreateDto,
  UserFindByIdDto,
  UserFindByNameDto,
} from './user.Dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async createUser(body: UserCreateDto) {
    const user = this.userRepository.create(body);
    return await this.userRepository.save(user);
  }

  async findAll(query: UserFindByIdDto | UserFindByNameDto) {
    return await this.userRepository.find(query);
  }
}
