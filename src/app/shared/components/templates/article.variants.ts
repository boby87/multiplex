import { BaseDynamicForm } from '../input_type/dynamic.form';
import { Textbox } from '../input_type/textbox';
import { Textarea } from '../input_type/textarea';
import { FormGroupBox } from '../input_type/form.group.box';
import { Select } from '../input_type/select';

export const PRODUCT_VARIANT_FIELDS: BaseDynamicForm[] = [
  new FormGroupBox({
    key: 'baseProduct',
    classColumn: 'col-md-6',
    groupFields: [
      new Select({
        key: 'id',
        label: 'PRODUCT_VARIANT.BASE_PRODUCT.LABEL',
        required: true,
        classColumn: 'col-md-12',
        placeholder: 'Ex: CC-GRIS',
      }),
    ],
  }),

  new Textbox({
    key: 'code',
    label: 'PRODUCT_VARIANT.CODE.LABEL',
    required: true,
    classColumn: 'col-md-6',
    placeholder: 'Ex: CC-GRIS-114',
  }),

  new Textbox({
    key: 'designation',
    label: 'PRODUCT_VARIANT.DESIGNATION.LABEL',
    required: true,
    classColumn: 'col-md-6',
    placeholder: 'Ex: CC-GRIS-114',
  }),

  new FormGroupBox({
    key: 'uom',
    classColumn: 'col-md-6',
    groupFields: [
      new Select({
        key: 'code',
        label: 'PRODUCT_VARIANT.UOM.LABEL',
        classColumn: 'col-md-12',
      }),
    ],
  }),

  new Textbox({
    key: 'conditioning',
    label: 'PRODUCT_VARIANT.CONDITIONING.LABEL',
    required: false,
    classColumn: 'col-md-12',
    placeholder: 'Ex: Sac de 20kg',
  }),

  new Textarea({
    key: 'detailedDescription',
    label: 'PRODUCT_VARIANT.DETAILED_DESCRIPTION.LABEL',
    required: false,
    classColumn: 'col-md-12',
  }),
];

export const PACKAGING_VARIANT = [
  new FormGroupBox({
    key: 'productSpecs',
    label: 'PRODUCT_VARIANT.PRODUCT_SPECS.LABEL',
    classColumn: 'col-md-12',
    groupFields: [
      new Select({
        key: 'type',
        label: 'PRODUCT_VARIANT.TYPE.LABEL',
        classColumn: 'col-md-6',
      }),
      new Textbox({
        key: 'yieldSurface',
        label: 'PRODUCT_VARIANT.YIELD_SURFACE.LABEL',
        type: 'number',
        classColumn: 'col-md-6',
      }),
      new Select({
        key: 'yieldSurfaceUom',
        label: 'PRODUCT_VARIANT.YIELD_SURFACE_UOM.LABEL',
        classColumn: 'col-md-6',
      }),
      new Textbox({
        key: 'duration',
        label: 'PRODUCT_VARIANT.DURATION_BEFORE.LABEL',
        type: 'number',
        classColumn: 'col-md-6',
      }),
      new Select({
        key: 'durationUom',
        label: 'PRODUCT_VARIANT.DURATION_UOM.LABEL',
        classColumn: 'col-md-6',
      }),
      new Textbox({
        key: 'durationAfter',
        label: 'PRODUCT_VARIANT.DURATION_AFTER.LABEL',
        type: 'number',
        classColumn: 'col-md-6',
      }),
      new Textbox({
        key: 'layersCount',
        label: 'PRODUCT_VARIANT.LAYERS_COUNT.LABEL',
        type: 'number',
        classColumn: 'col-md-6',
      }),
      new Textbox({
        key: 'defaultSecurityQuantity',
        label: 'PRODUCT_VARIANT.DEFAULT_SECURITY_QUANTITY.LABEL',
        type: 'number',
        classColumn: 'col-md-6',
      }),
      new Textarea({
        key: 'productAdvice',
        label: 'PRODUCT_VARIANT.PRODUCT_ADVICE.LABEL',
        classColumn: 'col-md-6',
      }),
    ],
  }),
];
