import { Module } from '@nestjs/common';
import { MatchMakingGateway } from './match-making.gateway';
import { MatchesModule } from '@src/game/matches/matches.module';
import { IamModule } from '@src/iam/iam.module';
import { WebsocketModule } from '@src/websocket/websocket.module';

@Module({
  imports: [MatchesModule, IamModule, WebsocketModule],
  providers: [MatchMakingGateway],
})
export class MatchMakingModule {}
