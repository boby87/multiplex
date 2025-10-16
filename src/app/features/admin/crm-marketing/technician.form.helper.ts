import {MultiSelectValue} from '../../../shared/components/multi-select/multi-select.component';
import {Skill} from '../../../shared/model/skill';
import {CameroonLocation} from '../../../shared/utility/cameroon.location';
import {FileBox} from '../../../shared/components/input_type/file.box';
import {Validators} from '@angular/forms';
import {BaseDynamicForm} from '../../../shared/components/input_type/dynamic.form';


export class TechnicianFormHelper {
  static buildSkills(skillsMulti: MultiSelectValue): Skill[] {
    return skillsMulti?.selected?.map(value => ({
      name: value,
      main: value === skillsMulti.primary,
      status: 'ACTIVE',
    })) ?? [];
  }

  static addRegionOptions(userAddressFields: BaseDynamicForm[]) {
    userAddressFields.forEach(userAddress => {
      if (userAddress.key === 'addresses') {
        userAddress.childrenFields.forEach(child => {
          if (child.key === 'region') {
            child.options = CameroonLocation.getAllRegions().map(region => ({
              key: region.name,
              value: region.name,
            }));
          }
        });
      }
    });
  }

  static buildUploadFields(mediaConfig: any): FileBox[] {
    return mediaConfig[0].mediaTypeInfos?.map(
      (media: any) =>
        new FileBox({
          key: media.code,
          label: media.name,
          required: true,
          classColumn: 'col-md-6',
          maxlength: media.maxFileSizeBytes,
          accept: media.allowedMimeTypes?.join(', ') ?? '',
          order: 1,
          type: 'file',
          validators: [Validators.required],
        })
    ) ?? [];
  }
}
