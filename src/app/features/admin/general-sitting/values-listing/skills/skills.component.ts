import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TabItem } from '../../../../../shared/model/user';
import {
  DynamicTableComponent,
  TableActionButton,
} from '../../../../../shared/components/dynamic-table/dynamic-table.component';
import { filterDataByTerm } from '../../../../../shared/utility/fonction';
import { Skill } from '../../../../../shared/model/skill';
import { SkillService } from '../services/skill.service';
import { PageTitleComponent } from '../../../../../shared/ui/page-title/page-title.component';
import { SearchBoxComponent } from '../../../../../shared/components/search-box/search-box.component';
import { AddButtonComponent } from '../../../../../shared/components/add-button/add-button.component';

@Component({
  selector: 'app-skills',
  imports: [PageTitleComponent, SearchBoxComponent, AddButtonComponent, DynamicTableComponent],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
})
export class SkillsComponent implements OnInit {
  private activeRoute = inject(ActivatedRoute);
  private skills = signal<Skill[]>([]);
  private router = inject(Router);
  searchTerm = signal<string>('');

  title = signal('SKILLS.title'); // clé i18n
  columns = signal<(keyof Skill)[]>(['name', 'status']);
  labelButton = signal<string>('SKILLS.addButton');
  breadCrumbItems: TabItem[] = [
    { label: 'SKILLS.BREADCRUMB.GENERAL_SETTINGS' },
    { label: 'SKILLS.BREADCRUMB.VALUE_LISTS' },
    { label: 'SKILLS.BREADCRUMB.TECHNICAL_SKILLS', link: '/general_settings/skills', active: true  }
  ];
  actions: TableActionButton[] = [
    {
      label: 'Edit',
      icon: ' fas fa-pencil-alt text-success',
      doAction: (item: Skill) => this.edit(item),
    },
  ];

  ngOnInit(): void {
    this.skills.set(this.activeRoute.snapshot.data['skills']['skills']['content']);
  }

  filteredData = computed(() => filterDataByTerm(this.skills(), this.searchTerm(), this.columns()));

  edit(skill: Skill) {
    const serialized = encodeURIComponent(JSON.stringify(skill));
    void this.router.navigate(['/general_settings/add-skill'], {
      queryParams: { data: serialized },
    });
  }
}
