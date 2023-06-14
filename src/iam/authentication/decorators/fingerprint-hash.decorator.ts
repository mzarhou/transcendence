import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { Request } from 'express';

/**
 * get finger print hash from request
 */
export const FPHash = createParamDecorator(
  (_field: never, context: ExecutionContext) => {
    const request: Request & { fingerprint: { hash: string } } = context
      .switchToHttp()
      .getRequest();
    if (!request.fingerprint?.hash) {
      throw new HttpException('server error invalid fph', 500);
    }
    return request.fingerprint.hash;
  },
);
