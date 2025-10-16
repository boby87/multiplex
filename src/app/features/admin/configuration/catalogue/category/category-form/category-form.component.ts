import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CATEGORY_FIELDS } from '../../../../../../shared/components/templates/category';
import { CategoryService } from '../../service/category.service';
import { Select } from '../../../../../../shared/components/input_type/select';
import { getValueOrEmpty } from '../../../../../../shared/utility/fonction';
import { isEmpty } from 'lodash';
import { ProductCategory } from '../../../../../../shared/model/productCategory';
import { toFormGroupArray } from '../../../../../../shared/components/dynamic-form-arry/dynamic-form-arry.component';
import { DynamicFormGroupComponent } from '../../../../../../shared/components/dynamic-form-group/dynamic-form-group.component';
import { TabItem } from '../../../../../../shared/model/user';
import { ActivatedRoute, Router } from '@angular/router';
import { PageTitleComponent } from '../../../../../../shared/ui/page-title/page-title.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-category-form',
  imports: [ReactiveFormsModule, DynamicFormGroupComponent, PageTitleComponent, TranslatePipe],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss',
})
export class CategoryFormComponent implements OnInit {
  form = signal(new FormGroup({}));
  fields = signal(CATEGORY_FIELDS);
  title = signal('categories.titleNew');
  breadCrumbItems: TabItem[] = [
    { label: 'categories.breadcrumb.configuration' },
    { label: 'categories.breadcrumb.catalogue' },
    { label: 'categories.breadcrumb.categories', link: '/catalogue/categories' },
    { label: 'categories.breadcrumb.new', active: true },
  ];
  private activeRoute = inject(ActivatedRoute);
  private router = inject(Router);

  private formBuilder = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private category = signal<ProductCategory>({ code: '', name: '', description: '' });

  ngOnInit(): void {
    this.form.set(toFormGroupArray(this.formBuilder, this.fields()));

    this.activeRoute.queryParamMap.subscribe(params => {
      const data = params.get('data');
      if (data) {
        this.category.set(JSON.parse(decodeURIComponent(data)));
        this.form().patchValue(this.category());
        this.form().get('code')?.disable()
      }
    });
  }

  onSubmit(): void {
    const request = !isEmpty(this.category().productCategoryId)
      ? this.categoryService.updateCategory(
          getValueOrEmpty(this.category().productCategoryId),
          this.form().value as ProductCategory
        )
      : this.categoryService.createCategory(this.form().value as ProductCategory);
    request.subscribe({
      next: () => {
        this.form().reset();
        void this.router.navigate(['/configuration/catalogue/categories']);
      },
    });
  }

  cancelAction() {
    void this.router.navigate(['/configuration/catalogue/categories']);
  }
}
