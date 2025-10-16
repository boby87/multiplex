import { Company, Department, Job } from './company';

export interface PaginatedResponse<T> {
  totalItems: number;
  size: number;
  totalPages: number;
  page: number;
  sort: string | null;
  content: T[];
}

export const defaultPaginatedResponse: PaginatedResponse<any> = {
  content: [],
  sort: null,
  totalPages: 0,
  size: 0,
  totalItems: 0,
  page: 0,
};
