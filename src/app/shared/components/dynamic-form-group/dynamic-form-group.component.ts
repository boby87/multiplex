import { Component, ElementRef, inject, input, QueryList, ViewChildren } from '@angular/core';
import { DynamicFieldComponent } from '../dynamic-field/dynamic-field.component';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { BaseDynamicForm } from '../input_type/dynamic.form';
import { FormArrayGroup } from '../input_type/form.array.group';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-dynamic-form-group',
  imports: [DynamicFieldComponent, FormsModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './dynamic-form-group.component.html',
  styleUrl: './dynamic-form-group.component.scss',
})
export class DynamicFormGroupComponent {
  fields = input.required<BaseDynamicForm<any>[]>();
  form = input.required<FormGroup>();
  fb = inject(FormBuilder);

  getFormGroup(groupKey: string): FormGroup {
    return this.form().get(groupKey) as FormGroup;
  }

  getFormArrayFromGroup(groupKey: string, arrayKey: string): FormArray {
    return this.getFormGroup(groupKey).get(arrayKey) as FormArray;
  }

  getFormGroupFromNestedArrayInGroup(groupKey: string, arrayKey: string, index: number): FormGroup {
    return this.getFormArrayFromGroup(groupKey, arrayKey).at(index) as FormGroup;
  }

  addFormArrayToGroupItem(groupKey: string, field: FormArrayGroup): void {
    const array = this.getFormArrayFromGroup(groupKey, field.key);
    array.push(this.createChildFormGroup(field.childrenFields));
  }

  removeFormArrayFromGroupItem(groupKey: string, arrayKey: string, index: number): void {
    const array = this.getFormArrayFromGroup(groupKey, arrayKey);
    array.removeAt(index);
  }
  createChildFormGroup(fields: BaseDynamicForm<any>[]): FormGroup {
    const group: Record<string, any> = {};

    for (const field of fields) {
      if (field.controlType === 'formGroup' && field.groupFields) {
        group[field.key] = this.createChildFormGroup(field.groupFields);
      } else if (field.controlType === 'formArray' && field.childrenFields) {
        group[field.key] = new FormArray([]);
      } else {
        group[field.key] = new FormControl(field.value ?? null);
      }
    }

    return new FormGroup(group);
  }
}
