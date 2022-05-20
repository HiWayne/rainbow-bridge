import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets';
import * as WebSocket from 'ws';
import { diff, patch } from 'jsondiffpatch';
import { UserService } from '../user/user.service';
import { DocService } from '../doc/doc.service';
import { WebsocketDto } from '~/dto/websocket/websocket.dto';

@WebSocketGateway(3002, { transports: ['websocket'] })
export class WsGateway {
  wsClients = [];

  constructor(
    private readonly userService: UserService,
    private readonly docService: DocService,
  ) {}

  handleConnection(client: any) {
    this.wsClients.push(client);
  }

  handleDisconnect(client) {
    for (let i = 0; i < this.wsClients.length; i++) {
      if (this.wsClients[i] === client) {
        this.wsClients.splice(i, 1);
        break;
      }
    }
    this.broadcast('disconnect');
  }

  private broadcast(message: any, client?: WebSocket) {
    const broadCastMessage = JSON.stringify(message);
    for (const c of this.wsClients) {
      if (c !== client) {
        c.send(broadCastMessage);
      }
    }
  }

  @SubscribeMessage('doc')
  async handleDoc(
    @MessageBody() data: WebsocketDto,
    @ConnectedSocket() client: WebSocket,
  ) {
    try {
      const { token, docId } = data;
      if (docId === undefined || docId === null) {
        throw new WsException('缺少必要参数');
      }
      const doc = await this.docService.getDocDetail(token, docId);
      if (doc) {
        const { raw } = data;
        const docContent = JSON.parse(doc.content);
        // 1. Get the delta between the server's current state and the client-emitted state
        // note that delta will be null if there's no change.
        const delta = diff(docContent, raw);
        if (delta) {
          let newContent;
          try {
            newContent = patch(docContent, delta);
          } catch (e) {
            console.log(e);
          }
          // 2. We need to patch the server state so that it doesn't become stale
          this.docService.updateDoc(token, {
            id: docId,
            content: JSON.stringify(newContent),
          });
          // 3. Emit the delta to all of the clients.
          this.broadcast(
            {
              event: 'doc',
              delta,
              // 时区
              update_time: new Date().getTime(),
              message: '',
            },
            client,
          );
        }
        return {
          status: 'success',
          event: 'doc',
          message: '',
        };
      } else {
        throw new WsException('没有该文档');
      }
    } catch (error) {
      throw new WsException(error);
    }
  }
}
