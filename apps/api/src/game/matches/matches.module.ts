import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service';
import { MatchesGateway } from './matches.gateway';
import { IamModule } from '@src/iam/iam.module';
import { MatchesStorage } from './matches.storage';

@Module({
  imports: [IamModule],
  providers: [MatchesGateway, MatchesService, MatchesStorage],
  exports: [MatchesService, MatchesStorage],
})
export class MatchesModule {}
