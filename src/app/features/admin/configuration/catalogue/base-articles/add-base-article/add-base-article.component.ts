import { Component, inject, OnInit, signal } from '@angular/core';
import { PageTitleComponent } from '../../../../../../shared/ui/page-title/page-title.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TabItem } from '../../../../../../shared/model/user';
import { ProductBase } from '../../../../../../shared/model/productCategory';
import { BASE_ARTICLES_FIELDS } from '../../../../../../shared/components/templates/base.articles';
import { BaseArticleService } from '../../service/base.article.service';
import { ActivatedRoute, Router } from '@angular/router';
import { isEmpty } from 'lodash';
import { getValueOrEmpty } from '../../../../../../shared/utility/fonction';
import { MultiflexStaticService } from '../../../../../../core/service/stactic.core.service';
import { Select } from '../../../../../../shared/components/input_type/select';
import { forkJoin } from 'rxjs';
import { CategoryService } from '../../service/category.service';
import { DynamicFormGroupComponent } from '../../../../../../shared/components/dynamic-form-group/dynamic-form-group.component';
import { toFormGroupArray } from '../../../../../../shared/components/dynamic-form-arry/dynamic-form-arry.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-add-base-article',
  imports: [PageTitleComponent, ReactiveFormsModule, DynamicFormGroupComponent, TranslatePipe],
  templateUrl: './add-base-article.component.html',
  styleUrl: './add-base-article.component.scss',
})
export class AddBaseArticleComponent implements OnInit {
  breadCrumbItems: TabItem[] = [
    { label: 'baseArticles.breadcrumb.configuration' },
    { label: 'baseArticles.breadcrumb.catalogue' },
    { label: 'baseArticles.breadcrumb.baseArticles', link: '/catalogue/base-articles' },
    { label: 'baseArticles.breadcrumb.new', active: true },
  ];
  private multiflexStaticService = inject(MultiflexStaticService);
  private baseArticles = signal<ProductBase>({ code: '' });
  private categoryService = inject(CategoryService);
  title = signal('baseArticles.titleNew');
  form = signal(new FormGroup({}));
  fields = signal(BASE_ARTICLES_FIELDS);
  private formBuilder = inject(FormBuilder);
  private baseArticleService = inject(BaseArticleService);
  private activeRoute = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit(): void {
    this.form.set(toFormGroupArray(this.formBuilder, this.fields()));

    this.activeRoute.queryParamMap.subscribe(params => {
      const data = params.get('data');
      if (data) {
        this.baseArticles.set(JSON.parse(decodeURIComponent(data)));
        this.form().patchValue(this.baseArticles());
        this.form().get('code')?.disable()
        this.form().get('superCategory')?.disable()
        this.form().get('productType')?.disable()

      }
    });
    forkJoin({
      superCategories: this.multiflexStaticService.getSuperCategories(),
      productTypes: this.multiflexStaticService.getProductTypes(),
      categories: this.categoryService.filterCategories(),
    }).subscribe({
      next: ({ superCategories, productTypes, categories }) => {
        this.fields.update(currentFields => {
          return currentFields.map(field => {
            if (field.key === 'superCategory' && field.controlType === 'select') {
              (field as Select).options = superCategories.map(cat => ({
                key: cat.key,
                value: cat.value,
              }));
            } else if (field.key === 'productType' && field.controlType === 'select') {
              (field as Select).options = productTypes.map(type => ({
                key: type.key,
                value: type.key,
              }));
            } else if (field.key === 'productCategory' && field.controlType === 'formGroup') {
              field.groupFields = field.groupFields.map(nestedField => {
                if (nestedField.key === 'code' && nestedField.controlType === 'select') {
                  (nestedField as Select).options = categories.content.map(cat => ({
                    key: cat.code,
                    value: cat.name,
                  }));
                }
                return nestedField;
              });
            }
            return field;
          });
        });
      },
    });
  }

  onSubmit(): void {
    const request$ = isEmpty(this.baseArticles().productId)
      ? this.baseArticleService.create(this.form().value as ProductBase)
      : this.baseArticleService.update(
          getValueOrEmpty(this.baseArticles().productId),
          this.form().value as ProductBase
        );
    request$.subscribe({
      next: () => {
        this.form().reset();
        this.cancelAction();
      },
    });
  }

  cancelAction() {
    void this.router.navigate(['/configuration/catalogue/base-articles']);
  }
}
