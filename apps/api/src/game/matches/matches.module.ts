import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesGateway } from './matches.gateway';
import { IamModule } from '@src/iam/iam.module';

@Module({
  imports: [IamModule],
  providers: [MatchesGateway, MatchesService],
  exports: [MatchesService],
})
export class MatchesModule {}
