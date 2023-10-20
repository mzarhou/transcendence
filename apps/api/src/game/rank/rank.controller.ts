import { Controller, Get, Param } from '@nestjs/common';
import { RankService } from './rank.service';
import { IdDto } from '@src/+common/dto/id-param.dto';
import { ActiveUser } from '@src/iam/decorators/active-user.decorator';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';

@Controller('rank')
export class RankController {
  constructor(private rankService: RankService) {}

  @Get(':id')
  getGameProfile(
    @ActiveUser() user: ActiveUserData,
    @Param() { id: userId }: IdDto,
  ) {
    return this.rankService.getGameProfile(user, userId);
  }
}
