import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { FriendRequestService } from './friend-request.service';
import { CreateFriendRequestDto } from './dto/create-friend-request.dto';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { ActiveUserData } from 'src/iam/interface/active-user-data.interface';

@Controller('chat/friend-request')
export class FriendRequestController {
  constructor(private readonly friendRequestService: FriendRequestService) {}

  @Post()
  create(
    @ActiveUser() user: ActiveUserData,
    @Body() createFriendRequestDto: CreateFriendRequestDto,
  ) {
    // TODO: check if user authorized to send this request
    return this.friendRequestService.create(user, createFriendRequestDto);
  }

  @Get()
  findAll() {
    // TODO: check if user authorized to send this request
    return this.friendRequestService.findAll();
  }

  @Get('sent')
  findSent(@ActiveUser() user: ActiveUserData) {
    // TODO: check if user authorized to send this request
    return this.friendRequestService.findSent(user);
  }

  @Get('received')
  findReceived(@ActiveUser() user: ActiveUserData) {
    return this.friendRequestService.findRecieved(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // TODO: check if user authorized to send this request
    return this.friendRequestService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @ActiveUser() user: ActiveUserData) {
    // TODO: check if user authorized to send this request
    return this.friendRequestService.remove(+id, user);
  }
}
