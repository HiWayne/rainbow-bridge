import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '~/enums/index';
import { AuthorityService } from 'components/authority/authority.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authorityService: AuthorityService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles: Roles[] =
      this.reflector.get<Roles[]>('roles', context.getHandler()) || null;
    const request = context.switchToHttp().getRequest();
    const token = request.headers['token'];
    if (!token) {
      return false;
    }
    const authority = await this.authorityService.getAuthorityByToken(token);
    // 没有权限
    if (!authority) {
      return false;
    }
    // 权限过期
    if (authority.expired) {
      return false;
    }
    request.__authority = authority;
    if (this.isMaxWeight(authority.roles)) {
      return true;
    }
    const userRoles = authority.roles.map(role => role.name.toLowerCase());
    return roles !== null && roles.length !== 0
      ? roles.some(role => userRoles.includes(role.toLowerCase()))
      : true;
  }
  private isMaxWeight(roles) {
    if (roles.includes('SUPER_ADMIN')) {
      return true;
    }
  }
}
