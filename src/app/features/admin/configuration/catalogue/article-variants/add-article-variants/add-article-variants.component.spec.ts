import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddArticleVariantsComponent } from './add-article-variants.component';

describe('AddArticleVariantsComponent', () => {
  let component: AddArticleVariantsComponent;
  let fixture: ComponentFixture<AddArticleVariantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddArticleVariantsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddArticleVariantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
