import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Address, Contact, UserProfileService } from '../../services/users.profile.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PageTitleComponent } from '../../../../../../shared/ui/page-title/page-title.component';
import { TranslatePipe } from '@ngx-translate/core';
import { TabItem } from '../../../../../../shared/model/user';
import {
  DynamicFormArryComponent,
  toFormGroupArray,
} from '../../../../../../shared/components/dynamic-form-arry/dynamic-form-arry.component';
import { BaseDynamicForm } from '../../../../../../shared/components/input_type/dynamic.form';
import {
  USER_ADDRESS_FIELDS,
  USER_CONTACT_FIELDS,
  USER_EMAIL_FIELDS,
  USER_PASSWORD_FIELDS,
} from '../../../../../../shared/components/templates/utilisateur';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { combineLatest } from 'rxjs';
import { Location } from '@angular/common';
import { getStrategy } from './strategy/i.user.update.strategy';
import { AuthService } from '../../../../../../core/service/auth.service';

@Component({
  selector: 'app-user-details',
  imports: [
    FormsModule,
    PageTitleComponent,
    TranslatePipe,
    ReactiveFormsModule,
    DynamicFormArryComponent,
  ],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss',
})
export class UserDetailsComponent implements OnInit {
  // Signals
  form = signal<FormGroup>(new FormGroup({}));
  fields = signal<BaseDynamicForm[]>([]);
  title = signal('user.titleNew');
  username = signal<string>('');
  updateType = signal<string>('');
  private destroyRef = inject(DestroyRef);
  breadCrumbItems: TabItem[] = [
    { label: 'user.breadcrumb.configuration' },
    { label: 'user.breadcrumb.structure' },
    { label: 'user.breadcrumb.users', link: '/structure_societe/departements' },
    { label: 'user.breadcrumb.update', active: true },
  ];

  // Injections
  private activeRoute = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  private userProfileService = inject(UserProfileService);
  private authService = inject(AuthService);
  private location = inject(Location);

  ngOnInit(): void {
    this.form.set(toFormGroupArray(this.formBuilder, this.fields()));

    combineLatest([
      this.activeRoute.params,
      this.activeRoute.queryParamMap
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([params, queryParams]) => {
        this.username.set(params['username'] ?? '');
        this.updateType.set(params['updateType'] ?? '');

        const strategy = getStrategy(this.updateType());
        if (!strategy) return;

        this.title.set(strategy.titleKey);
        this.rebuildForm(strategy.fields);

        if (strategy.patchData) {
          const patch = strategy.patchData(queryParams);
          if (patch) this.form().patchValue(patch);
        }
      });
  }

  private rebuildForm(fields: BaseDynamicForm[]): void {
    this.fields.set(fields);
    this.form.set(toFormGroupArray(this.formBuilder, fields));
  }

  onSubmit(): void {
    if (this.form().invalid) {
      this.form().markAllAsTouched();
      return;
    }
    const payload = this.form().get(this.updateType())?.value ?? this.form().value
    this.userProfileService
      .changeUserInfos(this.username(), payload, this.updateType(), this.authService.userContext.userId!)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.cancelAction(),
        error: err => {
          console.error('Erreur lors de la mise à jour du mot de passe', err);
          // tu pourrais déclencher un toast / message d’erreur ici
        },
      });
  }

  cancelAction(): void {
    this.location.back();
  }

}
