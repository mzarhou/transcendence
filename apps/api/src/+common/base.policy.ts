import { ForbiddenException } from '@nestjs/common';
import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';

export abstract class BasePolicy {
  throwUnlessCan(can: Boolean, message?: string) {
    if (!can) {
      throw new ForbiddenException();
    }
    return true;
  }

  abstract canView(_user: ActiveUserData, resource: unknown): boolean;
  abstract canCreate(user: ActiveUserData, resource: unknown): boolean;
  abstract canUpdate(user: ActiveUserData, resource: unknown): boolean;
  abstract canDelete(user: ActiveUserData, resource: unknown): boolean;
}
