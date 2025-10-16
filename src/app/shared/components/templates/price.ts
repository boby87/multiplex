import { BaseDynamicForm } from '../input_type/dynamic.form';
import { Textbox } from '../input_type/textbox';
import { Select } from '../input_type/select';
import { FormGroupBox } from '../input_type/form.group.box';
import { Textarea } from '../input_type/textarea';
import { Validators } from '@angular/forms';

export const PRICE_LIST_FIELDS: BaseDynamicForm[] = [
  new Textbox({
    key: 'priceListName',
    label: 'Nom de la grille tarifaire',
    value: '',
    classColumn: 'col-md-6',
    required: true,
    validators: [Validators.required],
    placeholder: 'Ex : Prix Produit XXX1',
  }),

  new Select({
    key: 'currency',
    label: 'Devise',
    value: 'XAF',
    options: [],
    classColumn: 'col-md-6',
    required: true,
    disabled: true,
    validators: [Validators.required],
  }),

  new FormGroupBox({
    key: 'company',
    classColumn: 'col-md-12',
    groupFields: [
      new Select({
        key: 'id',
        label: 'Entreprise',
        value: '',
        options: [], // à remplir dynamiquement dans le component
        required: true,
        validators: [Validators.required],
        classColumn: 'col-md-12',
      }),
    ],
  }),

  new FormGroupBox({
    key: 'productVariant',
    classColumn: 'col-md-12',
    groupFields: [
      new Textbox({
        key: 'id',
        label: 'Variante Produit',
        required: true,
        disabled: true,
        classColumn: 'col-md-12',
        validators: [Validators.required],
      }),
    ],
  }),

  new FormGroupBox({
    key: 'priceListAttribute',
    classColumn: 'col-md-12',
    groupFields: [
      new Select({
        key: 'type',
        label: 'Type',
        type: 'text',
        classColumn: 'col-md-6',
        validators: [Validators.required],

      }),
    ]
  }),
];

export const PRICE_PROCEED_QUOTATION_FIELDS: BaseDynamicForm[] = [
  new Textbox({
    key: 'laborerPrice',
    label: 'Prix Ouvrier',
    type: 'number',
    value: 0,
    classColumn: 'col-md-6',
    validators: [Validators.required],
  }),
  new Textbox({
    key: 'technicianPrice',
    label: 'Prix Technicien',
    type: 'number',
    value: 0,
    classColumn: 'col-md-6',
    validators: [Validators.required],
  }),
  new Textbox({
    key: 'patronPrice',
    label: 'Prix Patron',
    type: 'number',
    value: 0,
    classColumn: 'col-md-6',
    validators: [Validators.required],
  }),
  new Textarea({
    key: 'description',
    label: 'Description',
    value: '',
    classColumn: 'col-md-6',

  }),
];
export const PRICE_PRODUCT_QUOTATION_FIELDS: BaseDynamicForm[] = [

  new Textbox({
    key: 'technicianPrice',
    label: 'Prix Technicien',
    type: 'number',
    value: 0,
    classColumn: 'col-md-6',
    validators: [Validators.required],
  }),
  new Textbox({
    key: 'patronPrice',
    label: 'Prix Patron',
    type: 'number',
    value: 0,
    classColumn: 'col-md-6',
    validators: [Validators.required],
  }),
];
