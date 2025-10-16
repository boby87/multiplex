import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FirebaseNotificationService } from './core/service/firebase.notification.service';
import { LoaderComponent } from './shared/ui/loader/loader.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private firebaseNotificationService = inject(FirebaseNotificationService);

  ngOnInit(): void {
    this.firebaseNotificationService.listen();
  }
}
