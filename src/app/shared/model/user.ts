import { MenuItem } from '../../layouts/sidebar/menu';
import { Company } from './company';
import { Skill } from './skill';
import { Media, MediaConfig } from './media';

export interface AuthResponse {
  requiresOtp?: boolean;
  token?: string;
  refreshToken?: string;
}

export interface DecodedToken {
  exp: number;
  iat: number;
  sub: string;
  email?: string;
  name?: string;
  phone?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;

  [key: string]: any;
}

export interface Currency {
  code: string;
  symbol: string;
  position: 'before' | 'after';
}

export type Permissions = Record<string, Record<string, string[]>>;

export interface PermissionWrapper {
  permissionDatas: Permissions;
}

export interface UserContext {
  login?: string;
  company?: string;
  employee?: string;
  status?: string;
  userId?: string;
  username?: string;
  email?: string;
  phone?: string;
  fullName?: string;
  jobTitle?: string;
  language?: string;
  timezone?: string;
  defaultCompanyId?: string;
  currentCompanyId?: string;
  allowedCompanies?: Company[];
  roles?: string[];
  permissions?: PermissionWrapper;
}

export interface UserSession {
  userContext: UserContext;
  menuContext: MenuContext;
}

export interface MenuContext {
  userId: string;
  currentCompanyId: string;
  menus: MenuItem[];
}

export interface UserLogin {
  username: string;
  deviceToken: 'web' | 'mobile';
  password: string;
}

export interface TabItem {
  label: string;
  link?: string;
  active?: boolean;
}

export interface PartnerAttribute {
  type?: string;
  firstname?: string;
  lastname?: string;
  phone?: string;
  address?: string;
  technicianType?: string,
  technicianCategory?: string,
  contacts: Contact[];
  skills?: Skill[];
  technicianGrade?: string;
  acronym?: string;
  slogan?: string;
  legalStatus?: string;
  commercialRegisterNumber?: string;
  taxPayerNumber?: string;
  taxRegime?: string;
  applicableTaxesAndDuties?: string;
}



export interface Partner {
  partnerId?: string;
  parentId?:  null;
  name?: string;
  urlImage?: string;
  username?: string | null;
  email?: string;
  phone?: string;
  company?: string;
  language?: 'EN' | 'FR';
  companies?: CompanyAssignment[];
  contacts?: Contact[];
  addresses?: Address[];
  partnerType?: 'IOLA_EMPLOYEE' | string;
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
  createdBy?: string;
  updatedBy?: string;
  employeeId?: string;
  lastname?: string;
  firstname?: string;
  address?: string;
  status?: string;
  employeeContract?: EmployeeContract | null;
  picture?: Media;
  createAccount?: boolean;
  partnerAttribute?: PartnerAttribute;
  defaultCompanyId?: string;
  currentCompanyId?: string;
  technicianCategory?: string;
  technicianType?: string;
  skills?: Skill[];
  documents?: Media[];
  technicianGrade?: string;
  acronym?: string;
  slogan?: string;
  legalStatus?: string;
  commercialRegisterNumber?: string;
  taxPayerNumber?: string;
  taxRegime?: string;
  applicableTaxesAndDuties?: string;
  logo?: string | null;
  manager?: any;

}

export interface CompanyAssignment {
  company: EntityInfo;
  department: EntityInfo;
  job: EntityInfo & { description?: string | null };
  manager: EntityInfo;
  defaultCompany: boolean;
  roles: string[];
}

export interface EntityInfo {
  id: string;
  name: string;
  code: string | null;
  description?: string | null;
}

export interface Contact {
  phone: string;
  defaultContact: boolean;
  whatsapp: boolean;
}

export interface Address {
  addressType: string | null;
  street: string;
  complement: string | null;
  postalCode: string | null;
  quarter: string | null;
  city: string | null;
  region: string | null;
  country: string;
  countryCode: string | null;
  latitude: number | null;
  longitude: number | null;
  defaultAddress: boolean;
}

export interface EmployeeContract {
  contracts?: ContractFile[];
  officialBaseSalary?: number;
  additionalInformation?: string;
}

export interface ContractFile {
  mediaId: string;
  mediaTypeId: string;
  mediaTypeCode: string;
  url: string;
}


export interface Document {
  name: string;
  type: string;
  url: string;
  uploadDate: Date;
}

export interface Technicien {
  technicianId?: string;
  partnerId?: string;
  type: 'entreprise' | 'physique';
  createdAt: Date;
  updatedAt: Date;
  status: 'active' | 'inactive' | 'pending';
  documents?: Document[];
}

export interface TechnicienEntreprise extends Technicien {
  technicianCategory?: string;
  name?: string;
  email?: string | null;
  phone?: string;
  technicianType?: string;
  skills?: (string | null)[];
  documents?: any[];
  companies?: any[];
  contacts?: {
    phone: string;
    defaultContact: boolean;
    whatsapp: boolean;
  }[];
  addresses?: Address[];
  technicianGrade?: string;
  acronym?: string;
  slogan?: string;
  legalStatus?: string;
  commercialRegisterNumber?: string;
  taxPayerNumber?: string;
  taxRegime?: string;
  applicableTaxesAndDuties?: string;
  logo?: string | null;
  manager?: any;
}
