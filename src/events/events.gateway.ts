import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { MessageService } from '../message/message.service';
import { MessageDTO } from '../message/dto/index';

@WebSocketGateway(8080, 
  {
    transports:['websocket', 'polling'], 
    cors: {
      // TODO: change configuration
      origin: true,
    }
  }
)
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private messageService: MessageService
  ) {}

  async handleConnection(@ConnectedSocket() client: Socket) {
    const token = (client.handshake.query['Authentication'] as string).split(' ').pop();
    const {valid, payload} = this.authService.verifyToken(token);

    if (!valid)
      return client.disconnect();

    await this.userService.changeUserConnectionStatus(payload.sub, true);

    const users = await this.userService.getUsers();

    client.join(payload.sub);

    client.emit('users-list', users);
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) 
  {
    const token = (client.handshake.query['Authentication'] as string).split(' ').pop();
    await this.userService.changeUserConnectionStatus(token, false);

    const users = await this.userService.getUsers();

    client.emit('users-list', users);
  }

  @SubscribeMessage('message')
  async handleEvent(
    @MessageBody() dto: MessageDTO,
    @ConnectedSocket() client: Socket,
  ) {
    const message = await this.messageService.saveMessage(dto);
    client.to(dto.to).emit('message', message);
    client.to(dto.from).emit('message', message);
  }
}
