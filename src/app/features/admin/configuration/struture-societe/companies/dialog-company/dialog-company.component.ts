import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { Company, LegalInfo } from '../../../../../../shared/model/company';
import { DatePipe, NgClass } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { DateArrayToStringPipe } from '../../../../../../shared/pipe/date.array.to.string.pipe';

@Component({
  selector: 'app-dialog-company',
  imports: [
    DatePipe,
    MatDialogActions,
    MatButton,
    MatDialogContent,
    NgClass,
    MatDialogTitle,
    DateArrayToStringPipe,
  ],
  templateUrl: './dialog-company.component.html',
  styleUrl: './dialog-company.component.scss',
})
export class DialogCompanyComponent {
  readonly dialogRef = inject(MatDialogRef<DialogCompanyComponent>);
  company = inject<Company>(MAT_DIALOG_DATA);

  get address() {
    return this.company.addresses ? this.company.addresses : [];
  }

  close(): void {
    this.dialogRef.close();
  }

  get legals() {
    return this.company.legals ? this.company.legals : ({} as LegalInfo);
  }
}
