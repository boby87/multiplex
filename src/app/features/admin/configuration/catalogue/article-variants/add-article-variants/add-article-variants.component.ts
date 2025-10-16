import { Component, inject, OnInit, signal } from '@angular/core';
import { PageTitleComponent } from '../../../../../../shared/ui/page-title/page-title.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TabItem } from '../../../../../../shared/model/user';
import { ActivatedRoute, Router } from '@angular/router';
import {
  extractFilesAsEntries,
  getValueOrEmpty,
  updateNestedSelectFields,
} from '../../../../../../shared/utility/fonction';
import { isEmpty } from 'lodash';
import {
  Price,
  ProductBase,
  ProductUom,
  ProductVariant,
} from '../../../../../../shared/model/productCategory';
import { ProductVariantsService } from '../../service/product-variants.service';
import {
  PACKAGING_VARIANT,
  PRODUCT_VARIANT_FIELDS,
} from '../../../../../../shared/components/templates/article.variants';
import {
  DynamicFormArryComponent,
  toFormGroupArray,
} from '../../../../../../shared/components/dynamic-form-arry/dynamic-form-arry.component';
import { UniteOfMeasureService } from '../../unite-of-measure/services/unite.of.measure.service';
import { forkJoin, from, mergeMap } from 'rxjs';
import { MultiflexStaticService } from '../../../../../../core/service/stactic.core.service';
import { TranslatePipe } from '@ngx-translate/core';
import { FileBox } from '../../../../../../shared/components/input_type/file.box';
import { MediaConfig } from '../../../../../../shared/model/media';
import { TabsComponent } from '../../../../../../shared/components/tabs/tabs.component';
import { BaseDynamicForm } from '../../../../../../shared/components/input_type/dynamic.form';
import { PricesComponent } from '../../../tarification/prices/prices.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-article-variants',
  imports: [
    PageTitleComponent,
    ReactiveFormsModule,
    DynamicFormArryComponent,
    TranslatePipe,
    TabsComponent,
    PricesComponent,
  ],
  templateUrl: './add-article-variants.component.html',
  styleUrl: './add-article-variants.component.scss',
})
export class AddArticleVariantsComponent implements OnInit {
  form = signal(new FormGroup({}));
  formMedia = signal(new FormGroup({}));
  formPackaging = signal(new FormGroup({}));
  fieldsMedia = signal<BaseDynamicForm[]>([]);
  fields = signal(PRODUCT_VARIANT_FIELDS);
  fieldsPackaging = signal(PACKAGING_VARIANT);
  title = signal('PRODUCT_VARIANT.titleNew');
  tabs = [
    {
      id: 'generalInfo',
      form: () => this.form(),
      fields: () => this.fields(),
      label: 'PRODUCT_VARIANT.tabs.generalInfo',
    },
    {
      id: 'packaging',
      form: () => this.formPackaging(),
      fields: () => this.fieldsPackaging(),
      label: 'PRODUCT_VARIANT.tabs.packaging',
    },
    {
      id: 'pricing',
      form: () => this.formPackaging(),
      fields: () => this.fieldsPackaging(),
      label: 'PRODUCT_VARIANT.tabs.pricing',
    },
    {
      id: 'medias',
      form: () => this.formMedia(),
      fields: () => this.fieldsMedia(),
      label: 'PRODUCT_VARIANT.tabs.medias',
    },
  ];
  activeTab = signal('generalInfo');

  breadCrumbItems: TabItem[] = [
    { label: 'PRODUCT_VARIANT.breadcrumb.configuration' },
    { label: 'PRODUCT_VARIANT.breadcrumb.catalogue' },
    { label: 'PRODUCT_VARIANT.breadcrumb.variants', link: '/catalogue/variants-articles' },
    { label: 'PRODUCT_VARIANT.breadcrumb.new', active: true },
  ];
  private activeRoute = inject(ActivatedRoute);
  productVariant = signal<ProductVariant>({});
  pricing = signal<Price[]>([]);
  private baseProducts = signal<ProductBase[]>([]);
  private unityOfMeasures = signal<ProductUom[]>([]);
  private productTypes = signal<{ key: string; value: string }[]>([]);
  private router = inject(Router);
  private multiflexStaticService = inject(MultiflexStaticService);
  private location = inject(Location);
  private formBuilder = inject(FormBuilder);
  private articleVariantsService = inject(ProductVariantsService);
  private uniteOfMeasureService = inject(UniteOfMeasureService);

