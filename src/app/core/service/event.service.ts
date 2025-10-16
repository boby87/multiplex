import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

interface Event {
  type: string;
  payload?: any;
}

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private handler = new Subject<Event>();

  /**
   * Broadcast the event
   * @param type type of event
   * @param payload payload
   */
  broadcast(type: string, payload = {}) {
    this.handler.next({ type, payload });
  }
}
