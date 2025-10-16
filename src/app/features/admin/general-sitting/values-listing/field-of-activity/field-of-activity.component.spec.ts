import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldOfActivityComponent } from './field-of-activity.component';

describe('FieldOfActivityComponent', () => {
  let component: FieldOfActivityComponent;
  let fixture: ComponentFixture<FieldOfActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldOfActivityComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FieldOfActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
