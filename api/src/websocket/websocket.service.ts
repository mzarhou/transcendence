import { Injectable } from '@nestjs/common';
import { Observable, Subject } from 'rxjs';
import { WebsocketEvent } from './weboscket-event.interface';

@Injectable()
export class WebsocketService {
  private subject = new Subject<WebsocketEvent>();

  constructor() {}

  addEvent(usersIds: number[], eventName: string, eventData: unknown): void {
    this.subject.next({ usersIds, name: eventName, data: eventData });
  }

  getEventSubject$(): Observable<WebsocketEvent> {
    return this.subject.asObservable();
  }
}
