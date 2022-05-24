import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '~/enums/index';
import { UserService } from '~/components/user/user.service';

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles: Roles[] =
      this.reflector.get<Roles[]>('roles', context.getHandler()) || null;
    const request = context.switchToHttp().getRequest();
    const token = request.headers['token'];
    if (!token) {
      return false;
    }
    const user = await this.userService.getUserByToken(token);
    // 未登录
    if (!user) {
      return false;
    }
    request.__user = user
    return true;
  }
}
