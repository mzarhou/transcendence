import { Injectable } from '@nestjs/common';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { SendGroupMessageDto } from '../dto/group-message';
import { WebsocketService } from '@src/websocket/websocket.service';
import { GroupsService } from '../groups.service';
import { GroupsPolicy } from '../groups-common/groups.policy';
import { GroupsRepository } from '../groups-common/repositories/_groups.repository';
import { GROUP_MESSAGE_EVENT } from '@transcendence/db';
import { PaginationQueryDto } from '@src/+common/dto/pagination-query';

@Injectable()
export class GroupChatService {
  constructor(
    private readonly wsService: WebsocketService,
    private readonly groupsService: GroupsService,
    private readonly groupsPolicy: GroupsPolicy,
    private readonly groupsRepository: GroupsRepository,
  ) {}

  getGroupRoomKey(groupId: number) {
    return `groups.${groupId}`;
  }

  async sendMessage(
    user: ActiveUserData,
    { groupId, message }: SendGroupMessageDto,
  ) {
    const group = await this.groupsService.findGroupById(groupId);
    await this.groupsPolicy.canSendMessage(user, group);

    const createdMessage = await this.groupsRepository.createMessage({
      groupId: group.id,
      message,
      senderId: user.sub,
    });

    this.wsService.addEvent(
      [this.getGroupRoomKey(group.id)],
      GROUP_MESSAGE_EVENT,
      createdMessage,
    );
    return { success: true };
  }

  async findMessages(
    user: ActiveUserData,
    groupId: number,
    paginationQuery: PaginationQueryDto,
  ) {
    const group = await this.groupsRepository.findOneOrThrow(groupId, {
      includeUsers: true,
    });
    this.groupsPolicy.canRead(user, group);
    const messages = await this.groupsRepository.findGroupMessages(
      group.id,
      paginationQuery,
    );
    return messages;
  }
}
