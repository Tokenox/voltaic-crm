export type LeadsTypes = {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  categoryId: string;
};

export type CategoryTypes = {
  name: string;
  description: string;
};

export type CategoryResponseTypes = {
  id: string;
  name: string;
  description: string;
  adminId: string;
  orgId: string;
  fields: FieldTypes[];
};

export type RegisterOrgTypes = {
  id?: string;
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  company: string;
  agree?: boolean;
  verifyCode?: string;
};

export type FieldTypes = {
  name: string;
  type: string;
};

export type PlannerDataTypes = {
  title: string;
  action: string;
  description: string;
  startDate: string;
  endDate: string;
  timeOfExecution: string;
};

export type RoleDataTypes = {
  name: string;
};

export type PlannerResponseTypes = {
  _id: string;
  title: string;
  action: string;
  description: string;
  startDate: string;
  timeOfExecution: string;
  adminId: string;
};

export type AdminResponseTypes = {
  id: string;
  name: string;
  role: string;
  company: string;
  email: string;
  recordID: string;
  twoFactorEnabled: boolean;
  orgId: string;
  token: string;
  isSuperAdmin: boolean;
};

export type LeadValueTypes = {
  name: string;
  type: string;
  value: string;
};
