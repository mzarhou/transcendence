import { ForbiddenError } from '@casl/ability';
import { ExceptionFilter, ArgumentsHost, Catch } from '@nestjs/common';
import { HttpStatusCode } from 'axios';
import { Response } from 'express';
import { AppAbility } from './ability.factory';

@Catch(ForbiddenError)
export class CaslExceptionFilter implements ExceptionFilter {
  catch(exception: ForbiddenError<AppAbility>, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();

    return response.status(HttpStatusCode.Forbidden).json({
      statusCode: HttpStatusCode.Forbidden,
      message: exception.message,
    });
  }
}
