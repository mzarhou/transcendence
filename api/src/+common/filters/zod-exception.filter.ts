import { ExceptionFilter, ArgumentsHost, Catch } from '@nestjs/common';
import { HttpStatusCode } from 'axios';
import { Response } from 'express';
import { ZodValidationException } from 'nestjs-zod';

@Catch(ZodValidationException)
export class ZodExceptionFilter implements ExceptionFilter {
  catch(exception: ZodValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();

    const errors = exception.getZodError().flatten().fieldErrors;

    return response.status(HttpStatusCode.BadRequest).json({
      statusCode: HttpStatusCode.BadRequest,
      message: 'Validation Failed',
      errors,
    });
  }
}
