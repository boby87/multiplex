import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleVariantsComponent } from './article-variants.component';

describe('ArticleVariantsComponent', () => {
  let component: ArticleVariantsComponent;
  let fixture: ComponentFixture<ArticleVariantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleVariantsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ArticleVariantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
