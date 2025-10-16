import { inject, Injectable, signal } from '@angular/core';
import { getMessaging, getToken, MessagePayload, onMessage, isSupported } from 'firebase/messaging';
import { from, Observable } from 'rxjs';
import { AppConfig } from '../config/app.config';
import { APP_CONFIG } from '../config/config.token';

@Injectable({
  providedIn: 'root',
})
export class FirebaseNotificationService {
  private readonly messageNotification = signal<MessagePayload[]>([]);
  private config = inject<AppConfig>(APP_CONFIG);

  listen(): void {
    isSupported().then(supported => {
      if (supported) {
        onMessage(getMessaging(), (payload: MessagePayload) => {
          this.messageNotification.update(last => [...last, payload]);
        });
      } else {
        console.warn('Firebase Messaging non supporté sur ce navigateur.');
      }
    });
  }

  get notification$() {
    return this.messageNotification;
  }

  updateNotification(payload: MessagePayload) {
    this.messageNotification.update(lastMessage =>
      lastMessage.filter(mgs => mgs.messageId !== payload.messageId)
    );
  }

  get token(): Observable<string> {
    return from(getToken(getMessaging(), { vapidKey: this.config.firebase.vpaidkey }));
  }
}
