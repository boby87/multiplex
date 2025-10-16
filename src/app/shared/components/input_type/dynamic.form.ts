import { ValidatorFn } from '@angular/forms';

export abstract class BaseDynamicForm<T = string | boolean | string[] | number> {
  value: string | boolean | undefined | string[] | number;
  key: string;
  accept: string;
  label: string;
  required: boolean;
  order: number;
  multiple: boolean;
  controlType: string;
  type: string;
  options: { key: string; value: string }[];
  validators: ValidatorFn[];
  readonly: boolean;
  disabled: boolean;
  className: string;
  classColumn: string;
  placeholder: string;
  icon: string;
  maxlength: number;
  childrenFields: BaseDynamicForm<T>[];
  groupFields: BaseDynamicForm<T>[];
  initialAddCount?: number;
  withPrincipalValue:boolean;

  constructor(
    options: {
      value?: string | boolean | string[] | number;
      key?: string;
      accept?: string;
      label?: string;
      required?: boolean;
      order?: number;
      multiple?: boolean;
      withPrincipalValue?: boolean;
      controlType?: string;
      type?: string;
      options?: { key: string; value: string }[];
      validators?: ValidatorFn[] | null;
      readonly?: boolean;
      disabled?: boolean;
      className?: string;
      classColumn?: string;
      placeholder?: string;
      icon?: string;
      maxlength?: number;
      childrenFields?: BaseDynamicForm<T>[];
      groupFields?: BaseDynamicForm<T>[];
      initialAddCount?: number;
    } = {}
  ) {
    this.value = options.value;
    this.key = options.key || '';
    this.accept = options.accept || '.pdf, .jpg, .jpeg, .png';
    this.label = options.label || '';
    this.required = !!options.required;
    this.order = options.order === undefined ? 1 : options.order;
    this.multiple = !!options.multiple;
    this.withPrincipalValue = !!options.withPrincipalValue;
    this.controlType = options.controlType || '';
    this.type = options.type || '';
    this.options = options.options || [];
    this.validators = options.validators || [];
    this.readonly = !!options.readonly;
    this.disabled = !!options.disabled;
    this.className = options.className || 'input-field';
    this.classColumn = options.classColumn || 'col-md-12';
    this.placeholder = options.placeholder || '';
    this.icon = options.icon || '';
    this.maxlength = options.maxlength || 10000;

    this.childrenFields = options.childrenFields || [];
    this.groupFields = options.groupFields || [];
    this.initialAddCount = options.initialAddCount ?? 0;
  }

  toggleType(): void {
    throw new Error('Method not implemented.');
  }
}
