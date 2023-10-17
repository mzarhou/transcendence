import { Module } from '@nestjs/common';
import { RankModule } from './rank/rank.module';
import { MatchMakingModule } from './match-making/match-making.module';
import { GamePlayModule } from './gameplay/gameplay.module';
import { MatchesModule } from './matches/matches.module';
import { IamModule } from '@src/iam/iam.module';

@Module({
  imports: [
    IamModule,
    RankModule,
    MatchesModule,
    MatchMakingModule,
    GamePlayModule,
  ],
})
export class GameModule {}
