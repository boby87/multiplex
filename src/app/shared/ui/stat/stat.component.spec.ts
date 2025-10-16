import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatComponent } from './stat.component';

describe('StatComponent', () => {
  let component: StatComponent;
  let fixture: ComponentFixture<StatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StatComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'Total Users');
    fixture.componentRef.setInput('value', '1234');
    fixture.componentRef.setInput('icon', 'user-icon');
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have required inputs set correctly', () => {
    fixture.detectChanges();

    expect(component.title()).toBe('Total Users');
    expect(component.value()).toBe('1234');
    expect(component.icon()).toBe('user-icon');
  });
});
