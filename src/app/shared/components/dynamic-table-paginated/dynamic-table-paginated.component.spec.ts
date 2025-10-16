import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicTablePaginatedComponent } from './dynamic-table-paginated.component';

describe('DynamicTablePaginatedComponent', () => {
  let component: DynamicTablePaginatedComponent;
  let fixture: ComponentFixture<DynamicTablePaginatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicTablePaginatedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DynamicTablePaginatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
