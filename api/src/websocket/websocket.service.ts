import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { WebsocketEvent } from './weboscket-event.interface';
import { Server } from 'socket.io';

@Injectable()
export class WebsocketService {
  private subject = new Subject<WebsocketEvent>();

  private server!: Server;
  setServer(server: Server) {
    this.server = server;
  }

  constructor() {}

  addEvent(usersIds: number[], eventName: string, eventData: unknown): void {
    this.subject.next({ usersIds, name: eventName, data: eventData });
  }

  getEventSubject$(): Observable<WebsocketEvent> {
    return this.subject.asObservable();
  }

  filterConnectedUsers(usersIds: number[]) {
    return usersIds.filter((uId) => this.isUserConnected(uId));
  }

  isUserConnected(userId: number) {
    const socketsCount =
      this.server.sockets.adapter.rooms.get(userId.toString())?.size ?? 0;
    return socketsCount > 0;
  }
}
