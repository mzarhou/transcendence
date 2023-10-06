import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesGateway } from './matches.gateway';

@Module({
  providers: [MatchesGateway, MatchesService],
  exports: [MatchesService],
})
export class MatchesModule {}
