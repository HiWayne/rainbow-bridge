import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
  UsePipes,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthorityService } from './authority.service';
import {
  GetRolesOfUser,
  SetRolesToUser,
  CreateAuthenticationDto,
  CreateRoleDto,
  CreateRoleByExtendDto,
  RoleAddAuthenticationDto,
  RoleRemoveAuthenticationDto,
  DeleteAuthenticationDto,
  DeleteRoleDto,
} from '~/dto/authority/authority.dto';
import { UserPipe } from '~/pipe/user/user.pipe';
import { AuthenticationGuard } from '~/guard/authentication/authentication.guard';
import { Role } from '~/decorators/role';
import { Roles } from 'config/index';
import { UserService } from 'components/user/user.service';

@Controller('api')
@UsePipes(UserPipe)
export class AuthorityController {
  constructor(
    private readonly authorityService: AuthorityService,
    private readonly userServie: UserService,
  ) {}

  @Get('/role/list')
  async getRolesList() {
    return await this.authorityService.getRoleList();
  }

  @Get('/authority/list')
  async getAuthoritiesList() {
    return;
  }

  @Get('/role/of/user')
  async getRolesOfUser(@Query() query: GetRolesOfUser, @Request() request) {
    return await this.authorityService.getRolesOfUser(query, request);
  }

  @Post('/roles/to/user')
  @Role(Roles.ADMIN)
  @UseGuards(AuthenticationGuard)
  async setRolesToUser(@Body() body: SetRolesToUser) {
    return await this.authorityService.setRolesToUser(body);
  }

  /**
   * 所有role, authority的操作都需要admin及以上
   * 其中删除role authority的操作只有super_admin有权限
   *
   * 只有权限等级大于等于创建该role的人
   * 才有权利修改它的authority
   *
   * 只有权限等级大于等于创建该authority的人
   * 才有权利把它加入role
   */

  @Post('/role/create')
  @Role(Roles.ADMIN)
  @UseGuards(AuthenticationGuard)
  async createRole(@Body() body: CreateRoleDto, @Request() request) {
    return this.authorityService.createRole(body, request);
  }

  @Post('/role/create/by/extend')
  @Role(Roles.ADMIN)
  @UseGuards(AuthenticationGuard)
  async createRoleByExtend(
    @Body() body: CreateRoleByExtendDto,
    @Request() request,
  ) {
    return;
  }

  @Role(Roles.ADMIN)
  @UseGuards(AuthenticationGuard)
  @Post('/authority/create')
  async createAuthority(@Body() body: CreateAuthenticationDto) {
    return;
  }

  @Role(Roles.ADMIN)
  @UseGuards(AuthenticationGuard)
  @Put('/role/add/authority')
  async roleAddAuthority(@Body() body: RoleAddAuthenticationDto) {
    return;
  }

  @Role(Roles.ADMIN)
  @UseGuards(AuthenticationGuard)
  @Put('/role/remove/authority')
  async roleRemoveAuthority(@Body() body: RoleRemoveAuthenticationDto) {
    return;
  }

  @Delete('/authority/delete')
  @Role(Roles.SUPER_ADMIN)
  @UseGuards(AuthenticationGuard)
  async deleteAuthority(@Body() body: DeleteAuthenticationDto) {
    return;
  }

  @Delete('/role/delete')
  @Role(Roles.SUPER_ADMIN)
  @UseGuards(AuthenticationGuard)
  async deleteRole(@Body() body: DeleteRoleDto) {
    return;
  }
}
