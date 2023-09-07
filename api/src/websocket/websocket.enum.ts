import { ActiveUserData } from '@src/iam/interface/active-user-data.interface';
import { Socket } from 'socket.io';

export enum CONNECTION_STATUS {
  CONNECTED = 'CONNECTED',
  NEW_SOCKET = 'NEW_SOCKET',
  DISCONNECTED = 'DISCONNECTED',
}

export interface NewSocketData {
  user: ActiveUserData;
  socket: Socket;
}
