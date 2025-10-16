import { Component, inject, OnInit, signal } from '@angular/core';
import { DynamicFormComponent } from '../../../../../../shared/components/dynamic-form/dynamic-form.component';
import { PageTitleComponent } from '../../../../../../shared/ui/page-title/page-title.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TabItem } from '../../../../../../shared/model/user';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductUom, ProductVariant } from '../../../../../../shared/model/productCategory';
import { ProductVariantsService } from '../../service/product-variants.service';
import { toFormGroupArray } from '../../../../../../shared/components/dynamic-form-arry/dynamic-form-arry.component';
import { isEmpty } from 'lodash';
import { getValueOrEmpty } from '../../../../../../shared/utility/fonction';
import { PRODUCT_UOM_FIELDS } from '../../../../../../shared/components/templates/unite.of.measure';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-add-unite-of-measure',
  imports: [DynamicFormComponent, PageTitleComponent, ReactiveFormsModule, TranslatePipe],
  templateUrl: './add-unite-of-measure.component.html',
  styleUrl: './add-unite-of-measure.component.scss',
})
export class AddUniteOfMeasureComponent implements OnInit {
  form = signal(new FormGroup({}));
  fields = signal(PRODUCT_UOM_FIELDS);
  title = signal('productUom.titleNew');
  breadCrumbItems: TabItem[] = [
    { label: 'productUom.breadcrumb.configuration' },
    { label: 'productUom.breadcrumb.Catalogue' },
    { label: 'productUom.breadcrumb.unity_of_measure', link: '/catalogue/unite-of-measure' },
    { label: 'productUom.breadcrumb.new', active: true },
  ];
  private activeRoute = inject(ActivatedRoute);
  private router = inject(Router);
  productUom = signal<ProductUom>({ code: '', name: '', description: '' });

  private formBuilder = inject(FormBuilder);
  private articleVariantsService = inject(ProductVariantsService);

  ngOnInit(): void {
    this.form.set(toFormGroupArray(this.formBuilder, this.fields()));

    this.activeRoute.queryParamMap.subscribe(params => {
      const data = params.get('data');
      if (data) {
        this.productUom.set(JSON.parse(decodeURIComponent(data)));
        this.form().patchValue(this.productUom());
        this.form().get('code')?.disable()
      }
    });
  }

  onSubmit(): void {
    const request$ = isEmpty(this.productUom().uomId)
      ? this.articleVariantsService.createUom(this.form().value as ProductVariant)
      : this.articleVariantsService.updateUom(
          getValueOrEmpty(this.productUom().uomId),
          this.form().value as ProductVariant
        );
    request$.subscribe({
      next: () => {
        this.form().reset();
        this.cancelAction();
      },
    });
  }

  cancelAction() {
    void this.router.navigate(['/configuration/catalogue/unite-of-measure']);
  }
}
