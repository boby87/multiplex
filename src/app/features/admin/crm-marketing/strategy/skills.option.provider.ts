import { Skill } from '../../../../shared/model/skill';
import { getValueOrEmpty } from '../../../../shared/utility/fonction';

export interface FieldOptionProvider {
  getOptions(context: any): { key: string; value: string }[];
}

export class SkillsOptionProvider implements FieldOptionProvider {
  constructor(private skills: Skill[]) {}
  getOptions(): { key: string; value: string }[] {
    return this.skills.map(s => ({
      key: getValueOrEmpty(s.name),
      value: s.name,
    }));
  }
}

export class SimpleListOptionProvider implements FieldOptionProvider {
  constructor(private list: { key: string; value: string }[]) {}

  getOptions(): { key: string; value: string }[] {
    return this.list?.map(item => ({ key: item.key, value: item.key }));
  }
}
