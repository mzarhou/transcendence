import { Module } from '@nestjs/common';
import { MatchMakingGateway } from './match-making.gateway';
import { MatchesModule } from '@src/game/matches/matches.module';
import { IamModule } from '@src/iam/iam.module';
import { WebsocketModule } from '@src/websocket/websocket.module';
import { PlayersQueueStorage } from './players-queue.storage';
import { RedisModule } from '@src/redis/redis.module';

@Module({
  imports: [MatchesModule, IamModule, WebsocketModule, RedisModule],
  providers: [MatchMakingGateway, PlayersQueueStorage],
})
export class MatchMakingModule {}
