import { Injectable } from '@nestjs/common';
import { BaseGroupsPolicy } from '../groups-common/base-groups.policy';

@Injectable()
export class GroupManagementPolicy extends BaseGroupsPolicy {}
