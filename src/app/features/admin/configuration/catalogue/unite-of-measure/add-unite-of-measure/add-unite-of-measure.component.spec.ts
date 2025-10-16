import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUniteOfMeasureComponent } from './add-unite-of-measure.component';

describe('AddUniteOfMeasureComponent', () => {
  let component: AddUniteOfMeasureComponent;
  let fixture: ComponentFixture<AddUniteOfMeasureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUniteOfMeasureComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddUniteOfMeasureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
