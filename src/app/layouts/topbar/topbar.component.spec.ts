import { TopbarComponent } from './topbar.component';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { LanguageService } from '../../core/service/language.service';
import { FirebaseNotificationService } from '../../core/service/firebase.notification.service';
import { render } from '@testing-library/angular';
import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';

describe('TopbarComponent', () => {
  const renderComponent = async () => {
    const { fixture, rerender, detectChanges } = await render(TopbarComponent, {
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: DOCUMENT, useValue: document }],
    });

    const mockRouter = TestBed.inject(Router);
    const mockLanguageService = TestBed.inject(LanguageService);
    const mockTranslateService = TestBed.inject(TranslateService);
    const mockCookieService = TestBed.inject(CookieService);
    const mockFirebaseService = TestBed.inject(FirebaseNotificationService);
    const mockDocument = TestBed.inject(DOCUMENT);

    return {
      fixture,
      rerender,
      detectChanges,
      mockRouter,
      mockLanguageService,
      mockTranslateService,
      mockCookieService,
      mockFirebaseService,
      mockDocument,
    };
  };

  it('should create the component', async () => {
    // GIVEN
    const { fixture } = await renderComponent();

    // WHEN
    const component = fixture.componentInstance;

    // THEN
    expect(component).toBeTruthy();
  });

  it('should initialize language settings on ngOnInit', async () => {
    // GIVEN
    const { fixture } = await renderComponent();
    const component = fixture.componentInstance;

    // WHEN
    component.ngOnInit();

    // THEN
    expect(component.cookieValue).toBe('en');
    expect(component.flagvalue).toContain('assets/images/flags/us.jpg');
  });

  it('should call setLanguage and update values', async () => {
    // GIVEN
    const { fixture } = await renderComponent();
    const component = fixture.componentInstance;

    // WHEN
    component.setLanguage('Spanish', 'es', 'flag.png');

    // THEN
    expect(component.countryName).toBe('Spanish');
    expect(component.cookieValue).toBe('es');
    expect(component.flagvalue).toBe('flag.png');
  });

  it('should set default flag when no matching language is found', async () => {
    // GIVEN
    const { fixture, mockCookieService } = await renderComponent();
    const component = fixture.componentInstance;
    jest.spyOn(mockCookieService, 'get').mockReturnValue('unknown-lang');
    component.flagvalue = undefined;

    // WHEN
    component.ngOnInit();

    // THEN
    expect(component.valueset).toBe('assets/images/flags/us.jpg');
  });

  it('should emit mobileMenuButtonClicked on toggleMobileMenu', async () => {
    // GIVEN
    const { fixture } = await renderComponent();
    const component = fixture.componentInstance;
    const mockEvent = { preventDefault: jest.fn() };
    jest.spyOn(component.mobileMenuButtonClicked, 'emit');

    // WHEN
    component.toggleMobileMenu(mockEvent);

    // THEN
    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(component.mobileMenuButtonClicked.emit).toHaveBeenCalled();
  });

  it('should call router.navigate on logout', async () => {
    // GIVEN
    const { fixture, mockRouter } = await renderComponent();
    const component = fixture.componentInstance;
    const routerSpy = jest.spyOn(mockRouter, 'navigate');

    // WHEN
    component.logout();

    // THEN
    expect(routerSpy).toHaveBeenCalledWith(['/auth/login']);
  });

  it('should call firebaseNotificationService.updateNotification', async () => {
    // GIVEN
    const { fixture, mockFirebaseService } = await renderComponent();
    const component = fixture.componentInstance;
    const payload = { data: { title: 'Hello' } } as any;
    const spy = jest.spyOn(mockFirebaseService, 'updateNotification');

    // WHEN
    component.updateMessage(payload);

    // THEN
    expect(spy).toHaveBeenCalledWith(payload);
  });

  it('should toggle fullscreen mode', async () => {
    // GIVEN
    const { fixture, mockDocument } = await renderComponent();
    const component = fixture.componentInstance;
    const toggleSpy = jest.spyOn(mockDocument.body.classList, 'toggle');
    component.element = document.documentElement;

    // WHEN
    component.fullscreen();

    // THEN
    expect(toggleSpy).toHaveBeenCalledWith('fullscreen-enable');
  });

  it('should request fullscreen using requestFullscreen if available', async () => {
    // GIVEN
    const { fixture } = await renderComponent();
    const component = fixture.componentInstance;
    component.element = { requestFullscreen: jest.fn() } as any;
    (document as any).fullscreenElement = null;

    // WHEN
    component.fullscreen();

    // THEN
    expect(component.element.requestFullscreen).toHaveBeenCalled();
  });

  it('should request fullscreen using mozRequestFullScreen if available', async () => {
    // GIVEN
    const { fixture } = await renderComponent();
    const component = fixture.componentInstance;
    component.element = { mozRequestFullScreen: jest.fn() } as any;
    (document as any).fullscreenElement = null;

    // WHEN
    component.fullscreen();

    // THEN
    expect(component.element.mozRequestFullScreen).toHaveBeenCalled();
  });

  it('should request fullscreen using webkitRequestFullscreen if available', async () => {
    // GIVEN
    const { fixture } = await renderComponent();
    const component = fixture.componentInstance;
    component.element = { webkitRequestFullscreen: jest.fn() } as any;
    (document as any).fullscreenElement = null;

    // WHEN
    component.fullscreen();

    // THEN
    expect(component.element.webkitRequestFullscreen).toHaveBeenCalled();
  });

  it('should exit fullscreen using document.exitFullscreen if available', async () => {
    // GIVEN
    const { fixture, mockDocument } = await renderComponent();
    const component = fixture.componentInstance;
    (document as any).fullscreenElement = {};
    (mockDocument as any).exitFullscreen = jest.fn();
    (component as any).document = mockDocument;
    component.element = document.documentElement;

    // WHEN
    component.fullscreen();

    // THEN
    expect(mockDocument.exitFullscreen).toHaveBeenCalled();
  });
});
