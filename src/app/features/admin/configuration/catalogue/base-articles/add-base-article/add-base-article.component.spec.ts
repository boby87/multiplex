import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBaseArticleComponent } from './add-base-article.component';

describe('AddBaseArticleComponent', () => {
  let component: AddBaseArticleComponent;
  let fixture: ComponentFixture<AddBaseArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBaseArticleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddBaseArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
