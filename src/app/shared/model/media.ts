export interface Media {
  mediaId: string;
  mediaTypeId: string;
  mediaTypeCode: string;
  url: string;
}
export interface MediaTypeInfo {
  id: string;
  code: string;
  name: string;
  description: string;
  allowedMimeTypes: string[];
  maxFileSizeBytes: number;
  required: boolean;
  multipleAllowed: boolean;
  maxFiles: number | null;
  category: string;
  status: string;
  displayOrder: number | null;
}

export interface MediaConfig {
  id?: string;
  entityType?: string;
  subEntityType?: string | null;
  process?: string;
  mediaTypeInfos?: MediaTypeInfo[];
  createdAt?: string;   // ISO Date string
  updatedAt?: string;   // ISO Date string
  createdBy?: string;
  updatedBy?: string;
}
