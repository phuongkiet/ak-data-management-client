export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  token: string;
  birthday: string;
  phoneNumber: string;
  status: string;
  role: string[];
}

export interface UserLoginFormValues {
  email: string;
  password: string;
}

export interface UserAdminDTO {
  id: number;
  name: string;
  phoneNumber: string;
  email: string;
  birthday: Date;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  roleId: number;
}

export enum UserStatus {
  Active = 1,
  InActive = 0,
}

export enum Role{
  Admin = 2,
  Client = 1
}