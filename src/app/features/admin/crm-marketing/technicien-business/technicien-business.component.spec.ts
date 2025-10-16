import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicienBusinessComponent } from './technicien-business.component';

describe('TechnicienBusinessComponent', () => {
  let component: TechnicienBusinessComponent;
  let fixture: ComponentFixture<TechnicienBusinessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnicienBusinessComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TechnicienBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
