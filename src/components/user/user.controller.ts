import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UsePipes,
  UseGuards,
  Header,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  UserCreateDto,
  UserFindByIdDto,
  UserFindByNameDto,
  UserNameDto,
  LoginDto,
  RefreshTokenDto,
  GetUserProfileDto,
} from '~/components/user/user.dto';
import { VerifyPipe } from '~/pipe/common/verifyType.pipe';
import { AuthenticationGuard } from '~/guard/authentication/authentication.guard';
import { Role } from '~/decorators/role';
import { Roles } from '~/enums/index';

@Controller('api')
@UsePipes(VerifyPipe)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/user/create')
  async createUser(@Body() body: UserCreateDto) {
    return await this.userService.createUser(body);
  }

  @Get('/username/check')
  async checkUserName(@Query() query: UserNameDto) {
    return await this.userService.checkUserName(query);
  }

  @Post('/user/login')
  async login(@Body() body: LoginDto) {
    return await this.userService.login(body);
  }

  @Get('/user/find/by/id')
  async findUserById(@Query() query: UserFindByIdDto) {
    const user = await this.userService.findByCondition(query);
    if (user && user.length) {
      return user[0];
    } else {
      return null;
    }
  }

  @Get('/user/find/by/name')
  async findUsersByName(@Query() query: UserFindByNameDto) {
    return await this.userService.findByCondition(query);
  }

  @Post('/user/refresh/token')
  async refreshToken(@Body() body: RefreshTokenDto) {
    return await this.userService.refreshToken(body);
  }

  @Get('/user/profile')
  async getUserProfile(@Req() req) {
    const { token } = req.headers;
    return this.userService.getUserProfile(token);
  }

  @Get('/user/test')
  @UseGuards(AuthenticationGuard)
  async test() {
    return 'test';
  }
}
