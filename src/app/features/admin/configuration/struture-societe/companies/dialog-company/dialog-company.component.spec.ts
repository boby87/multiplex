import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCompanyComponent } from './dialog-company.component';

describe('DialogCompanyComponent', () => {
  let component: DialogCompanyComponent;
  let fixture: ComponentFixture<DialogCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogCompanyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
