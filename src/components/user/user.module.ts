import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { Password } from './password.entity';
import { Salt } from './salt.entity';
import { Iterate } from './iterate.entity';
import { AuthorityService } from 'components/authority/authority.service';
import { RoleOfUser } from 'components/authority/roleOfUser.entity';
import { Role } from 'components/authority/Role.entity';
import { Authority } from 'components/authority/authority.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [User, Password, Salt, Iterate, RoleOfUser, Role, Authority],
      'userConnection',
    ),
  ],
  controllers: [UserController],
  providers: [UserService, AuthorityService],
})
export class UserModule {}
