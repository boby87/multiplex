import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayoutsComponent } from './layouts.component';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { layoutStore } from './store/signalStore';
import { TranslateModule } from '@ngx-translate/core';
import { APP_CONFIG } from '../core/config/config.token';
import { HttpClientModule } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

const mockAppConfig = {
  apiUrl: 'http://localhost:3000',
};

// Mock layoutStore
const mockStore = {
  changeAll: jest.fn(),
};

// Mock Router
class RouterStub {
  private subject = new Subject();
  events = this.subject.asObservable();

  triggerNavigationEnd() {
    this.subject.next(new NavigationEnd(1, '/home', '/home'));
  }
}

describe('LayoutsComponent', () => {
  let component: LayoutsComponent;
  let fixture: ComponentFixture<LayoutsComponent>;
  let router: RouterStub;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), HttpClientModule, LayoutsComponent], // Add LayoutsComponent here
      providers: [
        provideAnimations(),
        { provide: Router, useClass: RouterStub },
        { provide: layoutStore, useValue: mockStore },
        { provide: APP_CONFIG, useValue: mockAppConfig },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => null,
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutsComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as any;
    document.body.className = ''; // clean body class before each test
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call store.changeAll() on init', () => {
    component.ngOnInit();
    expect(mockStore.changeAll).toHaveBeenCalled();
  });

  it('should remove "sidebar-enable" class on NavigationEnd', () => {
    document.body.classList.add('sidebar-enable');

    component.ngOnInit();
    router.triggerNavigationEnd();

    expect(document.body.classList.contains('sidebar-enable')).toBe(false);
  });

  it('should toggle "right-bar-enabled" class on settings button click', () => {
    expect(document.body.classList.contains('right-bar-enabled')).toBe(false);

    component.onSettingsButtonClicked();
    expect(document.body.classList.contains('right-bar-enabled')).toBe(true);

    component.onSettingsButtonClicked();
    expect(document.body.classList.contains('right-bar-enabled')).toBe(false);
  });

  it('should toggle condensed state and classes on mobile menu toggle', () => {
    Object.defineProperty(window, 'screen', {
      writable: true,
      value: { width: 1024 },
    });
    component.isCondensed = false;
    component.onToggleMobileMenu();

    expect(component.isCondensed).toBe(true);
    expect(document.body.classList.contains('sidebar-enable')).toBe(true);
    expect(document.body.classList.contains('vertical-collpsed')).toBe(true);

    component.onToggleMobileMenu(); // toggle back
    expect(component.isCondensed).toBe(false);
  });

  it('should not keep "vertical-collpsed" on mobile (<768px)', () => {
    Object.defineProperty(window, 'screen', {
      writable: true,
      value: { width: 500 },
    });
    component.onToggleMobileMenu();
    expect(document.body.classList.contains('vertical-collpsed')).toBe(false);
  });

  it('removes "vertical-collpsed" class when screen width is <= 768px', () => {
    Object.defineProperty(window, 'screen', {
      writable: true,
      value: { width: 768 },
    });
    component.isCondensed = true;
    document.body.classList.add('vertical-collpsed');
    component.onToggleMobileMenu();

    expect(document.body.classList.contains('vertical-collpsed')).toBe(false);
  });

  it('toggles "sidebar-enable" class on mobile menu toggle', () => {
    component.isCondensed = false;

    component.onToggleMobileMenu();
    expect(document.body.classList.contains('sidebar-enable')).toBe(true);

    component.onToggleMobileMenu();
    expect(document.body.classList.contains('sidebar-enable')).toBe(false);
  });
});
