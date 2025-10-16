import { FormBuilder, Validators } from '@angular/forms';
import { BaseDynamicForm } from '../input_type/dynamic.form';
import { toFormGroupArray } from './dynamic-form.component';
import { Textbox } from '../input_type/textbox'; // ajuste le chemin si besoin

describe('toFormGroupArray', () => {
  const formBuilder = new FormBuilder();

  const fields: BaseDynamicForm<any>[] = [
    new Textbox({
      key: 'username',
      label: 'Username',
      value: 'john',
      order: 2,
      controlType: 'textbox',
      validators: [Validators.required],
    }),
    new Textbox({
      key: 'email',
      label: 'Email',
      value: '',
      order: 1,
      controlType: 'textbox',
      validators: [Validators.required, Validators.email],
    }),
  ];

  it('should create a FormGroup with sorted controls', () => {
    const formGroup = toFormGroupArray(formBuilder, fields);

    const keys = Object.keys(formGroup.controls);
    expect(keys).toEqual(['email', 'username']); // sorted by order

    expect(formGroup.controls['email'].validator).toBeTruthy();
    expect(formGroup.controls['username'].value).toBe('john');
  });

  it('should apply validators to controls', () => {
    const formGroup = toFormGroupArray(formBuilder, fields);

    formGroup.controls['email'].setValue('');
    expect(formGroup.controls['email'].valid).toBe(false);

    formGroup.controls['email'].setValue('test@example.com');
    expect(formGroup.controls['email'].valid).toBe(true);
  });
});
