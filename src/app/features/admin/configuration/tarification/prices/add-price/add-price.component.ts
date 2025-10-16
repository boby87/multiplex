import { Component, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { toFormGroupArray } from '../../../../../../shared/components/dynamic-form-arry/dynamic-form-arry.component';
import { PRICE_LIST_FIELDS } from '../../../../../../shared/components/templates/price';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PriceService } from '../../services/price.service';
import { Price, ProductVariant } from '../../../../../../shared/model/productCategory';
import { DynamicFormGroupComponent } from '../../../../../../shared/components/dynamic-form-group/dynamic-form-group.component';
import { TranslatePipe } from '@ngx-translate/core';
import { FormGroupBox } from '../../../../../../shared/components/input_type/form.group.box';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  PriceListStrategyFactory,
  ProceedQuotationStrategy,
  ProductQuotationStrategy,
} from './strategy/PriceListTypeStrategy';
import { BaseDynamicForm } from '../../../../../../shared/components/input_type/dynamic.form';
import {
  CompanyStrategy,
  CurrencyStrategy,
  FieldOptionStrategy,
  PriceTypeStrategy,
  ProductVariantStrategy,
} from './strategy/FieldOptionStrategy';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {MultiflexStaticService} from "../../../../../../core/service/stactic.core.service";
import {CompanyService} from "../../../struture-societe/services/company.service";

@Component({
  selector: 'app-add-price',
  imports: [DynamicFormGroupComponent, ReactiveFormsModule, TranslatePipe],
  templateUrl: './add-price.component.html',
  styleUrl: './add-price.component.scss',
})
export class AddPriceComponent implements OnInit {
  form = signal(new FormGroup({}));
  fields = signal<BaseDynamicForm[]>(PRICE_LIST_FIELDS);
  title = signal('prices.titleNew');

  priceToEdit = input<Price | null>(null);
  productVariant = input.required<ProductVariant>();

  public modalRef = inject(BsModalRef);
  private staticService = inject(MultiflexStaticService);
  private companyService = inject(CompanyService);

  private destroyRef = inject(DestroyRef);
  private formBuilder = inject(FormBuilder);
  private priceService = inject(PriceService);

  ngOnInit(): void {
    this.initializeForm();
    this.setupTypeChangeListener();
  }

  // CORRECTION 2: Logique d'initialisation centralisée et corrigée
  private initializeForm(): void {
    const price = this.priceToEdit();

    // 1. Initialisation "par défaut"
    this.form.set(toFormGroupArray(this.formBuilder, this.fields()));

    if (price && price.productVariant?.id) {
      this.title.set('prices.titleEdit');

      const typeSuperCategory = this.productVariant()?.superCategory;
      const strategy = PriceListStrategyFactory.create(typeSuperCategory!);

      if (strategy) {
        const dynamicFields: BaseDynamicForm[] = strategy.buildFields();

        // --- Étape A : mise à jour du modèle des champs ---
        const currentFields = [...this.fields()];
        const fieldToUpdate = currentFields.find(f => f.key === 'priceListAttribute');

        if (fieldToUpdate && fieldToUpdate.controlType === 'formGroup') {
          // On ajoute les champs dynamiques à la structure existante
          (fieldToUpdate as FormGroupBox).groupFields = [
            ...(fieldToUpdate as FormGroupBox).groupFields,
            ...dynamicFields,
          ];

          // --- Étape B : mise à jour du FormGroup ---
          const groupControl = this.form().get('priceListAttribute') as unknown as FormGroup;
          if (groupControl) {
            dynamicFields.forEach(df => {
              groupControl.addControl(
                  df.key,
                  toFormGroupArray(this.formBuilder, [df]).get(df.key)!
              );
            });
          }

          // --- Étape C : notifier le signal (copie pour déclencher le refresh UI) ---
          this.fields.set(currentFields);
        }
      }
    }

    // 2. Charger les options
    this.loadOptions(this.fields());

    // 3. Patcher les valeurs existantes
    if (price) {
      this.form().patchValue(price);
    }
  }


  private loadOptions(fields: BaseDynamicForm[]): void {
    const strategies: FieldOptionStrategy[] = [
      new PriceTypeStrategy(this.staticService),
      new CurrencyStrategy(this.staticService),
      new CompanyStrategy(this.companyService),
      new ProductVariantStrategy(this.productVariant()),
    ];
    fields.forEach(field => {
      const strategy = strategies.find(s => s.supports(field));
      if (strategy) {
        strategy.fillOptions(field);
      }

      if (field.controlType === 'formGroup' && field.groupFields) {
        this.loadOptions(field.groupFields); // Appel récursif
      }
    });
  }

  private setupTypeChangeListener() {
    const control = this.form().get('priceListAttribute.type');

    if (!control) return; // Sécurité

    control.valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(type => {
          if (!type) return;

          const strategy =
              type === 'PROCEDE_QUOTATION'
                  ? new ProceedQuotationStrategy()
                  : new ProductQuotationStrategy();

          if (!strategy) return;

          const updatedFields = strategy.buildFields();

          // --- Met à jour les champs dynamiques côté UI ---
          this.fields.update(oldFields =>
              oldFields.map(f =>
                  f.key === 'priceListAttribute' && f.controlType === 'formGroup'
                      ? new FormGroupBox({ ...f, groupFields: updatedFields })
                      : f
              )
          );

          // --- Met à jour le formGroup du Formulaire ---
          const groupControl = this.form().get('priceListAttribute');
          if (groupControl instanceof FormGroup) {
            const newFormGroup = toFormGroupArray(this.formBuilder, updatedFields);

            // Important : on supprime les anciens contrôles et on injecte les nouveaux
            Object.keys(groupControl.controls).forEach(key => groupControl.removeControl(key));
            Object.entries(newFormGroup.controls).forEach(([key, ctrl]) =>
                groupControl.addControl(key, ctrl)
            );
          }
        });
  }


  onSubmit(): void {
    if (this.form().invalid) {
      this.form().markAllAsTouched();
      return;
    }

    const payload = this.form().getRawValue() as Price;
    const priceData = this.priceToEdit();

    const request = priceData?.priceListId
      ? this.priceService.update(priceData.priceListId, payload)
      : this.priceService.create(payload);

    request.subscribe(() => {
      this.cancelAction();
    });
  }

  cancelAction(): void {
    this.modalRef.hide();
  }
}
