import { Module } from '@nestjs/common';
import { RankModule } from './rank/rank.module';
import { MatchesModule } from './matches/matches.module';
import { MatchMakingModule } from './match-making/match-making.module';

@Module({
  imports: [RankModule, MatchesModule, MatchMakingModule],
})
export class GameModule {}
