import { WsException } from '@nestjs/websockets';
import { WsErrorData } from '@transcendence/common';

export class WebsocketException extends WsException {
  constructor(error: WsErrorData | string) {
    super(error);
  }
}
