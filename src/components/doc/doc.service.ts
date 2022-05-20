import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Doc } from './doc.entity';
import {
  DocCreateDto,
  DocUpdateDto,
  GetDocListDto,
  DeleteDocDto,
} from '~/dto/doc/doc.dto';
import { UserService } from '../user/user.service';
import dayjs = require('dayjs');

type Permission = 'view' | 'modify' | 'share_to_view' | 'share_to_modify';

@Injectable()
export class DocService {
  constructor(
    @InjectRepository(User, 'securityConnection')
    private readonly userRepository: Repository<User>,
    @InjectRepository(Doc, 'docsConnection')
    private readonly docRepository: Repository<Doc>,
    private readonly userService: UserService,
  ) {}

  public async createDoc(token: string, body: DocCreateDto) {
    try {
      const user = await this.userService.getUserByToken(token);
      if (user) {
        const { name, desc, content, cover } = body;
        const doc = await this.docRepository.save({
          creator: user.id,
          name: name || '未命名文档',
          desc: desc || '',
          content,
          cover: cover || '',
          like: 0,
          collect: 0,
          create_time: dayjs().valueOf(),
        });
        return { id: doc.id };
      } else {
        throw new HttpException(
          {
            status: 4,
            data: null,
            message: '用户未登录',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      throw new HttpException(
        {
          status: 0,
          data: null,
          message: error,
        },
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  public async updateDoc(token?: string, body?: DocUpdateDto) {
    try {
      const user: any = !token
        ? true
        : await this.userService.getUserByToken(token);
      if (user) {
        const { id } = body;
        const isValid = !token
          ? true
          : await this.verifyPermissions(user.id, id, 'modify');
        if (isValid) {
          const bodyFilter = Reflect.ownKeys(body).reduce((newObj, key) => {
            if (body[key] !== undefined || body[key] !== null) {
              newObj[key] = body[key];
            }
            return newObj;
          }, {});
          await this.docRepository.update(id, {
            ...bodyFilter,
            update_time: dayjs().valueOf(),
          });
          return true;
        } else {
          throw new HttpException(
            {
              status: 4,
              data: false,
              message: '没有权限修改',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      } else {
        throw new HttpException(
          {
            status: 4,
            data: false,
            message: '用户未登录',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      throw new HttpException(
        {
          status: 0,
          data: false,
          message: error,
        },
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  public async getDocDetail(token?: string, id?: string | number) {
    try {
      const user: any = !token
        ? true
        : await this.userService.getUserByToken(token);
      if (user) {
        const docId = Number(id);
        const isValid = !token
          ? true
          : await this.verifyPermissions(user.id, docId, 'view');
        if (isValid) {
          const doc = await this.docRepository.findOne({ id: docId });
          if (doc) {
            return {
              ...doc,
              update_time: Number(doc.update_time),
              create_time: Number(doc.create_time),
            };
          } else {
            throw new HttpException(
              {
                status: 4,
                data: null,
                message: '文档不存在',
              },
              HttpStatus.BAD_REQUEST,
            );
          }
        } else {
          throw new HttpException(
            {
              status: 4,
              data: false,
              message: '没有权限查看',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      } else {
        throw new HttpException(
          {
            status: 4,
            data: false,
            message: '用户未登录',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      throw new HttpException(
        {
          status: 0,
          data: null,
          message: error,
        },
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  public async getDocList(query: GetDocListDto) {
    const { userId } = query;
    const getOwnDocs = this.docRepository.find({ creator: Number(userId) });
    const getAllDocs = this.docRepository.find();
    const ownDocs = await getOwnDocs;
    const allDocs = await getAllDocs;
    const collaborativeDocs = allDocs.filter(doc => {
      const collaborators = doc.collaborator?.split(',') || [];
      return collaborators.includes(userId + '');
    });
    const docs = [...ownDocs, ...collaborativeDocs];
    const results = await Promise.all(
      docs.map(doc =>
        (async () => {
          try {
            const user = await this.userRepository.findOne({ id: doc.creator });
            const userName = user?.name || '';
            return {
              ...doc,
              creator_name: userName,
              update_time: Number(doc.update_time),
              create_time: Number(doc.create_time),
            };
          } catch (e) {
            console.log(e);
          }
        })(),
      ),
    );
    return results;
  }

  public async deleteDoc(query: DeleteDocDto) {
    const { docId } = query;
    const result = await this.docRepository.delete({ id: Number(docId) });
    if (result.affected) {
      return true;
    } else {
      return false;
    }
  }

  public async getPermissonsFromDoc(query): Promise<Permission[]> {
    return [];
  }

  public async addPeopleToDocPermission(token: string, body) {}

  public async verifyPermissions(
    userId: number,
    docId: number,
    permission: Permission,
  ): Promise<boolean> {
    return true;
  }
}
