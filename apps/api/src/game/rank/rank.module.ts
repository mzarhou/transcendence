import { Module } from '@nestjs/common';
import { RankService } from './rank.service';
import { RankController } from './rank.controller';
import { MatchesModule } from '@src/game/matches/matches.module';
import { UsersModule } from '@src/users/users.module';

@Module({
  imports: [MatchesModule, UsersModule],
  controllers: [RankController],
  providers: [RankService],
  exports: [RankService],
})
export class RankModule {}
