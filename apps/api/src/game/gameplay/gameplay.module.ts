import { Module } from '@nestjs/common';
import { GamePlayService } from './gameplay.service';
import { GamePlayGateway } from './gameplay.gateway';

@Module({
  providers: [GamePlayService, GamePlayGateway],
})
export class GamePlayModule {}
