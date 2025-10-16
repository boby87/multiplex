import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BaseDynamicForm } from '../input_type/dynamic.form';
import { NgSelectModule } from '@ng-select/ng-select';
import { DynamicFieldComponent } from '../dynamic-field/dynamic-field.component';

@Component({
  selector: 'app-dynamic-form',
  imports: [ReactiveFormsModule, NgSelectModule, DynamicFieldComponent],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss',
})
export class DynamicFormComponent {
  fields = input.required<BaseDynamicForm<any>[]>();
  form = input.required<FormGroup>();
}
