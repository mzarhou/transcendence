import { Global, Module } from '@nestjs/common';
import { WebsocketService } from './websocket.service';
import { WebsocketGateway } from './websocket.gateway';
import { WebsocketClientsStorage } from './websocket-clients.storage';
import { IamModule } from '@src/iam/iam.module';

@Global()
@Module({
  imports: [IamModule],
  providers: [WebsocketService, WebsocketGateway, WebsocketClientsStorage],
  exports: [WebsocketService],
})
export class WebsocketModule {}
