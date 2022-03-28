import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [EventsGateway],
  imports: [UserModule, AuthModule],
})
export class EventsModule {}
