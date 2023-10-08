import { Module } from '@nestjs/common';
import { GamePlayGateway } from './gameplay.gateway';
import { IamModule } from '@src/iam/iam.module';
import { MatchesModule } from '../matches/matches.module';

@Module({
  imports: [IamModule, MatchesModule],
  providers: [GamePlayGateway],
})
export class GamePlayModule {}
