// utils/partner.mapper.ts

import {Partner} from '../../../shared/model/user';
import {MultiSelectValue} from '../../../shared/components/multi-select/multi-select.component';

export class PartnerMapper {
  static toGeneralInfoForm(partner: Partner): any {
    return {
      language: partner.language,
      email: partner.email,
      firstname: partner.firstname,
      lastname: partner.lastname,
      contacts: partner.contacts,
      technicianType: partner.technicianType,
      technicianCategory: partner.technicianCategory,
      technicianGrade: partner.technicianGrade,
      address: partner.address,
      skills: {
        primary: partner.skills?.find(skill => skill.main)?.name,
        selected: partner.skills?.map(skill => skill.name),
      } as MultiSelectValue,
    };
  }
}
