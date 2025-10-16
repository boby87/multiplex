import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TabItem } from '../../../../../../shared/model/user';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicFormComponent } from '../../../../../../shared/components/dynamic-form/dynamic-form.component';
import { isEmpty } from 'lodash';
import { SKILL_FIELDS } from '../../../../../../shared/components/templates/skill';
import { Skill } from '../../../../../../shared/model/skill';
import { SkillService } from '../../services/skill.service';
import { getValueOrEmpty } from '../../../../../../shared/utility/fonction';
import { PageTitleComponent } from '../../../../../../shared/ui/page-title/page-title.component';
import { toFormGroupArray } from '../../../../../../shared/components/dynamic-form-arry/dynamic-form-arry.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-add-skill',
  imports: [PageTitleComponent, DynamicFormComponent, ReactiveFormsModule, TranslatePipe],
  templateUrl: './add-skill.component.html',
  styleUrl: './add-skill.component.scss',
})
export class AddSkillComponent implements OnInit {
  form = signal(new FormGroup({}));
  fields = signal(SKILL_FIELDS);
  private activeRoute = inject(ActivatedRoute);
  title = signal('SKILLS.newTitle');
  skill = signal<Skill>({ skillId: '', name: '', main: false, status: '' });
  private skillService = inject(SkillService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  breadCrumbItems: TabItem[] = [
    { label: 'SKILLS.BREADCRUMB.GENERAL_SETTINGS' },
    { label: 'SKILLS.BREADCRUMB.VALUE_LISTS' },
    { label: 'SKILLS.BREADCRUMB.TECHNICAL_SKILLS', link: '/general_settings/skills' },
    { label: 'SKILLS.BREADCRUMB.NEW', active: true },
  ];

// Signals



  ngOnInit(): void {
    this.form.set(toFormGroupArray(this.fb, this.fields()));

    this.activeRoute.queryParamMap.subscribe(params => {
      const data = params.get('data');
      if (data) {
        this.skill.set(JSON.parse(decodeURIComponent(data)));
        this.form().patchValue(this.skill());
      }
    });
  }

  onSubmit(): void {
    const request$ = isEmpty(this.skill().skillId)
      ? this.skillService.create(this.form().value as Skill)
      : this.skillService.update(getValueOrEmpty(this.skill().skillId), this.form().value as Skill);
    request$.subscribe({
      next: () => {
        this.form().reset();
        this.cancelAction();
      },
    });
  }

  cancelAction() {
    void this.router.navigateByUrl('/general_settings/skills');
  }
}
