import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChanelOtpComponent } from './chanel-otp.component';

describe('ChanelOtpComponent', () => {
  let component: ChanelOtpComponent;
  let fixture: ComponentFixture<ChanelOtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChanelOtpComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChanelOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
