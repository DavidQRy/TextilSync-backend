export type UserWithRole = {
  id: string;
  email: string;
  fullName: string;
  passwordHash: string;
  active: boolean;
  companyId: string;
  roleId: number;
  role: {
    id: number;
    name: string;
  };

};
