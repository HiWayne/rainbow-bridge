import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocController } from './doc.controller';
import { DocService } from './doc.service';
import { Doc } from './doc.entity';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { Password } from '../user/password.entity';
import { Salt } from '../user/salt.entity';
import { Iterate } from '../user/iterate.entity';
import { RoleOfUser } from '../authority/roleOfUser.entity';
import { Role } from '../authority/role.entity';
import { Authority } from '../authority/authority.entity';
import { DocAuthority } from './docAuthority.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [User, Password, Salt, Iterate, RoleOfUser, Authority],
      'securityConnection',
    ),
    TypeOrmModule.forFeature(
      [Doc, DocAuthority],
      'docsConnection',
    ),
  ],
  controllers: [DocController],
  providers: [DocService, UserService],
})
export class DocModule {}
