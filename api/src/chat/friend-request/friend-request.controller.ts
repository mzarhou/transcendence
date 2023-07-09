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
  findOne(@Param() { id }: IdDto) {
    // TODO: check if user authorized to send this request
    return this.friendRequestService.findOne(id);
  }

  @Delete(':id')
  remove(@Param() { id }: IdDto, @ActiveUser() user: ActiveUserData) {
    // TODO: check if user authorized to send this request
    return this.friendRequestService.remove(id, user);
  }

  @HttpCode(HttpStatus.OK)
  @Post(':id/accept')
  accept(@Param() { id }: IdDto, @ActiveUser() user: ActiveUserData) {
    return this.friendRequestService.accept(id, user);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/unfriend/:id')
  unfriend(@Param() { id }: IdDto, @ActiveUser() activeUser: ActiveUserData) {
    return this.friendRequestService.unfriend(id, activeUser);
  }
}
