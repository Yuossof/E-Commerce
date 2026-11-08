export type UserRole = "user" | "admin";

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
}

export interface ILoginUser {
  email: string;
  password: string;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}