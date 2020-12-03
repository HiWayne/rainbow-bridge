import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getManager, EntityManager } from 'typeorm';
import {
  UserCreateDTO,
  UserFindByIdDTO,
  UserFindByNameDTO,
} from 'shared/DTO/user/user.dto';
import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';
import { User } from './user.entity';
import { Password } from './password.entity';
import { Salt } from './salt.entity';
import { Iterate } from './iterate.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User, 'user')
    private readonly userRepository: Repository<User>,
  ) {}

  public async createUser(body: UserCreateDTO) {
    const entityManager = getManager('user');
    entityManager.transaction(
      'REPEATABLE READ',
      async (runInTransaction: EntityManager) => {
        // 拿PBKDF2派生次数
        const ITERATECOUNT = 10000;
        const { password } = body;
        const { id } = (await runInTransaction.save(body)) as any;
        // 生成盐
        const salt = CryptoJS.lib.WordArray.random(128 / 8).toString();
        // 存盐
        runInTransaction.save<Salt>({ id, salt });
        // PBKDF2派生算法计算密码hash
        const passwordHash = this.computeHash(password, salt, ITERATECOUNT);
        // 存hash
        runInTransaction.save<Password>({ id, hash: passwordHash });
        // 为当前用户存当前次数快照（不存将来派生次数被修改会导致用户密码hash失效）
        runInTransaction.save<Iterate>({ id, iterate: ITERATECOUNT });
      },
    );
  }

  private computeHash(password, salt, count) {
    const key512Bits = CryptoJS.PBKDF2(password, salt, {
      hasher: CryptoJS.algo.SHA512,
      keySize: 512 / 32,
      iterations: count,
    });
    const passwordHash = key512Bits.toString(CryptoJS.enc.Hex);
    return passwordHash;
  }

  public async findAll(params) {
    return await this.userRepository.find(params);
  }
}
