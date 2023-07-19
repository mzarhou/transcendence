import {
  ArgumentsHost,
  Catch,
  HttpException,
  WsExceptionFilter,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { ERROR_EVENT } from '@transcendence/common';
import { Socket } from 'socket.io';

@Catch(WsException, HttpException)
export class WebsocketExceptionFilter implements WsExceptionFilter {
  catch(exception: WsException | HttpException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient() as Socket;

    const error =
      exception instanceof WsException
        ? exception.getError()
        : exception.getResponse();

    const data = error instanceof Object ? { ...error } : { message: error };
    client.emit(ERROR_EVENT, data);
  }
}
