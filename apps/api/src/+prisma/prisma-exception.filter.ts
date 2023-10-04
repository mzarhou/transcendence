import { ExceptionFilter, ArgumentsHost, Catch } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { HttpStatusCode } from 'axios';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();

    if (exception.code === 'P2002') {
      return response.status(HttpStatusCode.Conflict).json({
        statusCode: HttpStatusCode.Conflict,
        message: 'Conflict',
      });
    }

    if (exception.code === 'P2003') {
      return response.status(HttpStatusCode.BadRequest).json({
        statusCode: HttpStatusCode.BadRequest,
        message: 'Bad request',
      });
    }

    return response.status(HttpStatusCode.BadRequest).json({
      statusCode: HttpStatusCode.BadRequest,
      message: 'Error: ' + exception.code,
    });
  }
}
