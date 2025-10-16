import { PaginatedResponse } from '../model/paginatedResponse';
import { Select } from '../components/input_type/select';
import { BaseDynamicForm } from '../components/input_type/dynamic.form';

export function filterPaginatedByTerm<T>(
  data: PaginatedResponse<T>,
  searchTerm: string,
  columns: (keyof T)[]
): PaginatedResponse<T> {
  const term = searchTerm.toLowerCase();

  const filteredContent = data.content.filter(item =>
    columns.some(col => {
      const val = item[col];
      return val !== null && val !== undefined && val.toString().toLowerCase().includes(term);
    })
  );

  return {
    ...data,
    totalItems: filteredContent.length,
    totalPages: Math.ceil(filteredContent.length / data.size),
    page: 0,
    content: filteredContent,
  };
}

export const filterDataByTerm = <T>(data: T[], searchTerm: string, columns: (keyof T)[]): T[] =>
  data.filter(item =>
    columns.some(col => {
      const val = item[col];
      return (
        val !== null &&
        val !== undefined &&
        val.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
  );
export const extractFilesAsEntries = (obj: any): { key: string; file: File }[] => {
  const result: { key: string; file: File }[] = [];

  const recurse = (file: any, key = '') => {
    if (file instanceof File) {
      result.push({ key, file });
      return;
    }

    if (Array.isArray(file)) {
      file.forEach((item, index) => recurse(item, `${key}[${index}]`));
      return;
    }

    if (file && typeof file === 'object') {
      Object.entries(file).forEach(([key, value]) => {
        const newKey = key ? `${key}` : key;
        recurse(value, newKey);
      });
    }
  };

  recurse(obj);
  return result;
};

export const getValueOrEmpty = (value: string | null | undefined): string => value ?? '';

export const updateNestedSelectFields = (
  fields: BaseDynamicForm[],
  updates: {
    parentKey: string;
    nestedKey: string;
    getOptions: () => { key: string; value: string }[];
  }[]
): BaseDynamicForm[] => {
  return fields.map(field => {
    const relevantUpdates = updates.filter(
      u => u.parentKey === field.key && field.controlType === 'formGroup'
    );

    if (relevantUpdates.length && 'groupFields' in field) {
      field.groupFields = field.groupFields.map(nestedField => {
        const update = relevantUpdates.find(u => u.nestedKey === nestedField.key);

        if (update && nestedField.controlType === 'select') {
          (nestedField as Select).options = update.getOptions();
        }

        return nestedField;
      });
    }
    return field;
  });
};
