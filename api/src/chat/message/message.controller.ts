import { Controller, Get, Param } from '@nestjs/common';
import { IdDto } from 'src/common/dto/id-param.dto';
import { MessageService } from './message.service';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interface/active-user-data.interface';

@Controller('chat')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}
  @Get('/:id/messages')
  findFriendMessages(
    @ActiveUser() user: ActiveUserData,
    @Param() { id: friendId }: IdDto,
  ) {
    return this.messageService.findFriendMessages(user, friendId);
  }
}
