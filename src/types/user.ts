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


export type UserCreate = {
  id: string;
  email: string;
  fullName: string;
  password: string;
  active: boolean;
  companyId: string;
  roleId: number;
}

export interface UserUpdateDTO {
  fullName?: string;
  password?: string;
  roleId?: number;
  active?: boolean;
}

