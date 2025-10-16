import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRoleDetailsComponent } from './dialog-role-details.component';

describe('DialogRoleDetailsComponent', () => {
  let component: DialogRoleDetailsComponent;
  let fixture: ComponentFixture<DialogRoleDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogRoleDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogRoleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
