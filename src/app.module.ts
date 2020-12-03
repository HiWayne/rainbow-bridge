import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from 'components/user/user.module';
import { defaultConfig } from '../ormconfig';
import { User } from 'components/user/user.entity';
import { Password } from 'components/user/password.entity';
import { Salt } from 'components/user/salt.entity';
import { Iterate } from 'components/user/iterate.entity';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot({
      ...defaultConfig,
      name: 'user',
      entities: [User, Password, Salt, Iterate],
      database: 'nodeData',
    } as TypeOrmModuleOptions),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
