import { Module } from '@nestjs/common';
import { MatchesModule } from '../matches/matches.module';
import { GameInvitationsController } from './game-invitations.controller';
import { GameInvitationsService } from './game-invitations.service';
import { ChatModule } from '@src/chat/chat.module';
import { RedisModule } from '@src/redis/redis.module';
import { WebsocketModule } from '@src/websocket/websocket.module';
import { RankModule } from '../rank/rank.module';
import { GameInvitationsStorage } from './game-invitations.storage';

@Module({
  imports: [
    MatchesModule,
    RedisModule,
    ChatModule,
    WebsocketModule,
    RankModule,
  ],
  controllers: [GameInvitationsController],
  providers: [GameInvitationsService, GameInvitationsStorage],
})
export class GameInvitationsModule {}
