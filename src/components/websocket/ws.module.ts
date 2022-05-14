import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '../authority/role.entity';
import { Authority } from '../authority/authority.entity';
import { RoleOfUser } from '../authority/roleOfUser.entity';
import { Doc } from '../doc/doc.entity';
import { DocService } from '../doc/doc.service';
import { Iterate } from '../user/iterate.entity';
import { Password } from '../user/password.entity';
import { Salt } from '../user/salt.entity';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { WsGateway } from './ws.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [User, Password, Salt, Iterate, RoleOfUser, Authority],
      'securityConnection',
    ),
    TypeOrmModule.forFeature([Doc], 'docsConnection'),
  ],
  providers: [WsGateway, UserService, DocService],
})
export class WsModule {}
