import { Module } from '@nestjs/common';
import { MatchMakingGateway } from './match-making.gateway';
import { MatchesModule } from '@src/game/matches/matches.module';
import { IamModule } from '@src/iam/iam.module';

@Module({
  imports: [MatchesModule, IamModule],
  providers: [MatchMakingGateway],
})
export class MatchMakingModule {}
