import { Component, input } from '@angular/core';
import { BaseDynamicForm } from '../input_type/dynamic.form';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { MultiSelectComponent } from '../multi-select/multi-select.component';
import { ValidatorErrorMessagePipe } from '../../pipe/validator.error.message.pipe';
import { DualListboxComponent } from '../dual-listbox/dual-listbox.component';
import { TranslatePipe } from '@ngx-translate/core';
import { SafePipe } from '../../pipe/safe.pipe';

@Component({
  selector: 'app-dynamic-field',
  imports: [
    ReactiveFormsModule,
    NgClass,
    MultiSelectComponent,
    ValidatorErrorMessagePipe,
    DualListboxComponent,
    TranslatePipe,
    SafePipe,
  ],
  templateUrl: './dynamic-field.component.html',
  styleUrl: './dynamic-field.component.scss',
})
export class DynamicFieldComponent {
  field = input.required<BaseDynamicForm<any>>();
  formGroup = input.required<FormGroup>();
  get controls() {
    return this.formGroup().controls || {};
  }
  previewUrl: string | null = null;
  previewType: 'image' | 'video' | 'pdf' | 'other' | null = null;

  get displayUrl(): string | null {
    const initialValue = this.formGroup().get(this.field().key)?.value;
    return this.previewUrl || (typeof initialValue === 'string' ? initialValue : null);
  }

  get displayFileName(): string {
    const formValue = this.formGroup().get(this.field().key)?.value;
    if (formValue instanceof File) {
      return formValue.name;
    }
    if (typeof formValue === 'string') {
      // On nettoie le nom pour enlever les paramètres de l'URL
      const urlWithoutParams = formValue.split('?')[0];
      return urlWithoutParams.substring(urlWithoutParams.lastIndexOf('/') + 1);
    }
    return 'Aucun fichier';
  }

  private getDisplayType(): 'image' | 'video' | 'pdf' | 'other' {
    if (this.previewType) {
      return this.previewType;
    }

    const url = this.displayUrl;
    if (!url) return 'other';

    // On enlève les query params et les fragments (#)
    const cleanUrl = url.split(/[?#]/)[0];

    if (/\.(jpg|jpeg|png|gif|svg|webp)$/i.test(cleanUrl)) return 'image';
    if (/\.(mp4|webm|ogg)$/i.test(cleanUrl)) return 'video';
    if (/\.pdf$/i.test(cleanUrl)) return 'pdf';

    return 'other';
  }

  isDisplayingImage = () => this.getDisplayType() === 'image';
  isDisplayingVideo = () => this.getDisplayType() === 'video';
  isDisplayingPdf = () => this.getDisplayType() === 'pdf';
  hasDisplayablePreview = () =>
    this.isDisplayingImage() || this.isDisplayingVideo() || this.isDisplayingPdf();

  onFileChange(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    const file = inputEl.files?.[0];

    if (this.previewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(this.previewUrl);
    }
    this.previewUrl = null;
    this.previewType = null;

    if (!file) {
      // Ne supprime pas la valeur si c’était une URL déjà existante
      return;
    }

    const MAX_FILE_SIZE = this.field().maxlength || 500000;
    if (file.size > MAX_FILE_SIZE) {
      alert(`Fichier trop volumineux ! Max: ${MAX_FILE_SIZE / 1000} Ko.`);
      inputEl.value = '';
      return;
    }

    this.formGroup().get(this.field().key)?.setValue(file);

    if (file.type.startsWith('image/')) {
      this.previewType = 'image';
      const reader = new FileReader();
      reader.onload = e => {
        this.previewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else if (file.type.startsWith('video/')) {
      this.previewType = 'video';
      this.previewUrl = URL.createObjectURL(file);
    } else if (file.type === 'application/pdf') {
      this.previewType = 'pdf';
      this.previewUrl = URL.createObjectURL(file);
    } else {
      this.previewType = 'other';
    }
  }

  // Handle input keydown events for backspace navigation
  onKeyDown(event: KeyboardEvent, fieldKey: string): void {
    if (event.key === 'Backspace') {
      const currentControl = this.formGroup().get(fieldKey);

      if (!currentControl?.value) {
        event.preventDefault();
      }
    }
  }

  // Handle paste events to distribute across inputs
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const clipboardData = event.clipboardData;
    if (!clipboardData) return;

    const pastedText = clipboardData.getData('text').trim();

    const digits = pastedText.split('');

    Object.keys(this.formGroup().controls).forEach((controlName, index) => {
      this.formGroup().get(controlName)?.setValue(digits[index]);
    });
  }
}
