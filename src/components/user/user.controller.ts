import { Controller, Get, Post, Body, Query, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreateDTO, UserFindByIdDTO, UserFindByNameDTO } from 'shared/DTO/user/user.dto';
import { UserPipe } from 'shared/Pipe/user/user.pipe';

@Controller('api')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/user/create/')
  @UsePipes(UserPipe)
  async createUser(@Body() body: UserCreateDTO) {
    return await this.userService.createUser(body);
  }

  @Get('user/find')
  async findUsers(@Query() query: UserFindByIdDTO | UserFindByNameDTO) {
    return await this.userService.findAll(query);
  }
}
