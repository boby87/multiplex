import { Media } from './media';

export interface Address {
  addressType: string;
  street: string;
  complement?: string;
  postalCode: string;
  quarter?: string;
  city: string;
  region?: string;
  country: string;
  countryCode: string;
  latitude?: number | null;
  longitude?: number | null;
  defaultAddress?: boolean;
}

export interface Contact {
  phone: string;
  defaultContact: boolean;
  whatsapp: boolean;
}

export interface CompanyAddress {
  address: Address;
  email?: string | null;
  website?: string | null;
  contacts: Contact[];
  defaultContact?: Contact | null;
}

export interface LegalInfo {
  taxPayerNumber?: string;
  tradeRegisterNumber?: string;
  taxAttachmentCenter?: string;
  shareCapital?: string;
  taxRegime?: string;
}

export interface Company {
  companyId?: string;
  legalName: string;
  parentId?: string | null;
  currencyId: string;
  status?: string;
  logo?: Media;
  legals?: LegalInfo;
  addresses?: CompanyAddress[];
  createdAt?: number[];
  updatedAt?: number[];
  parent?: ParentObjet;
  createdBy?: string;
  updatedBy?: string;
  code?: string;
  urlImage?: string;
  name: string;
  id?: string;
  defaultAddress?: CompanyAddress;
}

export interface Job {
  jobId: string;
  name: string;
  description: string;
  companyId?: string;
  departmentId?: string;
  department?: ParentObjet;
  departmentName?: string;
  companyName?: string;
  company?: ParentObjet;
}
export interface Department {
  departmentId: string;
  name: string;
  parentId?: string | null;
  parent?: ParentObjet;
  companyId?: string;
  companyName?: string;
  parentName?: string;
  company?: ParentObjet;
}
export interface ParentObjet {
  id?: string;
  description?: string;
  code?: string;
  name?: string;
}
