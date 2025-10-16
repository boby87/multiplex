import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAclComponent } from './add-acl.component';

describe('AddAclComponent', () => {
  let component: AddAclComponent;
  let fixture: ComponentFixture<AddAclComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAclComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAclComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
