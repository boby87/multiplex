import {
  Component,
  EventEmitter,
  inject,
  Inject,
  OnInit,
  Output,
  WritableSignal,
} from '@angular/core';
import {
  BsDropdownDirective,
  BsDropdownMenuDirective,
  BsDropdownToggleDirective,
} from 'ngx-bootstrap/dropdown';
import { TranslatePipe } from '@ngx-translate/core';
import { SimplebarAngularModule } from 'simplebar-angular';
import { DOCUMENT, NgClass, NgOptimizedImage } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { LanguageService } from '../../core/service/language.service';
import { CookieService } from 'ngx-cookie-service';
import { FirebaseNotificationService } from '../../core/service/firebase.notification.service';
import { MessagePayload } from 'firebase/messaging';
import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'app-topbar',
  imports: [
    BsDropdownDirective,
    BsDropdownToggleDirective,
    TranslatePipe,
    SimplebarAngularModule,
    NgClass,
    RouterLink,
    BsDropdownMenuDirective,
    NgOptimizedImage,
  ],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
})
export class TopbarComponent implements OnInit {
  element!: any;
  cookieValue!: string;
  flagvalue?: string;
  countryName!: string;
  valueset?: string;
  layout!: string;
  private firebaseNotificationService = inject(FirebaseNotificationService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private languageService = inject(LanguageService);
  private _cookiesService = inject(CookieService);
  userContext = this.authService.userContext;
  notifications: WritableSignal<MessagePayload[]> = this.firebaseNotificationService.notification$;
  @Inject(DOCUMENT) private document: any;

  listLang: any = [
    { text: 'English', flag: 'EN', lang: 'en' },
    { text: 'Français', flag: 'FR', lang: 'fr' },
  ];

  openMobileMenu!: boolean;

  @Output() settingsButtonClicked = new EventEmitter();
  @Output() mobileMenuButtonClicked = new EventEmitter();

  ngOnInit() {
    this.openMobileMenu = false;
    this.element = document.documentElement;

    this.cookieValue = this._cookiesService.get('lang');
    const val = this.listLang.filter((x: any) => x.lang === this.cookieValue);
    this.countryName = val.map((element: any) => element.text);
    if (val.length === 0) {
      if (this.flagvalue === undefined) {
        this.valueset = 'FR';
      }
    } else {
      this.flagvalue = val.map((element: any) => element.flag);
    }
  }

  setLanguage(text: string, lang: string, flag: string) {
    console.log(text, lang, flag);
    this.countryName = text;
    this.flagvalue = flag;
    this.cookieValue = lang;
    this.languageService.setLanguage(lang);
  }

  updateMessage(payload: MessagePayload) {
    this.firebaseNotificationService.updateNotification(payload);
  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  /**
   * Logout the user
   */
  logout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
    });
  }

  /**
   * Fullscreen method
   */
  fullscreen() {
    document.body.classList.toggle('fullscreen-enable');

    const isFullscreen = !!(
      document.fullscreenElement ||
      this.element.mozFullScreenElement ||
      this.element.webkitFullscreenElement
    );

    if (!isFullscreen) {
      const requestMethod =
        this.element.requestFullscreen ||
        this.element.mozRequestFullScreen ||
        this.element.webkitRequestFullscreen ||
        this.element.msRequestFullscreen;

      if (requestMethod) {
        requestMethod.call(this.element);
      }
    } else {
      const exitMethod =
        this.document.exitFullscreen ||
        this.document.mozCancelFullScreen ||
        this.document.webkitExitFullscreen ||
        this.document.msExitFullscreen;

      if (exitMethod) {
        exitMethod.call(this.document);
      }
    }
  }
}
