import { Textbox } from '../input_type/textbox';
import { Select } from '../input_type/select';
import { BaseDynamicForm } from '../input_type/dynamic.form';
import { FormGroupBox } from '../input_type/form.group.box';

export const BASE_ARTICLES_FIELDS: BaseDynamicForm[] = [
  new Textbox({
    key: 'code',
    label: 'BASE_ARTICLES.CODE', // clé i18n
    type: 'text',
    required: true,
  }),
  new Textbox({
    key: 'designation',
    label: 'BASE_ARTICLES.DESIGNATION',
    type: 'text',
    required: true,
  }),
  new Select({
    key: 'superCategory',
    label: 'BASE_ARTICLES.SUPER_CATEGORY',
    options: [],
    required: true,
  }),

  new FormGroupBox({
    key: 'productCategory',
    classColumn: 'col-md-12',
    groupFields: [
      new Select({
        key: 'code',
        label: 'BASE_ARTICLES.PRODUCT_CATEGORY_CODE',
        value: '',
        classColumn: 'col-md-12',
        required: false,
        placeholder: 'BASE_ARTICLES.PRODUCT_CATEGORY_PLACEHOLDER',
      }),
    ],
  }),

  new Select({
    key: 'productType',
    label: 'BASE_ARTICLES.PRODUCT_TYPE',
    options: [
      { key: 'MULTIFLEX', value: 'BASE_ARTICLES.PRODUCT_TYPE_MULTIFLEX' },
      { key: 'AUTRE', value: 'BASE_ARTICLES.PRODUCT_TYPE_OTHER' },
    ],
    required: true,
  }),
];
