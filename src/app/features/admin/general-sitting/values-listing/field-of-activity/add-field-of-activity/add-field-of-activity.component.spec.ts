import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFieldOfActivityComponent } from './add-field-of-activity.component';

describe('AddFieldOfActivityComponent', () => {
  let component: AddFieldOfActivityComponent;
  let fixture: ComponentFixture<AddFieldOfActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddFieldOfActivityComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddFieldOfActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
