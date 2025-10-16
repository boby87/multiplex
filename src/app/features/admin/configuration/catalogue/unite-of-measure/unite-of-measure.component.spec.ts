import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniteOfMeasureComponent } from './unite-of-measure.component';

describe('UniteOfMeasureComponent', () => {
  let component: UniteOfMeasureComponent;
  let fixture: ComponentFixture<UniteOfMeasureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UniteOfMeasureComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UniteOfMeasureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
