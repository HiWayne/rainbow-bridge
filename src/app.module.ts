import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { securityConfig, docsConfig } from '../ormconfig';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserModule } from 'components/user/user.module';
import { User } from 'components/user/user.entity';
import { Password } from 'components/user/password.entity';
import { Salt } from 'components/user/salt.entity';
import { Iterate } from 'components/user/iterate.entity';

import { AuthorityModule } from 'components/authority/authority.module';
import { RoleOfUser } from 'components/authority/roleOfUser.entity';
import { Role } from 'components/authority/Role.entity';
import { Authority } from 'components/authority/authority.entity';
import { Doc } from 'components/doc/doc.entity';
import { DocAuthority } from 'components/doc/docAuthority.entity';
import { WsModule } from 'components/websocket/ws.module';
import { DocModule } from 'components/doc/doc.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...securityConfig,
      name: 'securityConnection',
      entities: [User, Password, Salt, Iterate, RoleOfUser, Role, Authority],
    } as TypeOrmModuleOptions),
    TypeOrmModule.forRoot({
      ...docsConfig,
      name: 'docsConnection',
      entities: [Doc, DocAuthority],
    } as TypeOrmModuleOptions),
    UserModule,
    AuthorityModule,
    DocModule,
    WsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
