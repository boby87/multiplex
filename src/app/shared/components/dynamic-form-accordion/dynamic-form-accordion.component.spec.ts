import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFormAccordionComponent } from './dynamic-form-accordion.component';

describe('DynamicFormAccordionComponent', () => {
  let component: DynamicFormAccordionComponent;
  let fixture: ComponentFixture<DynamicFormAccordionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicFormAccordionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicFormAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
