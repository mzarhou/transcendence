import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FriendRequestService } from './friend-request.service';
import { CreateFriendRequestDto } from './dto/create-friend-request.dto';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interface/active-user-data.interface';
import { IdDto } from 'src/common/dto/id-param.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('friend-request')
@Controller('chat/friend-request')
export class FriendRequestController {
  constructor(private readonly friendRequestService: FriendRequestService) {}

  @Post()
  create(
    @ActiveUser() user: ActiveUserData,
    @Body() createFriendRequestDto: CreateFriendRequestDto,
  ) {
    user.allow('create', 'FriendRequest');
    return this.friendRequestService.create(user, createFriendRequestDto);
  }

  @Get('sent')
  findSent(@ActiveUser() user: ActiveUserData) {
    return this.friendRequestService.findSent(user);
  }

  @Get('received')
  findReceived(@ActiveUser() user: ActiveUserData) {
    return this.friendRequestService.findRecieved(user);
  }

  @Delete(':id')
  async remove(@Param() { id }: IdDto, @ActiveUser() user: ActiveUserData) {
    return this.friendRequestService.remove(user, id);
  }

  @HttpCode(HttpStatus.OK)
  @Post(':id/accept')
  async accept(@Param() { id }: IdDto, @ActiveUser() user: ActiveUserData) {
    return this.friendRequestService.accept(user, id);
  }
}
