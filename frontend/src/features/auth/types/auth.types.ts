export type UserRole = "analyst" | "admin";

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  initials: string;
}

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
}