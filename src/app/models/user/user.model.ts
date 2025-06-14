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
  roleId: number;
  avatarUrl: string;
}

export interface UserLoginFormValues {
  email: string;
  password: string;
}

export interface UserDto {
  id: number;
  name: string;
  phoneNumber: string;
  email: string;
  status: UserStatus;
  role: string;
  birthday: string;
  userName: string;
  roleId: number;
  avatarUrl: string;
}

export interface AddUserDto{
  birthday: string | null;
  fullName: string;
  userName: string;
  phoneNumber: string;
  email: string;
  roleId: number;
}

export interface UserUpdateDto{
  birthday: string | null;
  name: string;
  userName: string;
  phoneNumber: string | null;
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