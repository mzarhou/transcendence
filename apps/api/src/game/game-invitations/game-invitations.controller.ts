import { Body, Controller, Param, Post } from '@nestjs/common';
import { IdDto } from '@src/+common/dto/id-param.dto';
import { ActiveUser } from '@src/iam/decorators/active-user.decorator';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { GameInvitationsService } from './game-invitations.service';
import { CreateGameInvitationDto } from './dto/create-game-invitation.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Game')
@Controller('game-invitations')
export class GameInvitationsController {
  constructor(private readonly service: GameInvitationsService) {}

  @Post()
  invite(
    @ActiveUser() user: ActiveUserData,
    @Body() data: CreateGameInvitationDto,
  ) {
    return this.service.invite(user, data);
  }

  @Post(':id/accept')
  acceptInvitation(
    @ActiveUser() user: ActiveUserData,
    @Param('id') invitationId: string,
  ) {
    return this.service.acceptInvitation(user, invitationId);
  }
}
