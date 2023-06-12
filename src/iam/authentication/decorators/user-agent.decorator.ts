import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const UserAgent = createParamDecorator(
  (_field: never, context: ExecutionContext) => {
    const request: Request = context.switchToHttp().getRequest();
    return request.headers['user-agent'] ?? '';
  },
);
