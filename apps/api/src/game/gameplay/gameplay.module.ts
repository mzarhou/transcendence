import { Module } from '@nestjs/common';
import { GamePlayService } from './gameplay.service';
import { GamePlayGateway } from './gameplay.gateway';
import { Game } from '../matches/entities/game.entity';
import { IamModule } from '@src/iam/iam.module';

@Module({
  imports: [IamModule],
  providers: [GamePlayService, GamePlayGateway, Game],
})
export class GamePlayModule {}
