import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from 'config/index';
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
    const token = request.headers['access_token'];
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
    if (this.getMaxWeight(authority.roles)) {
      return true;
    }
    authority.roles = authority.roles.map(role => role.toLowerCase());
    return roles !== null && roles.length !== 0
      ? roles.some(role =>
          authority.roles.includes(role.toLocaleLowerCase() as Roles),
        )
      : true;
  }
  private getMaxWeight(roles) {
    roles = roles.map(role => role.toLocaleLowerCase());
    if (roles.includes('super_admin')) {
      return true;
    }
  }
}
