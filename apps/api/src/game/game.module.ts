import { Module } from '@nestjs/common';
import { RankModule } from './rank/rank.module';
import { MatchMakingModule } from './match-making/match-making.module';
import { GamePlayModule } from './gameplay/gameplay.module';
import { MatchesModule } from './matches/matches.module';
import { IamModule } from '@src/iam/iam.module';
import { WebsocketModule } from '@src/websocket/websocket.module';
import { GameStatusGateway } from './game-status.gateway';
import { ChatModule } from '@src/chat/chat.module';
import { GameInvitationsModule } from './game-invitations/game-invitations.module';

@Module({
  imports: [
    ChatModule,
    IamModule,
    RankModule,
    MatchesModule,
    MatchMakingModule,
    GamePlayModule,
    WebsocketModule,
    GameInvitationsModule,
  ],
  providers: [GameStatusGateway],
})
export class GameModule {}
