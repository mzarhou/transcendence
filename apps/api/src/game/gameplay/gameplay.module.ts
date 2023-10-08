import { Module } from '@nestjs/common';
import { GamePlayGateway } from './gameplay.gateway';
import { Game } from '../matches/matches.storage';
import { IamModule } from '@src/iam/iam.module';

@Module({
  imports: [IamModule],
  providers: [GamePlayGateway],
})
export class GamePlayModule {}
