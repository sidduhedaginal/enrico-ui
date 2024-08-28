export interface PermissionDetails {
  createPermission: boolean;
  readPermission: boolean;
  editPermission: boolean;
  deletePermission: boolean;
  approvePermission: boolean;
  rejectPermission: boolean;
  delegatePermission: boolean;
  withdrawPermission: boolean;
  importPermission: boolean;
  exportPermission: boolean;
  ownershipChangePermission: boolean;
  sendBackPermission: boolean;
}

interface FeatureDetails {
  featureId: string;
  featureName: string;
  featureCode: string;
  permissionDetails: PermissionDetails;
}

interface ModuleDetails {
  moduleId: string;
  moduleName: string;
  featureDetails: FeatureDetails[];
}

interface RoleDetails {
  roleName: string;
  roleId: string;
  moduleDetails: ModuleDetails[];
}

interface RoleDetail {
  entityId: string;
  entityName: string;
  roleDetails: RoleDetails[];
}

interface CompanyInfo {
  companyCode: string;
  companyFullName: string;
  companyShortName: string;
  companyAddressStreet: string;
  companyAddressPostalCode: string;
  companyAddressCity: string;
  companyRegionName: string;
  companyCountryName: string;
}

export interface userProfileDetails {
  firstName: null;
  lastName: null;
  displayName: string;
  department: string;
  group: string;
  company: CompanyInfo;
  employeeNumber: number;
  roles: string[];
  roleDetail: RoleDetail[];
  entityId: string;
}
