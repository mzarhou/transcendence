import { Module } from '@nestjs/common';
import { GamePlayGateway } from './gameplay.gateway';
import { IamModule } from '@src/iam/iam.module';
import { MatchesModule } from '../matches/matches.module';
import { WebsocketModule } from '@src/websocket/websocket.module';

@Module({
  imports: [IamModule, MatchesModule, WebsocketModule],
  providers: [GamePlayGateway],
})
export class GamePlayModule {}
