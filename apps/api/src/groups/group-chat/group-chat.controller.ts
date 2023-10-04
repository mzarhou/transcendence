import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { GroupChatService } from './group-chat.service';
import { SendGroupMessageDto } from '../dto/group-message';
import { ActiveUser } from '@src/iam/decorators/active-user.decorator';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from '@src/+common/dto/pagination-query';
import { IdDto } from '@src/+common/dto/id-param.dto';

@ApiBearerAuth()
@ApiTags('groups')
@Controller('')
export class GroupChatController {
  constructor(private readonly service: GroupChatService) {}

  @ApiOperation({ summary: 'send a group message' })
  @Post('groups/send-message')
  sendMessage(
    @ActiveUser() user: ActiveUserData,
    @Body() data: SendGroupMessageDto,
  ) {
    return this.service.sendMessage(user, data);
  }

  @ApiOperation({ summary: 'Get group messages' })
  @Get('groups/:id/messages')
  async findMessages(
    @ActiveUser() user: ActiveUserData,
    @Param() { id: groupId }: IdDto,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    return this.service.findMessages(user, groupId, paginationQuery);
  }
}
