import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesGateway } from './matches.gateway';
import { IamModule } from '@src/iam/iam.module';
import { MatchesStorage } from './matches.storage';
import { WebsocketModule } from '@src/websocket/websocket.module';
import { MatchesController } from './matches.controller';

@Module({
  imports: [IamModule, WebsocketModule],
  providers: [MatchesGateway, MatchesService, MatchesStorage],
  exports: [MatchesService, MatchesStorage],
  controllers: [MatchesController],
})
export class MatchesModule {}
