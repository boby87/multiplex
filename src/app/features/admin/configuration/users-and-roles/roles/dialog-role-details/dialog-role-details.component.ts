import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { Role } from '../../../../../../shared/model/roles';
import { MatDivider, MatList, MatListItem } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-dialog-role-details',
  imports: [
    MatList,
    MatListItem,
    MatDivider,
    MatDialogActions,
    MatIcon,
    MatButton,
    MatDialogTitle,
    MatIconButton,
  ],
  templateUrl: './dialog-role-details.component.html',
  styleUrl: './dialog-role-details.component.scss',
})
export class DialogRoleDetailsComponent {
  readonly dialogRef = inject(MatDialogRef<DialogRoleDetailsComponent>);
  data = inject<Role>(MAT_DIALOG_DATA);

  rolePermissionEntries(): { key: string; value: string[] }[] {
    return this.data?.rolePermissions
      ? Object.entries(this.data.rolePermissions).map(([key, value]) => ({ key, value }))
      : [];
  }

  getCompanies(): string[] {
    return this.data?.companies ? (this.data?.companies as string[]) : [];
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
