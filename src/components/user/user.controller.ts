import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { UserService } from './user.service';
import {
  UserCreateDto,
  UserFindByIdDto,
  UserFindByNameDto,
} from './user.Dto';

@Controller('api')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('/user/create/')
  async createUser(@Body() body: UserCreateDto) {
    return await this.userService.createUser(body);
  }

  @Get('user/find')
  async findUsers(
    @Query() query: UserFindByIdDto | UserFindByNameDto,
  ) {
    return await this.userService.findAll(query);
  }
}
