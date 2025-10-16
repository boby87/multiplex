import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFormArryComponent } from './dynamic-form-arry.component';

describe('DynamicFormArryComponent', () => {
  let component: DynamicFormArryComponent;
  let fixture: ComponentFixture<DynamicFormArryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicFormArryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicFormArryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
