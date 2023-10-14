import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { Request } from 'express';
import { REQUEST_USER_KEY } from '../iam.constants';
import { ActiveUserData } from '../interface/active-user-data.interface';

/**
 * get current authenticated user
 * !dont use it on public routes
 */
export const ActiveUser = createParamDecorator(
  (field: keyof ActiveUserData | undefined, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const user: ActiveUserData | undefined = request[REQUEST_USER_KEY];
    if (!user) {
      throw new HttpException('server error invalid active user', 500);
    }
    return field ? user?.[field] : user;
  },
);
