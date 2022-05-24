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
  GetPermissonsFromDocDto,
  AddPeopleToDocPermissionDto,
} from '~/components/doc/doc.dto';
import { UserService } from '../user/user.service';
import dayjs = require('dayjs');

export type Permission =
  | 'view'
  | 'modify'
  | 'share_to_view'
  | 'share_to_modify';

@Injectable()
export class DocService {
  constructor(
    @InjectRepository(User, 'securityConnection')
    private readonly userRepository: Repository<User>,
    @InjectRepository(Doc, 'docsConnection')
    private readonly docRepository: Repository<Doc>,
    private readonly userService: UserService,
  ) {}

  public async createDoc(body: DocCreateDto, request) {
    try {
      const user = request.__user;
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

  public async getDocDetail(id: string | number, request) {
    try {
      const user = request.__user;
      if (user) {
        const docId = Number(id);
        const isValid = await this.verifyPermissions(user.id, docId, 'view');
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
      const collaborators = doc.collaborators?.split(',') || [];
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

  public async getPermissionsFromDoc(
    query: GetPermissonsFromDocDto,
  ): Promise<Permission[]> {
    const { user_id, doc_id } = query;
    try {
      const doc = await this.docRepository.findOne({ id: Number(doc_id) });
      if (doc) {
        const collaborators = doc.collaborators.split(',');
        const canEdit = collaborators.includes(user_id);
        if (canEdit) {
          return ['modify', 'share_to_modify'];
        } else {
          const viewers = doc.viewers.split(',');
          const canView = viewers.includes(user_id);
          if (canView) {
            return ['view', 'share_to_view'];
          } else {
            return [];
          }
        }
      } else {
        throw new HttpException(
          {
            status: 4,
            data: false,
            message: '文档不存在',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      return [];
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

  public async addPeopleToDocPermission(
    body: AddPeopleToDocPermissionDto,
    request,
  ) {
    const { user_id, doc_id, permissions } = body;
    const permissionList = new Set(permissions);
    const user = request.__user;
    if (user) {
      const doc = await this.docRepository.findOne({ id: doc_id });
      if (doc) {
        const results = await Promise.all(
          Array.from(permissionList).map(async permission => {
            switch (permission) {
              case 'view':
                const viewers = doc.viewers.split(',');
                if (!viewers.includes(`${user_id}`)) {
                  viewers.push(`${user_id}`);
                  const newViewers = viewers.join(',');
                  const result = await this.docRepository.update(doc_id, {
                    viewers: newViewers,
                  });
                  console.log(result);
                  return true;
                }
              case 'modify':
                const collaborators = doc.collaborators.split(',');
                if (!collaborators.includes(`${user_id}`)) {
                  collaborators.push(`${user_id}`);
                  const newCollaborators = collaborators.join(',');
                  const result = await this.docRepository.update(doc_id, {
                    collaborators: newCollaborators,
                  });
                  console.log(result);
                  return true;
                }
              default:
                return true;
            }
          }),
        );
        if (results.every(result => result)) {
          return true;
        } else {
          throw new HttpException(
            {
              status: 0,
              data: false,
              message: '更新权限失败',
            },
            HttpStatus.BAD_GATEWAY,
          );
        }
      } else {
        throw new HttpException(
          {
            status: 4,
            data: false,
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
          message: '用户未登录或没有权限',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async verifyPermissions(
    userId: number,
    docId: number,
    permission: Permission,
  ): Promise<boolean> {
    const doc = await this.docRepository.findOne({ id: docId });
    switch (permission) {
      case 'view':
        const viewers = doc.viewers.split(',');
        return viewers.includes(`${userId}`);
      case 'modify':
        const collaborators = doc.collaborators.split(',');
        return collaborators.includes(`${userId}`);
      default:
        return false;
    }
  }
}
