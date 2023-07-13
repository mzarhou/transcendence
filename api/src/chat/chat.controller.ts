import { Body, Controller, Get, Post } from '@nestjs/common';
import { SearchUsersDto } from './dto/search-users.dto';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interface/active-user-data.interface';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('search')
  async search(
    @ActiveUser() user: ActiveUserData,
    @Body() { term }: SearchUsersDto,
  ) {
    return this.chatService.search(user, term);
  }

  @Get('friends')
  async findFriends(@ActiveUser() user: ActiveUserData) {
    return this.chatService.findFriends(user);
  }
}
