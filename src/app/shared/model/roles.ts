export interface Role {
  id?: string;
  name?: string;
  description?: string;
  companies?: string[];
  allowedCompanies?: string;
  rolePermissions?: Record<string, string[]> | string;
  parents?: string[];
  acls?: Acl[];

}
export interface Acl {
  module: string;
  permissions?: Record<string, string[]>;
}

export interface RoleAcl {
  code: string;
  roleId?: string;       // facultatif
  permissions: string[]; // toujours présent
}
