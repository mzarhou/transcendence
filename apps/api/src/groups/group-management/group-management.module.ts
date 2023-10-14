import { Module } from '@nestjs/common';
import { GroupManagementController } from './group-management.controller';
import * as actions from './actions';
import { GroupManagementPolicy } from './group-management.policy';
import { GroupsCommonModule } from '../groups-common/groups-common.module';
import { NotificationsModule } from '@src/notifications/notifications.module';
import { IamModule } from '@src/iam/iam.module';

@Module({
  imports: [GroupsCommonModule, NotificationsModule, IamModule],
  controllers: [GroupManagementController],
  providers: [...Object.values(actions), GroupManagementPolicy],
})
export class GroupManagementModule {}
