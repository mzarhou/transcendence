import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { SearchUsersDto } from './dto/search-users.dto';
import { ActiveUser } from '@src/iam/decorators/active-user.decorator';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { ChatService } from './chat.service';
import { IdDto } from '@src/+common/dto/id-param.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @HttpCode(HttpStatus.OK)
  @Get('search')
  async search(
    @ActiveUser() user: ActiveUserData,
    @Query() { term }: SearchUsersDto,
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

  @Get('blocked')
  async findBlockedUsers(@ActiveUser() user: ActiveUserData) {
    return this.chatService.findBlockedUsers(user);
  }

  @Post('/block/:id')
  blockUser(@Param() { id }: IdDto, @ActiveUser() activeUser: ActiveUserData) {
    return this.chatService.blockUser(activeUser, id);
  }

  @Post('/unblock/:id')
  unblockUser(
    @Param() { id }: IdDto,
    @ActiveUser() activeUser: ActiveUserData,
  ) {
    return this.chatService.unblockUser(activeUser, id);
  }
}
