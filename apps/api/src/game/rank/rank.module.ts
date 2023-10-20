import { Module } from '@nestjs/common';
import { RankService } from './rank.service';
import { RankController } from './rank.controller';
import { MatchesModule } from '@src/game/matches/matches.module';
import { UsersModule } from '@src/users/users.module';
import { ChatModule } from '@src/chat/chat.module';
import { RankGateway } from './rank.gateway';

@Module({
  imports: [MatchesModule, UsersModule, ChatModule],
  controllers: [RankController],
  providers: [RankService, RankGateway],
  exports: [RankService],
})
export class RankModule {}
