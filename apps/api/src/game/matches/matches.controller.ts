import { Controller, Param, Post } from '@nestjs/common';
import { IdDto } from '@src/+common/dto/id-param.dto';
import { MatchesService } from './matches.service';
import { ActiveUser } from '@src/iam/decorators/active-user.decorator';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';

@Controller('games')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}
  @Post(':id/cancel')
  cancelMatch(
    @ActiveUser() user: ActiveUserData,
    @Param() { id: matchId }: IdDto,
  ) {
    return this.matchesService.cancelGame(user, matchId);
  }
}
