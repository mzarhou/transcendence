import { Injectable } from '@nestjs/common';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { SendGroupMessageDto } from '../dto/group-message';
import { WebsocketService } from '@src/websocket/websocket.service';
import { GroupsService } from '../groups.service';
import { GroupsPolicy } from '../groups-common/groups.policy';
import { GroupsRepository } from '../groups-common/repositories/_groups.repository';
import { GROUP_MESSAGE_EVENT } from '@transcendence/db';
import { PaginationQueryDto } from '@src/+common/dto/pagination-query';
import { UsersRepository } from '@src/users/repositories/users.repository';

@Injectable()
export class GroupChatService {
  constructor(
    private readonly wsService: WebsocketService,
    private readonly groupsService: GroupsService,
    private readonly groupsPolicy: GroupsPolicy,
    private readonly groupsRepository: GroupsRepository,
    private readonly usersRepository: UsersRepository,
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

    const userToExclude = await this.findUsersToExclude(user.sub);
    const targetUsersIds = group.users
      .filter((u) => !userToExclude.includes(u.id))
      .map((u) => u.id);

    this.wsService.addEvent(
      targetUsersIds,
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

    const usersIdsToExclude = await this.findUsersToExclude(user.sub);
    // filter messages
    return messages.filter((m) => !usersIdsToExclude.includes(m.senderId));
  }

  private async findUsersToExclude(userId: number) {
    const { blockedUsers, blockingUsers } =
      await this.usersRepository.findOneOrThrow(userId, {
        includeBlockedUsers: true,
        includeBlockingUsers: true,
      });
    const usersIdsToExclude = [...blockedUsers, ...blockingUsers].map(
      (u) => u.id,
    );
    return usersIdsToExclude;
  }
}
