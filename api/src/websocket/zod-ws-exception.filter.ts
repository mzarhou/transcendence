import { ArgumentsHost, Catch, WsExceptionFilter } from '@nestjs/common';
import { ERROR_EVENT } from '@transcendence/common';
import { ZodValidationException } from 'nestjs-zod';
import { Socket } from 'socket.io';

@Catch(ZodValidationException)
export class ZodWsExceptionFilter implements WsExceptionFilter {
  catch(exception: ZodValidationException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient() as Socket;
    const error = exception.getZodError();
    const errors = error.flatten().fieldErrors;
    client.emit(ERROR_EVENT, { message: 'Validation Failed', errors });
  }
}
