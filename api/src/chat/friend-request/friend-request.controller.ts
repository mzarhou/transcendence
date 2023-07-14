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
import { subject } from '@casl/ability';

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

  @Get(':id')
  async findOne(@Param() { id }: IdDto, @ActiveUser() user: ActiveUserData) {
    const friendRequest = await this.friendRequestService.findOne(id);
    user.allow('read', subject('FriendRequest', friendRequest));
    return friendRequest;
  }

  @Delete(':id')
  async remove(@Param() { id }: IdDto, @ActiveUser() user: ActiveUserData) {
    const friendRequest = await this.friendRequestService.findOne(id);
    user.allow('delete', subject('FriendRequest', friendRequest));
    return this.friendRequestService.remove(id);
  }

  @HttpCode(HttpStatus.OK)
  @Post(':id/accept')
  async accept(@Param() { id }: IdDto, @ActiveUser() user: ActiveUserData) {
    const friendRequest = await this.friendRequestService.findOne(id);
    user.allow('accept', subject('FriendRequest', friendRequest));
    return this.friendRequestService.accept(id, user);
  }
}
