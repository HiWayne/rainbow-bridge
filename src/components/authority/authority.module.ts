import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorityController } from './authority.controller';
import { AuthorityService } from './authority.service';
import { RoleOfUser } from './roleOfUser.entity';
import { Authority } from './authority.entity';
import { Role } from './Role.entity';
import { UserService } from 'components/user/user.service';
import { User } from 'components/user/user.entity';
import { Password } from 'components/user/password.entity';
import { Salt } from 'components/user/salt.entity';
import { Iterate } from 'components/user/iterate.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [RoleOfUser, Authority, Role, User, Password, Salt, Iterate],
      'userConnection',
    ),
  ],
  controllers: [AuthorityController],
  providers: [AuthorityService, UserService],
})
export class AuthorityModule {}
