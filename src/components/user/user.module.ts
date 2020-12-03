import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './user.entity';
import { Password } from './password.entity';
import { Salt } from './salt.entity';
import { Iterate } from './iterate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Password, Salt, Iterate], 'user')],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
