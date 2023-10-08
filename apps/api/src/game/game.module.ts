import { Module } from '@nestjs/common';
import { RankModule } from './rank/rank.module';
import { MatchesModule } from './matches/matches.module';
import { MatchMakingModule } from './match-making/match-making.module';
import { IamModule } from '@src/iam/iam.module';

@Module({
  imports: [IamModule, RankModule, MatchesModule, MatchMakingModule],
})
export class GameModule {}
