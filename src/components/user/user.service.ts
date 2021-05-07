import fs = require('fs');
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getManager, EntityManager } from 'typeorm';
import {
  UserCreateDto,
  UserFindByIdDto,
  UserFindByNameDto,
  UserNameDto,
  LoginDto,
  RefreshTokenDto,
} from '~/dto/user/user.dto';
import { SaltDto } from '~/dto/salt/salt.dto';
import { PasswordDto } from '~/dto/password/password.dto';
import { IterateDto } from '~/dto/iterate/iterate.dto';
import * as jwt from 'jsonwebtoken';
import * as CryptoJS from 'crypto-js';
import config, { Roles } from 'config/index';
import { User } from './user.entity';
import { Password } from './password.entity';
import { Salt } from './salt.entity';
import { Iterate } from './iterate.entity';
import {
  transformClass,
  isExist,
  getTimeWithMillisecond,
} from 'shared/utils/common';

// jwt非对称算法名称
const ALGORITHM_NAME = 'HS512';

// 拿PBKDF2派生次数
const { ITERATECOUNT, privateKeyPath, publicKeyPath } = config;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User, 'userConnection')
    private readonly userRepository: Repository<User>,
    @InjectRepository(Password, 'userConnection')
    private readonly passwordRepository: Repository<Password>,
    @InjectRepository(Salt, 'userConnection')
    private readonly saltRepository: Repository<Salt>,
    @InjectRepository(Iterate, 'userConnection')
    private readonly iterateRepository: Repository<Iterate>,
  ) {}

  // 创建用户
  public async createUser(body: UserCreateDto) {
    const entityManager = getManager('userConnection');
    const result = await entityManager.transaction(
      'REPEATABLE READ',
      async (runInTransaction: EntityManager) => {
        const { password, name } = body;
        // 检查用户名是否重复
        const nameCanUse = await this.checkUserName({ name });
        if (!nameCanUse) {
          throw new HttpException(
            {
              status: 4,
              data: false,
              message: '用户名重复',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
        const userEntity = await transformClass<User, UserCreateDto>(
          User,
          body,
        );
        const user = await runInTransaction.save<User>(userEntity);
        const { id } = user;
        // 生成盐
        const salt = CryptoJS.lib.WordArray.random(128 / 8).toString();
        // PBKDF2派生算法计算密码hash
        const passwordHash = this.computeHash(password, salt, ITERATECOUNT);
        await Promise.all([
          // 存盐
          transformClass<Salt, SaltDto>(Salt, { id, salt }).then(salt =>
            runInTransaction.save<Salt>(salt),
          ),
          // 存hash
          transformClass<Password, PasswordDto>(Password, {
            id,
            hash: passwordHash,
          }).then(password => runInTransaction.save<Password>(password)),
          // 为当前用户存当前次数快照（不存将来派生次数被修改会导致用户密码hash失效）
          transformClass<Iterate, IterateDto>(Iterate, {
            id,
            iterate: ITERATECOUNT,
          }).then(iterate => runInTransaction.save<Iterate>(iterate)),
        ]);
        return user;
      },
    );
    return result;
  }

  // 登录
  public async login(body: LoginDto) {
    const { name, password } = body;
    const users = await this.findByCondition({ name });
    const NO_ACCESS_REQUEST = new HttpException(
      { data: false, message: '用户名或密码错误' },
      HttpStatus.BAD_REQUEST,
    );
    const BAD_RESPONSE = new HttpException(
      { data: false, message: '' },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    if (users && users.length) {
      const user = users[0];
      const { id } = user;
      const [_hashFromDatabase, _salt, _iterate] = await Promise.all([
        this.passwordRepository.findOne({ id }),
        this.saltRepository.findOne({ id }),
        this.iterateRepository.findOne({ id }),
      ]).catch(() => {
        throw BAD_RESPONSE;
      });
      if (_hashFromDatabase && _salt && isExist(_iterate)) {
        const { salt } = _salt;
        const { iterate } = _iterate;
        const { hash: hashFromDatabase } = _hashFromDatabase;
        const hashFromRequest = this.computeHash(password, salt, iterate);
        if (hashFromRequest === hashFromDatabase) {
          // 有效期15分钟
          const access_token = this.createAccessToken({ id, type: 'access' });
          // 有效期6个月
          const refresh_token = this.createRefreshToken({
            id,
            type: 'refresh',
          });
          return { user, access_token, refresh_token };
        } else {
          throw NO_ACCESS_REQUEST;
        }
      } else {
        throw BAD_RESPONSE;
      }
    } else {
      throw NO_ACCESS_REQUEST;
    }
  }

  // 检查用户名是否合法（重复）
  public async checkUserName(query: UserNameDto) {
    const { name } = query;
    const isExist = await this.userRepository.findOne({ name });
    return !isExist;
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

  // 生成token
  private createToken(data, time = getTimeWithMillisecond(15, 'minute')) {
    const privateKey = fs.readFileSync(privateKeyPath);
    const token = jwt.sign(
      { data, expires: time },
      privateKey.toString('base64'),
      {
        algorithm: ALGORITHM_NAME,
      },
    );
    return token;
  }

  private createAccessToken(data) {
    return this.createToken(data, getTimeWithMillisecond(15, 'minute'));
  }

  private createRefreshToken(data) {
    return this.createToken(data, getTimeWithMillisecond(6, 'month'));
  }

  // 解析token
  public decodeToken(token) {
    if (!token) {
      return null;
    }
    try {
      const privateKey = fs.readFileSync(privateKeyPath);
      const decoded = jwt.decode(token, privateKey.toString('base64'), {
        algorithms: ALGORITHM_NAME,
      });
      return decoded;
    } catch {
      return null;
    }
  }

  // 根据token获取用户信息
  private async getUserByToken(token: string): Promise<User> {
    if (!token) {
      return null;
    }
    try {
      const decoded = this.decodeToken(token);
      if (!decoded) {
        return null;
      }
      const { data, expires } = decoded;
      const { id, type } = data;
      if (type !== 'access') {
        return null;
      }
      if (new Date().getTime() < expires) {
        const user = await this.findOneByCondition({ id });
        if (user) {
          return user;
        } else {
          return null;
        }
      } else {
        // 过期
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  public async refreshToken(body: RefreshTokenDto): Promise<string> {
    const { token } = body;
    const decoded = this.decodeToken(token);
    if (decoded && decoded.data.type === 'refresh') {
      if (new Date().getTime() < decoded.expires) {
        const id = decoded.data.id;
        const accessToken = this.createAccessToken({ id, type: 'access' });
        return accessToken;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  public async getUserProfile(query) {
    const { token } = query;
    const user = await this.getUserByToken(token);
    return user;
  }

  public async findByCondition(params): Promise<User[]> {
    const users = await this.userRepository.find(params);
    return users;
  }

  public async findOneByCondition(params): Promise<User> {
    const user = await this.userRepository.findOne(params);
    if (user) {
      return user;
    } else {
      return null;
    }
  }
}
