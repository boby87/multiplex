import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { skillResolver } from './values-listing/skills/skill.resolver';

const routes: Routes = [
  {
    path: 'skills',
    loadComponent: () =>
      import('./values-listing/skills/skills.component').then(m => m.SkillsComponent),
    resolve: {
      skills: skillResolver,
    },
  },
  {
    path: 'add-skill',
    loadComponent: () =>
      import('./values-listing/skills/add-skill/add-skill.component').then(
        m => m.AddSkillComponent
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeneralSittingRoutingModule {}
