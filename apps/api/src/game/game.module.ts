import { Module } from '@nestjs/common';
import { RankModule } from './rank/rank.module';
import { MatchMakingModule } from './match-making/match-making.module';
import { GamePlayModule } from './gameplay/gameplay.module';
import { MatchesModule } from './matches/matches.module';

@Module({
  imports: [RankModule, MatchesModule, MatchMakingModule, GamePlayModule],
})
export class GameModule {}
