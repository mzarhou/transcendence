import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { WebsocketEvent } from './weboscket-event.interface';
import { WebsocketClientsStorage } from './websocket-clients.storage';

@Injectable()
export class WebsocketService {
  private subject = new Subject<WebsocketEvent>();

  constructor(private readonly storage: WebsocketClientsStorage) {}

  addEvent(usersIds: number[], eventName: string, eventData: unknown): void {
    this.subject.next({ usersIds, name: eventName, data: eventData });
  }

  getEventSubject$(): Observable<WebsocketEvent> {
    return this.subject.asObservable();
  }

  filterConnectedUsers(usersIds: number[]) {
    return usersIds.filter((uId) => this.storage.isConnected(uId));
  }
}
