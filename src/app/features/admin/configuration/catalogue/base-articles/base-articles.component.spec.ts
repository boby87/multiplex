import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseArticlesComponent } from './base-articles.component';

describe('BaseArticlesComponent', () => {
  let component: BaseArticlesComponent;
  let fixture: ComponentFixture<BaseArticlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseArticlesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BaseArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
