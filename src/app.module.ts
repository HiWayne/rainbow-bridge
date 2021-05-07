import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { defaultConfig } from '../ormconfig';

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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...defaultConfig,
      name: 'userConnection',
      entities: [User, Password, Salt, Iterate, RoleOfUser, Role, Authority],
      database: 'nodeData',
    } as TypeOrmModuleOptions),
    UserModule,
    AuthorityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
