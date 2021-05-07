import * as dayjs from 'dayjs';
import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getManager, EntityManager } from 'typeorm';
import {
  CreateRoleDto,
  CreateAuthenticationDto,
  RoleAddAuthenticationDto,
  RoleRemoveAuthenticationDto,
  DeleteAuthenticationDto,
  DeleteRoleDto,
} from '~/dto/authority/authority.dto';
import config, { Roles } from 'config/index';
import { RoleOfUser } from './roleOfUser.entity';
import { Authority } from './authority.entity';
import { Role } from './Role.entity';
import { isExist } from 'shared/utils/common';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthorityService {
  constructor(
    @InjectRepository(RoleOfUser, 'userConnection')
    private readonly roleOfUserRepository: Repository<RoleOfUser>,
    @InjectRepository(Role, 'userConnection')
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Authority, 'userConnection')
    private readonly authorityRepository: Repository<Authority>,
    private readonly userService: UserService,
  ) {}

  public async createRole(body: CreateRoleDto, request) {
    const authority = request.__authority;
    if (!authority) {
      throw new ForbiddenException();
    }
    const { userId, roles } = authority;
    const roleText = roles.join(',');
    console.log(userId, roleText);
    const data = await this.roleRepository.save({
      ...body,
      creator: userId,
      role_of_creator: roleText,
      fundamental: false,
    });
    if (data) {
      return data;
    }
  }

  public async getRolesOfUser(query, request) {
    const { ids } = query;
    let idList = [];
    if (isExist(ids)) {
      idList = ids.split(/,|，/);
    } else {
      const authority = request.__authority;
      if (authority && !authority.expired) {
        const { id } = authority;
        idList = [id];
      }
    }
    if (idList && idList.length) {
      const results = await Promise.all(
        idList.map(id =>
          this.roleOfUserRepository.findOne({ id }).catch(() => null),
        ),
      );
      return results.filter(result => !!result);
    } else {
      return [];
    }
  }

  public async getRoleList(): Promise<Role[]> {
    return await this.roleRepository.find();
  }

  public async setRolesToUser(body) {
    const { id, roles } = body;
    let rolesIsLegal = false,
      rolesText = '';
    if (Array.isArray(roles)) {
      const roleList = await this.getRoleList();
      if (Array.isArray(roleList)) {
        rolesIsLegal = roles.every(role =>
          roleList
            .map((_role: Role) => _role.name.toLocaleLowerCase())
            .includes(role.toLocaleLowerCase()),
        );
      }
      rolesText = roles.join(',');
    }
    if (rolesIsLegal) {
      const result = await this.roleOfUserRepository.save({
        id,
        roles: rolesText,
        update_time: dayjs().format(),
      });
      if (result) {
        return true;
      } else {
        return false;
      }
    } else {
      throw new BadRequestException();
    }
  }

  public async getAuthorityByToken(token: string) {
    try {
      const decoded = this.userService.decodeToken(token);
      if (decoded) {
        console.log('decoded', decoded);
        const { data, expires } = decoded;
        if (data.type !== 'access') {
          return null;
        }
        if (new Date().getTime() < expires) {
          const { id } = data;
          const result = await this.roleOfUserRepository.findOne({ id });
          if (result) {
            const { roles: roleText } = result;
            const roles = roleText ? roleText.split(/,|，/) : [];
            console.log('roles', roles);
            return { userId: id, roles };
          } else {
            return null;
          }
        } else {
          return { expired: true };
        }
      } else {
        return null;
      }
    } catch {
      return null;
    }
  }
}