  ngOnInit(): void {
    const mediaConfig: MediaConfig =
      this.activeRoute.snapshot.data['productVariants']['mediaConfig'];
    if (!mediaConfig?.mediaTypeInfos) return;
    const mediaFields = mediaConfig.mediaTypeInfos?.map(
      media =>
        new FileBox({
          key: media.code,
          label: media.name,
          required: true,
          classColumn: 'col-md-6',
          maxlength: media.maxFileSizeBytes,
          accept: media.allowedMimeTypes?.join(', ') ?? '',
          order: 1,
          type: 'file',
        })
    );
    this.fieldsMedia.set(mediaFields);
    this.form.set(toFormGroupArray(this.formBuilder, this.fields()));
    this.formMedia.set(toFormGroupArray(this.formBuilder, this.fieldsMedia()));
    this.formPackaging.set(toFormGroupArray(this.formBuilder, this.fieldsPackaging()));
    this.baseProducts.set(this.activeRoute.snapshot.data['baseArticles']['content']);

    this.activeRoute.queryParamMap.subscribe(params => {
      const data = params.get('data');
      if (data) {
        this.productVariant.set(JSON.parse(decodeURIComponent(data)));
        this.productVariant().galleryImages?.forEach(mediaFile => {
          this.formMedia().patchValue({ [mediaFile.mediaTypeCode]: mediaFile.url });
        });
        this.formPackaging().patchValue(this.productVariant());
        this.form().patchValue(this.productVariant());
        this.form().get('code')?.disable();
        const pricingData: Price[] = this.activeRoute.snapshot.data['pricing']['content'];
        console.log(this.productVariant());
        this.pricing.set(
          pricingData.filter(value => value.productVariant?.code === this.productVariant().code)
        );
      }
    });

    this.loadDynamicSelectOptions();
  }

  private loadDynamicSelectOptions() {
    forkJoin({
      productTypes: this.multiflexStaticService.getSuperCategories(),
      unityOfMeasures: this.uniteOfMeasureService.filter(),
    }).subscribe({
      next: ({ productTypes, unityOfMeasures }) => {
        this.productTypes.set(productTypes);
        this.unityOfMeasures.set(unityOfMeasures.content);
        this.fields.update(currentFields => {
          return updateNestedSelectFields(currentFields, [
            {
              parentKey: 'uom',
              nestedKey: 'code',
              getOptions: () =>
                unityOfMeasures.content.map(uom => ({
                  key: uom.code,
                  value: uom.name,
                })),
            },
            {
              parentKey: 'baseProduct',
              nestedKey: 'id',
              getOptions: () =>
                this.baseProducts().map(product => ({
                  key: product.productId!,
                  value: product.code,
                })),
            },
          ]);
        });

        this.fieldsPackaging.update(currentFields => {
          return updateNestedSelectFields(currentFields, [
            {
              parentKey: 'productSpecs',
              nestedKey: 'yieldSurfaceUom',
              getOptions: () =>
                unityOfMeasures.content.map(uom => ({
                  key: uom.code,
                  value: uom.name,
                })),
            },
            {
              parentKey: 'productSpecs',
              nestedKey: 'type',
              getOptions: () =>
                productTypes.map(type => ({
                  key: type.key,
                  value: type.key,
                })),
            },
            {
              parentKey: 'productSpecs',
              nestedKey: 'durationUom',
              getOptions: () =>
                unityOfMeasures.content.map(uom => ({
                  key: uom.code,
                  value: uom.name,
                })),
            },
          ]);
        });
      },
    });
  }
  changeTab(id: string): void {
    if (this.productVariant().productVariantId) {
      this.activeTab.set(id);
    }
  }
  onSubmit(): void {
    if (this.activeTab() === 'generalInfo') {
      this.saveGeneralInfos();
    } else if (
      this.activeTab() === 'packaging' &&
      !isEmpty(this.productVariant().productVariantId)
    ) {
      this.updatePackaging();
    } else if (this.activeTab() === 'medias' && !isEmpty(this.productVariant().productVariantId)) {
      this.uploadMedias();
    }
  }

  private updatePackaging() {
    this.articleVariantsService
      .patchVariantSpecs(
        getValueOrEmpty(this.productVariant().productVariantId),
        this.formPackaging().get('productSpecs')?.getRawValue()
      )
      .subscribe({
        next: result => {
          this.productVariant.set(result);
          this.formPackaging().reset();
          this.activeTab.set('medias');
        },
      });
  }

  private saveGeneralInfos() {
    const request$ = isEmpty(this.productVariant().productVariantId)
      ? this.articleVariantsService.createVariant(this.form().getRawValue())
      : this.articleVariantsService.updateVariant(
          getValueOrEmpty(this.productVariant().productVariantId),
          this.form().getRawValue()
        );
    request$.subscribe({
      next: result => {
        this.productVariant.set(result);
      },
    });
  }

  private uploadMedias() {
    const rawFiles = extractFilesAsEntries(this.formMedia().getRawValue());

    from(rawFiles)
      .pipe(
        mergeMap(rawFile =>
          this.articleVariantsService.uploadMedia(
            rawFile.file,
            rawFile.key,
            getValueOrEmpty(this.productVariant().productVariantId)
          )
        )
      )
      .subscribe({
        next: () => {
          this.formMedia().reset();
          void this.router.navigate(['/configuration/catalogue/variants-articles']);
        },
      });
  }

  cancelAction() {
    void this.location.back();
  }
}
