import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { SearchUsersDto } from './dto/search-users.dto';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interface/active-user-data.interface';
import { ChatService } from './chat.service';
import { IdDto } from 'src/common/dto/id-param.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @HttpCode(HttpStatus.OK)
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

  @HttpCode(HttpStatus.OK)
  @Post('/unfriend/:id')
  unfriend(@Param() { id }: IdDto, @ActiveUser() activeUser: ActiveUserData) {
    return this.chatService.unfriend(id, activeUser);
  }
}
