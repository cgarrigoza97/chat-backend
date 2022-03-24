import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'dgram';

@WebSocketGateway(8080, 
  {
    transports:['websocket', 'polling'], 
    cors: {
      // TODO: change configuration
      origin: true,
    }
  }
)
export class EventsGateway {
  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): string {
    return 'Hello world!';
  }

  @SubscribeMessage('connection')
  handleConnection(
    @ConnectedSocket() client: Socket,
  ) {
    console.log('client connected')
  }
}
