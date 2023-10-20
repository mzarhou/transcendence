import { IAction } from '@src/+common/action';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { GroupsRepository } from '@src/groups/groups-common/repositories/_groups.repository';
import { GroupsPolicy } from '@src/groups/groups-common/groups.policy';
import { Injectable } from '@nestjs/common';
import { MuteUserDto } from '../dto/mute-user.dto';
import { GroupsMutedUsersStorage } from '@src/groups/groups-common/groups-muted-users.storage';

@Injectable()
export class MuteUserAction implements IAction {
  constructor(
    private readonly groupsRepository: GroupsRepository,
    private readonly groupsPolicy: GroupsPolicy,
    private readonly mutedUsersStorage: GroupsMutedUsersStorage,
  ) {}

  async execute(
    user: ActiveUserData,
    groupId: number,
    muteUserDto: MuteUserDto,
  ) {
    const group = await this.groupsRepository.findOneOrThrow(groupId, {
      includeUsers: true,
    });

    this.groupsPolicy.canMuteUser({
      user,
      targetUserId: muteUserDto.userId,
      group,
    });

    await this.mutedUsersStorage.add({
      userId: muteUserDto.userId,
      groupId,
      time: muteUserDto.period,
    });
    return { success: true };
  }
}
