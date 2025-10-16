import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPhysicalComponent } from './add-physical.component';

describe('AddPhysicalComponent', () => {
  let component: AddPhysicalComponent;
  let fixture: ComponentFixture<AddPhysicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPhysicalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPhysicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
